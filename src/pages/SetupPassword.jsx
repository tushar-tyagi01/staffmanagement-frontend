import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers"),
});

const passwordSchema = yup.object().shape({
  otp: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const SetupPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState("verify-otp"); // verify-otp or create-password
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(step === "verify-otp" ? otpSchema : passwordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    // Get email and employee ID from URL params
    const paramEmail = searchParams.get("email");
    const paramEmployeeId = searchParams.get("employeeId");

    if (!paramEmail) {
      toast.error("Invalid setup link. Please contact your administrator.");
      navigate("/login");
      return;
    }

    setEmail(paramEmail);
    setEmployeeId(paramEmployeeId || "");
  }, [searchParams, navigate]);

  useEffect(() => {
    // Handle resend countdown
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerifyOtp = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.verifyOtp({
        email,
        otp: data.otp,
      });

      toast.success("OTP verified successfully!");
      setOtpVerified(true);
      reset(); // Reset form for password step
      setStep("create-password");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to verify OTP";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePassword = async (data) => {
    setIsLoading(true);
    try {
      await authAPI.createPassword({
        email,
        password: data.password,
      });

      toast.success("Password created successfully! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create password";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await authAPI.sendOtp({ email });
      toast.success("OTP resent to your email");
      setResendCountdown(60);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Complete Your Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome! Let's secure your account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl border border-gray-200 dark:border-gray-700 sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === "verify-otp" || otpVerified
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {otpVerified ? <CheckCircle className="w-6 h-6" /> : "1"}
                </div>
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center font-medium">
                  Verify OTP
                </p>
              </div>

              <div
                className={`flex-1 h-1 mx-2 transition-all ${
                  otpVerified ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === "create-password"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  2
                </div>
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center font-medium">
                  Create Password
                </p>
              </div>
            </div>
          </div>

          {/* Email Display */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center text-blue-900 dark:text-blue-200">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{email}</span>
            </div>
          </div>

          {/* OTP Verification Step */}
          {step === "verify-otp" && (
            <form
              onSubmit={handleSubmit(handleVerifyOtp)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OTP Code
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Enter the 6-digit code sent to your email
                </p>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  {...register("otp")}
                  className={`w-full px-4 py-2 text-center text-2xl tracking-widest font-mono border-2 rounded-lg transition-all focus:outline-none ${
                    errors.otp
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Verify OTP
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || isLoading}
                  className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : "Resend Code"}
                </button>
              </div>
            </form>
          )}

          {/* Password Creation Step */}
          {step === "create-password" && (
            <form
              onSubmit={handleSubmit(handleCreatePassword)}
              className="space-y-6"
            >
              <Input
                label="New Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                placeholder="••••••••"
                helperText="At least 8 characters, including uppercase, lowercase, number and special character"
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[
                      password.length >= 8,
                      /[A-Z]/.test(password),
                      /[a-z]/.test(password),
                      /\d/.test(password),
                      /[@$!%*?&]/.test(password),
                    ].map((check, idx) => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          check
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password strength checker
                  </p>
                </div>
              )}

              <Input
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                placeholder="••••••••"
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                Create Password
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your password is secure and encrypted
              </p>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Having trouble?{" "}
            <a
              href="mailto:support@example.com"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupPassword;
