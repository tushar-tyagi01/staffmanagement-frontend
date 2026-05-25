import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  UserPlus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../api/dashboard";
import { useNavigate } from "react-router-dom";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  colorClass,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`${onClick ? "cursor-pointer hover:shadow-md" : ""} transition-all duration-200`}
  >
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </h4>
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trendLabel && (
        <div className="mt-4 flex items-center text-sm">
          {trend !== undefined && (
            <span className={trend > 0 ? "text-emerald-500" : "text-red-500"}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            {trendLabel}
          </span>
        </div>
      )}
    </Card>
  </div>
);

const FALLBACK = {
  departmentStats: [
    { name: "Engineering", count: 45 },
    { name: "Sales", count: 30 },
    { name: "Marketing", count: 20 },
    { name: "HR", count: 15 },
    { name: "Finance", count: 10 },
  ],
  attendanceTrend: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    present: Math.floor(Math.random() * 20) + 100,
    absent: Math.floor(Math.random() * 10),
  })),
  leaveDistribution: [
    { name: "Sick Leave", value: 35 },
    { name: "Annual Leave", value: 45 },
    { name: "Casual Leave", value: 15 },
    { name: "Unpaid", value: 5 },
  ],
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI
      .getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const departmentStats = stats?.departmentStats?.length
    ? stats.departmentStats.map((d) => ({ name: d.name, count: d.count }))
    : FALLBACK.departmentStats;

  const attendanceTrend = stats?.attendanceTrend?.length
    ? stats.attendanceTrend.map((d, i) => ({
        day: `Day ${i + 1}`,
        present: d.present,
        absent: d.absent,
      }))
    : FALLBACK.attendanceTrend;

  const leaveDistribution = stats?.leaveDistribution?.length
    ? stats.leaveDistribution
    : FALLBACK.leaveDistribution;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/employees/new")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/departments")}
          >
            Manage Departments
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={loading ? "..." : (stats?.totalEmployees ?? "--")}
          icon={Users}
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          onClick={() => navigate("/employees")}
        />
        <StatCard
          title="Present Today"
          value={loading ? "..." : (stats?.presentToday ?? "--")}
          icon={UserCheck}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          onClick={() => navigate("/attendance")}
        />
        <StatCard
          title="Pending Leaves"
          value={loading ? "..." : (stats?.pendingLeaves ?? "--")}
          icon={CalendarDays}
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          onClick={() => navigate("/leaves")}
        />
        <StatCard
          title="New Hires"
          value={loading ? "..." : (stats?.newHires ?? "--")}
          icon={UserPlus}
          trendLabel="this month"
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => navigate("/employees/new")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => navigate("/departments")}
          >
            Manage Departments
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => navigate("/reports")}
          >
            Reports
          </Button>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Employees by Department
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentStats}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#374151"
                  opacity={0.2}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-base)",
                    color: "var(--text-base)",
                  }}
                  cursor={{ fill: "var(--border-base)", opacity: 0.4 }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance Trend (30 Days)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceTrend}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#374151"
                  opacity={0.2}
                />
                <XAxis dataKey="day" hide />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={["dataMin - 10", "dataMax + 10"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-base)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leave Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-base)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 gap-4 flex-wrap">
              {leaveDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center text-sm">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
