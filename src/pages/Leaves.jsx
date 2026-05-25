import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CalendarDays, Plus, Check, X, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { ROLES } from "../utils/constants";
import { leavesAPI } from "../api/leaves";

const leaveSchema = yup.object().shape({
  type: yup.string().required("Leave type is required"),
  from: yup.date().required("Start date is required"),
  to: yup
    .date()
    .min(yup.ref("from"), "End date must be after start date")
    .required("End date is required"),
  reason: yup
    .string()
    .required("Reason is required")
    .min(10, "Please provide more detail"),
});

const Leaves = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isPersonalView = location.pathname === "/my-leaves";
  const isAdminOrHR = user?.role === ROLES.ADMIN || user?.role === ROLES.HR;
  const isManager = user?.role === ROLES.MANAGER;
  const canApprove = !isPersonalView && (isAdminOrHR || isManager);
  const canApply =
    isPersonalView && [ROLES.EMPLOYEE, ROLES.MANAGER].includes(user?.role);
  const pageTitle = isPersonalView ? "My Leaves" : "Leave Requests";
  const pageDescription = isPersonalView
    ? "View your leave balance and request history."
    : "Review, approve, and manage leave requests for your team.";

  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(leaveSchema),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leavesRes, balanceRes] = await Promise.all([
        leavesAPI.getAll(),
        leavesAPI.getBalance(),
      ]);
      setLeaves(leavesRes.data.data);
      setBalance(balanceRes.data.data);
    } catch {
      toast.error("Failed to load leave data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmitLeave = async (data) => {
    setSubmitting(true);
    try {
      await leavesAPI.create({
        type: data.type,
        from: data.from.toISOString().split("T")[0],
        to: data.to.toISOString().split("T")[0],
        reason: data.reason,
      });
      toast.success("Leave application submitted successfully");
      setIsApplyModalOpen(false);
      reset();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit leave");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leavesAPI.updateStatus(id, newStatus);
      toast.success(`Leave request ${newStatus.toLowerCase()}`);
      fetchData();
    } catch {
      toast.error("Failed to update leave status");
    }
  };

  const filteredLeaves = leaves.filter(
    (l) => activeTab === "All" || l.status === activeTab,
  );

  const BALANCE_COLORS = {
    "Annual Leave":
      "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300",
    "Sick Leave":
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    "Casual Leave":
      "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    Unpaid:
      "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pageDescription}
          </p>
        </div>
        {canApply ? (
          <Button variant="primary" onClick={() => setIsApplyModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Apply Leave
          </Button>
        ) : (
          !isPersonalView && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This view is reserved for leave approvals and team leave
              management. Personal leave applications are available from the
              employee leave dashboard.
            </p>
          )
        )}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {balance.length > 0
          ? balance.map((b) => (
              <Card key={b.type} className={BALANCE_COLORS[b.type] || ""}>
                <h3 className="text-sm font-medium">{b.type}</h3>
                <p className="mt-2 text-3xl font-bold">
                  {b.remaining}
                  <span className="text-sm font-normal opacity-70">
                    {" "}
                    / {b.allowed} left
                  </span>
                </p>
              </Card>
            ))
          : // Skeleton placeholders while loading
            ["Annual Leave", "Sick Leave", "Casual Leave", "Unpaid"].map(
              (t) => (
                <Card key={t} className={BALANCE_COLORS[t] || ""}>
                  <h3 className="text-sm font-medium">{t}</h3>
                  <p className="mt-2 text-3xl font-bold">—</p>
                </Card>
              ),
            )}
      </div>

      {/* Leaves Table */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No leave requests found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {canApprove && (
                    <th className="px-6 py-3 font-medium">Employee</th>
                  )}
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Days</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Applied On</th>
                  {canApprove && (
                    <th className="px-6 py-3 font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {canApprove && (
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {leave.user?.name || "—"}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        {leave.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {leave.from}{" "}
                      <span className="mx-1 text-gray-400">to</span> {leave.to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {leave.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          leave.status === "Approved"
                            ? "success"
                            : leave.status === "Rejected"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {leave.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {leave.appliedOn}
                    </td>
                    {canApprove && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {leave.status === "Pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleStatusChange(leave._id, "Approved")
                              }
                              className="p-1 text-emerald-600 bg-emerald-100 rounded-md hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(leave._id, "Rejected")
                              }
                              className="p-1 text-red-600 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Actioned
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmitLeave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Leave Type
            </label>
            <select
              {...register("type")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select type...</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              {...register("from")}
              error={errors.from?.message}
            />
            <Input
              label="To Date"
              type="date"
              {...register("to")}
              error={errors.to?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Reason
            </label>
            <textarea
              {...register("reason")}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              placeholder="Please provide a detailed reason..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-500">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leaves;
