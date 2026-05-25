import React, { useState } from 'react';
import { Download, FileText, Activity } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const ACTIVITY_LOGS = [
  { id: 1, timestamp: '2026-05-19 10:15 AM', user: 'Admin User', action: 'Created Employee', entity: 'John Doe', ip: '192.168.1.100' },
  { id: 2, timestamp: '2026-05-19 09:30 AM', user: 'HR Manager', action: 'Approved Leave', entity: 'Req #124', ip: '192.168.1.105' },
  { id: 3, timestamp: '2026-05-18 16:45 PM', user: 'Admin User', action: 'Updated Department', entity: 'Engineering', ip: '192.168.1.100' },
  { id: 4, timestamp: '2026-05-18 09:05 AM', user: 'System', action: 'Failed Login', entity: 'admin@test.com', ip: '203.0.113.45' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'salary' | 'attendance'
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (reportId) => {
    setIsGenerating(true);
    const element = document.getElementById(reportId);
    
    // Make sure element is visible for capture if we hide it usually
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${reportId}-report.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      element.style.display = originalDisplay;
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Logs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">System activity and document generation</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <Activity className="w-4 h-4 mr-2" /> Activity Logs
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === 'salary' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <FileText className="w-4 h-4 mr-2" /> Salary Slip
        </button>
      </div>

      {activeTab === 'activity' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Entity</th>
                  <th className="px-6 py-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITY_LOGS.map((log) => (
                  <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={log.action.includes('Failed') ? 'danger' : 'gray'}>{log.action}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{log.entity}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={() => generatePDF('salary-slip-template')}
              isLoading={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-white text-gray-900 dark:bg-white dark:text-gray-900 overflow-x-auto">
            {/* The actual template for PDF rendering */}
            <div id="salary-slip-template" className="p-8 min-w-[600px] bg-white">
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-indigo-700">StaffSync Technologies</h1>
                <p className="text-sm text-gray-600">123 Business Avenue, Tech District, NY 10001</p>
                <h2 className="text-xl font-semibold mt-4">Salary Slip - May 2026</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <p><span className="font-semibold w-32 inline-block">Employee Name:</span> John Doe</p>
                  <p><span className="font-semibold w-32 inline-block">Employee ID:</span> EMP-1045</p>
                  <p><span className="font-semibold w-32 inline-block">Designation:</span> Senior Developer</p>
                </div>
                <div>
                  <p><span className="font-semibold w-32 inline-block">Department:</span> Engineering</p>
                  <p><span className="font-semibold w-32 inline-block">Bank A/C:</span> XXXX-XXXX-1234</p>
                  <p><span className="font-semibold w-32 inline-block">PAN:</span> ABCDE1234F</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-2 text-left">Earnings</th>
                        <th className="border border-gray-300 p-2 text-right">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">Basic Salary</td>
                        <td className="border border-gray-300 p-2 text-right">4,500.00</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">House Rent Allowance</td>
                        <td className="border border-gray-300 p-2 text-right">1,800.00</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Special Allowance</td>
                        <td className="border border-gray-300 p-2 text-right">1,200.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-2 text-left">Deductions</th>
                        <th className="border border-gray-300 p-2 text-right">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">Provident Fund</td>
                        <td className="border border-gray-300 p-2 text-right">540.00</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Professional Tax</td>
                        <td className="border border-gray-300 p-2 text-right">50.00</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Income Tax</td>
                        <td className="border border-gray-300 p-2 text-right">800.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t-2 border-gray-800 pt-4 mb-16 flex justify-between font-bold text-lg">
                <span>Net Pay:</span>
                <span className="text-indigo-700">$ 6,110.00</span>
              </div>

              <div className="flex justify-between text-sm pt-8 border-t border-gray-300 mt-16">
                <div className="text-center w-48">
                  <div className="border-b border-gray-800 h-8 mb-2"></div>
                  <p>Employee Signature</p>
                </div>
                <div className="text-center w-48">
                  <div className="border-b border-gray-800 h-8 mb-2 text-indigo-600 font-serif italic text-xl flex items-end justify-center">Authorized</div>
                  <p>Employer Signature</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
