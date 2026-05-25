import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Lock, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/constants";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { employeesAPI } from "../api/employees";

const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  department: yup.string(),
  designation: yup.string(),
  joiningDate: yup.date(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  pinCode: yup.string(),
  emergencyContact: yup.string(),
  emergencyContactPhone: yup.string(),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const Settings = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
    watch: watchProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const isAdmin = user?.role === ROLES.ADMIN;
  const isStaff = user?.role === ROLES.HR;
  const isEmployee = user?.role === ROLES.EMPLOYEE;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // Fetch user profile details
        const res = await employeesAPI.getOne(user?._id);
        const data = res.data.data;
        setProfileData(data);

        // Set form values
        resetProfile({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          department: data.department || "",
          designation: data.designation || "",
          joiningDate: data.joiningDate ? data.joiningDate.split("T")[0] : "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pinCode: data.pinCode || "",
          emergencyContact: data.emergencyContact || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile details");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      loadProfile();
    }
  }, [user?._id, resetProfile]);

  const onProfileSubmit = async (data) => {
    try {
      await employeesAPI.update(user._id, data);

      // Update auth context with new user data
      const token = localStorage.getItem("token");
      const updatedUser = { ...user, ...data };
      login(updatedUser, token);

      toast.success("Profile updated successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      // This would typically call a different endpoint for password changes
      // For now, we'll show a placeholder
      await employeesAPI.update(user._id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      resetPassword();
      toast.success("Password changed successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "profile"
              ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
              : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </div>
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "password"
              ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
              : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </div>
        </button>
        <button
          onClick={() => setActiveTab("employee")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "employee"
              ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400"
              : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Employee
          </div>
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...registerProfile("name")}
                  error={profileErrors.name?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  {...registerProfile("email")}
                  error={profileErrors.email?.message}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  {...registerProfile("phoneNumber")}
                  error={profileErrors.phoneNumber?.message}
                />
                <Input
                  label="Joining Date"
                  type="date"
                  {...registerProfile("joiningDate")}
                  error={profileErrors.joiningDate?.message}
                />
              </div>
            </div>

            {/* Work Information Section */}
            {(isAdmin || isStaff || isEmployee) && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Work Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    placeholder="Enter department"
                    {...registerProfile("department")}
                    error={profileErrors.department?.message}
                  />
                  <Input
                    label="Designation"
                    placeholder="Enter designation"
                    {...registerProfile("designation")}
                    error={profileErrors.designation?.message}
                  />
                </div>
              </div>
            )}

            {/* Address Information Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address"
                  placeholder="Enter street address"
                  {...registerProfile("address")}
                  error={profileErrors.address?.message}
                />
                <Input
                  label="City"
                  placeholder="Enter city"
                  {...registerProfile("city")}
                  error={profileErrors.city?.message}
                />
                <Input
                  label="State"
                  placeholder="Enter state"
                  {...registerProfile("state")}
                  error={profileErrors.state?.message}
                />
                <Input
                  label="Pin Code"
                  placeholder="Enter pin code"
                  {...registerProfile("pinCode")}
                  error={profileErrors.pinCode?.message}
                />
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Emergency Contact Name"
                  placeholder="Enter contact person name"
                  {...registerProfile("emergencyContact")}
                  error={profileErrors.emergencyContact?.message}
                />
                <Input
                  label="Emergency Contact Phone"
                  placeholder="Enter contact phone number"
                  {...registerProfile("emergencyContactPhone")}
                  error={profileErrors.emergencyContactPhone?.message}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === "employee" && (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Employee Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {profileData?.name || user?.name || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {user?.role || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Department
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {profileData?.department || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Designation
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {profileData?.designation || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-950">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Manage employee details and assignments from the employee
                records page.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/employees")}
              >
                View Employees
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "password" && (
        <Card>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-6 max-w-md"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Keep your account secure with a strong password.
              </p>
            </div>

            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              {...registerPassword("currentPassword")}
              error={passwordErrors.currentPassword?.message}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              {...registerPassword("newPassword")}
              error={passwordErrors.newPassword?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              {...registerPassword("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
            />

            {/* Password Requirements */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Password Requirements:
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li>✓ At least 8 characters long</li>
                <li>✓ At least one uppercase letter (A-Z)</li>
                <li>✓ At least one lowercase letter (a-z)</li>
                <li>✓ At least one number (0-9)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Settings;
