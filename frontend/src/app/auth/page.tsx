"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import Image from "next/image";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["patient", "doctor"]),
  dateOfBirth: z.string().min(1, "Please enter your date of birth"),
  gender: z.string().min(1, "Please select your gender"),
  phone: z.string().min(5, "Please enter your phone number"),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setShowGenderDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", isRegistering ? registerForm.formState.errors : loginForm.formState.errors);
    setIsLoading(true);
    try {
      if (isRegistering) {
        const registerData = data as RegisterFormData;
        console.log("Registration data:", registerData);
        const response = await authApi.register({
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          dateOfBirth: registerData.dateOfBirth,
          gender: registerData.gender,
          phone: registerData.phone,
          bio: registerData.bio || "",
        });
        console.log("Registration response:", response);
        toast.success("Registration successful! You can now sign in");
        setIsRegistering(false);
        registerForm.reset();
      } else {
        const response = await authApi.login(data as LoginFormData);
        const { access_token, user } = response;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!");

        // Redirect based on user role
        if (user.role === "doctor") {
          router.push("/doctor/profile");
        } else if (user.role === "patient") {
          router.push("/patient/profile");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Error during auth:", error);
      const message = error.response?.data?.message ||
        error.message ||
        (isRegistering ? "Registration failed. Please check your information" : "Invalid credentials");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-siraj-emerald-900/60 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transform scale-110"
          style={{ backgroundImage: "url('/auth.jpg')" }}
        ></div>
        <div className="relative z-20 flex items-center justify-center w-full p-6">
          <div className="text-center text-white max-w-sm">
            <div className="">
              {/* <div className="w-12 h-12 bg-white/5  rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div> */}
              <h1 className="text-2xl font-bold mb-3 text-white">
                Welcome to <span className="text-siraj-emerald-900 font-bold bg-white/50 backdrop-blur-sm rounded-md px-2 py-1">SIRAJ</span>
              </h1>
              <p className="text-sm text-white/90 leading-relaxed">
                Your journey to mental wellness starts here. Connect with professional therapists and take the first step towards a healthier mind.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-3 md:p-6 bg-green-50/30">
        <div className="w-full max-w-xs">
          {/* Logo/Brand */}
          <div className="text-center mb-4">
            <div className="w-15 h-15 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Image src="siraj_logo.svg" alt="Logo" width={100} height={100} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-xs">
              {isRegistering ? "Join our community and start your wellness journey" : "Sign in to your account"}
            </p>
          </div>

          {/* Login Form */}
          {!isRegistering && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100">
              <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...loginForm.register("email")}
                      className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full h-8 bg-siraj-emerald-900/70 hover:bg-siraj-emerald-900/80 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 shadow-sm text-xs"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : "Sign In"}
                </Button>
              </form>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="cursor-pointer text-emerald-600 font-semibold hover:text-emerald-700 transition-colors underline decoration-1 underline-offset-1"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Register Form */}
          {isRegistering && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 border border-green-100">
              <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      placeholder="First Name"
                      {...registerForm.register("firstName")}
                      className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      placeholder="Last Name"
                      {...registerForm.register("lastName")}
                      className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...registerForm.register("email")}
                    className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>



                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...registerForm.register("password")}
                        className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm pr-6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* {registerForm.formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                    )} */}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...registerForm.register("confirmPassword")}
                        className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm pr-6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* {registerForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                    )} */}
                  </div>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                )}
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter your number"
                      {...registerForm.register("phone")}
                      className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="relative" ref={roleDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="cursor-pointer w-full h-8 border border-gray-200 rounded-md px-3 focus:border-teal-500 focus:ring-teal-500 bg-white/70 backdrop-blur-sm text-xs transition-all duration-300 text-left flex items-center justify-between"
                      >
                        <span className={registerForm.watch("role") ? "text-gray-900" : "text-gray-500"}>
                          {registerForm.watch("role") || "Select type"}
                        </span>
                        <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showRoleDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={() => {
                                registerForm.setValue("role", "patient");
                                setShowRoleDropdown(false);
                              }}
                              className="cursor-pointer w-full px-3 py-2 text-xs text-left hover:bg-teal-50 transition-colors"
                            >
                              Patient
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                registerForm.setValue("role", "doctor");
                                setShowRoleDropdown(false);
                              }}
                              className="cursor-pointer w-full px-3 py-2 text-xs text-left hover:bg-teal-50 transition-colors"
                            >
                              Doctor
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {registerForm.formState.errors.role && (
                      <p className="text-red-500 text-xs mt-1">Please select a type</p>
                    )}
                  </div>

                </div>


                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      {...registerForm.register("dateOfBirth")}
                      className="h-8 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-md text-xs transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    />
                    {registerForm.formState.errors.dateOfBirth && (
                      <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.dateOfBirth.message}</p>
                    )}
                  </div>



                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Gender
                    </label>
                    <div className="relative" ref={genderDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        className="cursor-pointer w-full h-8 border border-gray-200 rounded-md px-3 focus:border-teal-500 focus:ring-teal-500 bg-white/70 backdrop-blur-sm text-xs transition-all duration-300 text-left flex items-center justify-between"
                      >
                        <span className={registerForm.watch("gender") ? "text-gray-900" : "text-gray-500"}>
                          {registerForm.watch("gender") || "Select gender"}
                        </span>
                        <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showGenderDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showGenderDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={() => {
                                registerForm.setValue("gender", "male");
                                setShowGenderDropdown(false);
                              }}
                              className="cursor-pointer w-full px-3 py-2 text-xs text-left hover:bg-teal-50 transition-colors"
                            >
                              Male
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                registerForm.setValue("gender", "female");
                                setShowGenderDropdown(false);
                              }}
                              className="cursor-pointer w-full px-3 py-2 text-xs text-left hover:bg-teal-50 transition-colors"
                            >
                              Female
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {registerForm.formState.errors.gender && (
                      <p className="text-red-500 text-xs mt-1">Please select your gender</p>
                    )}
                  </div>
                </div>


                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself (optional)"
                    {...registerForm.register("bio")}
                    className="w-full h-16 border border-gray-200 rounded-md px-3 py-2 focus:border-teal-500 focus:ring-teal-500 resize-none text-xs bg-white/70 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer w-full h-8 bg-siraj-emerald-900/70 hover:bg-siraj-emerald-900/80 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 shadow-sm text-xs"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : "Create Account"}
                </Button>
              </form>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="cursor-pointer text-emerald-600 font-semibold hover:text-emerald-700 transition-colors underline decoration-1 underline-offset-1"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 