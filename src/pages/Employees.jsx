import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MoreVertical,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/constants";
import { employeesAPI } from "../api/employees";

const columnHelper = createColumnHelper();

const Employees = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdminOrHR = user?.role === ROLES.ADMIN || user?.role === ROLES.HR;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeesAPI.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      });
      setData(res.data.data);
      setTotalRows(res.data.pagination.total);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await employeesAPI.remove(id);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Employee",
        cell: (info) => (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs mr-3">
              {info.getValue()?.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {info.getValue()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {info.row.original.email}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("department", {
        header: "Department",
        cell: (info) => <Badge variant="gray">{info.getValue() || "—"}</Badge>,
      }),
      columnHelper.accessor("designation", { header: "Designation" }),
      columnHelper.accessor("joiningDate", {
        header: "Joining Date",
        cell: (info) =>
          info.getValue()
            ? format(new Date(info.getValue()), "MMM dd, yyyy")
            : "—",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <Badge variant={info.getValue() === "active" ? "success" : "danger"}>
            {info.getValue() === "active" ? "Active" : "Inactive"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
              <Eye className="h-4 w-4" />
            </button>
            {isAdminOrHR && (
              <>
                <button
                  onClick={() =>
                    navigate(`/employees/${info.row.original._id}/edit`)
                  }
                  className="p-1 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(info.row.original._id)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ),
      }),
    ],
    [isAdminOrHR, navigate],
  );

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employees
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your workforce ({totalRows} total)
          </p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          {isAdminOrHR && (
            <Button
              variant="primary"
              onClick={() => navigate("/employees/new")}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          )}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out dark:text-white"
              placeholder="Search employees..."
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              No employees found.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{ asc: " 🔼", desc: " 🔽" }[
                            header.column.getIsSorted()
                          ] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalRows > 0
              ? `Showing ${pagination.pageIndex * pagination.pageSize + 1} to ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)} of ${totalRows} entries`
              : "No entries"}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Employees;
