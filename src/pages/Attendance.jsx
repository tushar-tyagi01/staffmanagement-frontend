import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Square,
  Loader2,
} from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { attendanceAPI } from "../api/attendance";

const Attendance = () => {
  const location = useLocation();
  const isPersonalView = location.pathname === "/my-attendance";
  const [viewMode, setViewMode] = useState("list");
  const [todayRecord, setTodayRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const today = new Date();
  const startDate = startOfWeek(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, listRes] = await Promise.all([
        attendanceAPI.getTodayStatus(),
        attendanceAPI.getAll({ limit: 30 }),
      ]);
      setTodayRecord(statusRes.data.data);
      setRecords(listRes.data.data);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceAPI.checkIn();
      setTodayRecord(res.data.data);
      toast.success("Checked in successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceAPI.checkOut();
      setTodayRecord(res.data.data);
      toast.success("Checked out successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "Absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Late":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Leave":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getEmployeeName = (record) =>
    record.employeeName || record.employee?.name || record.user?.name || "—";

  const statusText = isCheckedIn
    ? isCheckedOut
      ? `Checked out (${todayRecord.checkOut})`
      : `Checked in (${todayRecord.checkIn})`
    : "Not Checked In";

  const pageTitle = isPersonalView ? "My Attendance" : "Attendance Management";
  const pageDescription = isPersonalView
    ? "Track your personal attendance history and check-in details."
    : "Review team attendance, daily status, and records across the company.";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {pageTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {pageDescription}
        </p>
      </div>

      {/* Check-In Widget */}
      <Card className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border-indigo-200 dark:border-indigo-800/50">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-full mr-4 shadow-sm">
            <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {format(today, "EEEE, MMMM do yyyy")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status: {statusText}
            </p>
          </div>
        </div>
        {isPersonalView ? (
          !isCheckedOut ? (
            <Button
              variant={isCheckedIn ? "danger" : "primary"}
              size="lg"
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              isLoading={actionLoading}
              className="w-full sm:w-auto"
            >
              {isCheckedIn ? (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Check Out
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Check In
                </>
              )}
            </Button>
          ) : (
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium">
              Duration: {todayRecord.duration}
            </span>
          )
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            This view is optimized for attendance review. Personal check-in and
            check-out actions are available from the employee attendance
            dashboard.
          </p>
        )}
      </Card>

      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {["calendar", "list"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center capitalize
                ${viewMode === mode ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
            >
              {mode === "calendar" ? (
                <CalendarIcon className="h-4 w-4 mr-2" />
              ) : (
                <Clock className="h-4 w-4 mr-2" />
              )}
              {mode}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : viewMode === "calendar" ? (
        <Card className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-center font-semibold text-sm text-gray-500 dark:text-gray-400 py-2"
              >
                {d}
              </div>
            ))}
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, today);
              const dayRecord = records.find(
                (r) => r.date === format(day, "yyyy-MM-dd"),
              );
              const status =
                i === 0 || i === 6 ? "Weekend" : dayRecord?.status || null;
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] p-2 border rounded-lg flex flex-col
                    ${isToday ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-gray-200 dark:border-gray-700"}`}
                >
                  <span
                    className={`text-sm font-medium ${isToday ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {format(day, "d")}
                  </span>
                  {status && status !== "Weekend" && (
                    <div
                      className={`mt-auto text-xs px-2 py-1 rounded-md text-center font-medium ${getStatusColor(status)}`}
                    >
                      {status}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            {records.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                No attendance records yet.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {[
                      "Date",
                      !isPersonalView && "Employee",
                      "Status",
                      "Check In",
                      "Check Out",
                      "Duration",
                    ]
                      .filter(Boolean)
                      .map((h) => (
                        <th key={h} className="px-6 py-3 font-medium">
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr
                      key={rec._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {format(new Date(rec.date), "MMM dd, yyyy (EEE)")}
                      </td>
                      {!isPersonalView && (
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {getEmployeeName(rec)}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {rec.status === "Present" && (
                            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                          )}
                          {rec.status === "Absent" && (
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          {rec.status === "Late" && (
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                          )}
                          <span className="font-medium">{rec.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {rec.checkIn || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {rec.checkOut || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {rec.duration || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Attendance;
