import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Upload,
  FileText,
  X,
  Bot,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { employeesAPI } from "../api/employees";

const employeeSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  department: yup.string().required("Department is required"),
  designation: yup.string().required("Designation is required"),
  salary: yup
    .number()
    .typeError("Salary must be a number")
    .positive()
    .required("Salary is required"),
  joiningDate: yup.date().required("Joining Date is required"),
});

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");
  const [resumeFile, setResumeFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) setResumeFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    maxSize: 5242880,
  });

  const simulateAiParsing = () => {
    if (!resumeFile) {
      toast.error("Please upload a resume first");
      return;
    }
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      const parsedData = {
        name: "Alexander Chen",
        email: "alex.chen@example.com",
        phone: "+1 555-0198",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        suggestedDesignation: "Senior Frontend Developer",
        suggestedDepartment: "Engineering",
        confidenceScore: 92,
      };
      setAiSuggestions(parsedData);
      setValue("name", parsedData.name);
      setValue("email", parsedData.email);
      setValue("phone", parsedData.phone);
      setValue("designation", parsedData.suggestedDesignation);
      setValue("department", parsedData.suggestedDepartment);
      toast.success("Resume parsed successfully!");
    }, 3000);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await employeesAPI.create({
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        department: data.department,
        designation: data.designation,
        salary: data.salary,
        joiningDate: data.joiningDate,
      });

      const responseBody = response?.data;
      if (responseBody?.success === false) {
        throw new Error(responseBody.message || "Failed to add employee");
      }

      const employee = responseBody?.data || responseBody || {};
      const employeeId = employee?._id || employee?.id || "";

      setNewEmployeeData({
        name: data.name,
        email: data.email,
        id: employeeId,
      });
      setShowSuccessModal(true);
      toast.success(responseBody?.message || "Employee added successfully");
    } catch (err) {
      const errorData = err.response?.data || err;
      console.error("Add employee error:", errorData);
      const msg =
        err.response?.data?.message || err.message || "Failed to add employee";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSetupLink = () => {
    const params = new URLSearchParams({
      email: newEmployeeData?.email || "",
      employeeId: newEmployeeData?.id || "",
    });
    return `${window.location.origin}/setup-password?${params.toString()}`;
  };

  const handleCopyLink = () => {
    const link = getSetupLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success("Setup link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/employees");
  };

  const handleSendSetupLink = async () => {
    if (!newEmployeeData?.email) {
      toast.error("Email not available");
      return;
    }

    setIsSendingEmail(true);
    try {
      const setupLink = getSetupLink();
      await employeesAPI.sendSetupLink({
        email: newEmployeeData.email,
        setupLink: setupLink,
        employeeName: newEmployeeData.name,
      });

      toast.success("Setup link sent to employee's email!");
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/employees");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send email";
      toast.error(msg);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/employees")}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Employee
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a new employee record
          </p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("manual")}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "manual" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center ${activeTab === "ai" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
        >
          <Bot className="w-4 h-4 mr-2" /> AI Resume Parser
          <span className="ml-2 bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase dark:bg-indigo-900/50 dark:text-indigo-300">
            Beta
          </span>
        </button>
      </div>

      {activeTab === "ai" && (
        <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> Smart Resume
              Parsing
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Upload a candidate's resume and let our AI automatically extract
              their details.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragActive ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-gray-800"}`}
          >
            <input {...getInputProps()} />
            {resumeFile ? (
              <div className="flex flex-col items-center">
                <FileText className="h-12 w-12 text-indigo-500 mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {resumeFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                    setAiSuggestions(null);
                  }}
                  className="mt-4 text-xs text-red-500 hover:text-red-700 flex items-center"
                >
                  <X className="w-3 h-3 mr-1" /> Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Drag & drop resume here, or click to select
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Supports PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            )}
          </div>

          {resumeFile && !aiSuggestions && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={simulateAiParsing}
                isLoading={isParsing}
                className="w-full sm:w-auto"
              >
                {isParsing
                  ? "Analyzing Document..."
                  : "Extract Details with AI"}
              </Button>
            </div>
          )}

          {aiSuggestions && (
            <div className="mt-6 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-emerald-800 dark:text-emerald-400">
                  ✅ Extracted Successfully
                </h4>
                <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Confidence: {aiSuggestions.confidenceScore}%
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Detected Skills:</strong>{" "}
                {aiSuggestions.skills.join(", ")}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                The form below has been automatically populated with the
                extracted data.
              </p>
            </div>
          )}
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                {...register("name")}
                error={errors.name?.message}
                placeholder="John Doe"
              />
              <Input
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="john@example.com"
              />
              <Input
                label="Phone Number"
                {...register("phone")}
                error={errors.phone?.message}
                placeholder="+1 234 567 890"
              />
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mt-8">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Department
                </label>
                <select
                  {...register("department")}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>
              <Input
                label="Designation"
                {...register("designation")}
                error={errors.designation?.message}
                placeholder="Software Engineer"
              />
              <Input
                label="Salary (Annual)"
                type="number"
                {...register("salary")}
                error={errors.salary?.message}
                placeholder="60000"
              />
              <Input
                label="Joining Date"
                type="date"
                {...register("joiningDate")}
                error={errors.joiningDate?.message}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/employees")}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Employee
            </Button>
          </div>
        </Card>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
        showHeader={false}
      >
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Employee Added Successfully!
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {newEmployeeData?.name} has been added to the system. Send them
            their setup link via email or share the link manually.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  {newEmployeeData?.email}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-3">
              <Button
                variant="primary"
                onClick={handleSendSetupLink}
                isLoading={isSendingEmail}
                className="w-full flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isSendingEmail ? "Sending..." : "Send Setup Link via Email"}
              </Button>
            </div>

            <div className="border-t border-blue-200 dark:border-blue-800 pt-3 mt-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                <strong>Or copy the link manually:</strong>
              </p>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 mb-2">
                <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
                  {getSetupLink()}
                </code>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md transition-colors text-sm font-medium"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>✉️ Setup Instructions:</strong> The employee will receive
              an OTP on their email, then create their password using the setup
              link.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/employees/new");
              }}
              className="flex-1"
            >
              Add Another Employee
            </Button>
            <Button
              variant="primary"
              onClick={handleCloseModal}
              className="flex-1"
            >
              Go to Employees List
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEmployee;
