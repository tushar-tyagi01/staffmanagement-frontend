import React, { useState, useEffect } from "react";
import { Plus, Users, LayoutGrid, List, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/constants";
import { departmentsAPI } from "../api/departments";

const Departments = () => {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === ROLES.ADMIN || user?.role === ROLES.HR;
  const [viewMode, setViewMode] = useState("grid");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", manager: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    departmentsAPI
      .getAll()
      .then((res) => setDepartments(res.data.data))
      .catch(() => toast.error("Failed to load departments"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newDept = await departmentsAPI.create({
        name: formData.name,
        manager: formData.manager || null,
      });

      setDepartments([...departments, newDept.data.data]);
      setFormData({ name: "", manager: "" });
      setIsModalOpen(false);
      toast.success("Department added successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add department";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Departments
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage company departments and teams
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          {isAdminOrHR && (
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Department
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : departments.length === 0 ? (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          No departments found. Add one to get started.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card
              key={dept._id}
              className="flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <Badge variant={dept.pendingLeaves > 0 ? "warning" : "gray"}>
                  {dept.pendingLeaves} leaves pending
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {dept.name}
              </h3>
              <div className="mt-4 space-y-2 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Manager:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {dept.managerName || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Employees:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {dept.employees}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Created:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {new Date(dept.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="w-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Manager</th>
                  <th className="px-6 py-3 font-medium">Employees</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr
                    key={dept._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {dept.managerName || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {dept.employees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dept.pendingLeaves > 0 ? (
                        <Badge variant="warning">
                          {dept.pendingLeaves} pending leaves
                        </Badge>
                      ) : (
                        <Badge variant="success">All clear</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 dark:text-indigo-400"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Department"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddDepartment} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="Enter department name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Manager (Optional)"
            placeholder="Enter manager name"
            value={formData.manager}
            onChange={(e) =>
              setFormData({ ...formData, manager: e.target.value })
            }
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Department"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
