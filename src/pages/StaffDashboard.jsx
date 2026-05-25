import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Briefcase,
  Users,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { leavesAPI } from "../api/leaves";
import { attendanceAPI } from "../api/attendance";

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myAttendance, setMyAttendance] = useState(null);
  const [myLeaves, setMyLeaves] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch personal attendance and leave data
        const [attendanceRes, leavesRes] = await Promise.all([
          attendanceAPI.getMyAttendance?.() ||
            Promise.resolve({ data: { data: null } }),
          leavesAPI.getMyLeaves?.() || Promise.resolve({ data: { data: [] } }),
        ]);

        setMyAttendance(attendanceRes.data?.data);
        setMyLeaves(leavesRes.data?.data || []);      
      } catch (err) {
        console.error("Failed to load personal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const pendingLeaves =
    myLeaves?.filter((l) => l.status === "pending")?.length || 0;
  const approvedLeaves =
    myLeaves?.filter((l) => l.status === "approved")?.length || 0;
  const thisMonthAttendance = myAttendance?.thisMonthDays || 0;
  const thisMonthPresent = myAttendance?.presentDays || 0;
  const attendancePercentage =
    thisMonthAttendance > 0
      ? Math.round((thisMonthPresent / thisMonthAttendance) * 100)
      : 0;

  const StatCard = ({ title, value, icon: Icon, subtext, colorClass }) => (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </h4>
          {subtext && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Department: {user?.department || "N/A"}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance (This Month)"
          value={`${thisMonthPresent}/${thisMonthAttendance}`}
          icon={CheckCircle}
          subtext={`${attendancePercentage}% Present`}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          title="Pending Leave Requests"
          value={pendingLeaves}
          icon={Clock}
          subtext="Awaiting approval"
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <StatCard
          title="Approved Leaves"
          value={approvedLeaves}
          icon={CheckCircle}
          subtext="Total approved"
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatCard
          title="My Profile"
          value={user?.email?.split("@")[0] || "N/A"}
          icon={Briefcase}
          subtext="Employee ID"
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => navigate("/my-attendance")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Attendance
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => navigate("/my-leaves")}
              >
                <FileText className="h-4 w-4 mr-2" />
                My Leaves
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => navigate("/settings")}
              >
                <Users className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Leave Requests */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Leave Requests
            </h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : myLeaves && myLeaves.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {myLeaves.slice(0, 5).map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {leave.leaveType}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        leave.status === "approved"
                          ? "success"
                          : leave.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No leave requests yet
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Important Information
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>
                Submit leave requests at least 7 days in advance for better
                approval chances
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>Mark your attendance within 1 hour of work start time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>
                Contact HR for any policy clarifications or assistance
              </span>
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            Need Help?
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Contact HR Department
              </p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                hr@company.com
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Reporting Manager
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {user?.manager || "Not assigned"}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center mt-4"
              onClick={() => navigate("/settings")}
            >
              View Contact Directory
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
