"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, XCircle} from "lucide-react";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks/useAuth";
import {getGoogleAuthUrl} from "@/lib/googleAuth";

const getPasswordRules = (password: string) => [
  {label: "At least 6 characters", passed: password.length >= 6},
  {label: "One uppercase letter (A–Z)", passed: /[A-Z]/.test(password)},
  {label: "One lowercase letter (a–z)", passed: /[a-z]/.test(password)},
];

function PasswordRules({password}: {password: string}) {
  const rules = getPasswordRules(password);
  return (
    <motion.div
      initial={{opacity: 0, y: -6}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -6}}
      transition={{duration: 0.2}}
      className="mt-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-1.5"
    >
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-2">
          {rule.passed ? (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          )}
          <span
            className={`text-xs transition-colors ${
              rule.passed ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export default function RegisterPage() {
  const {register} = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({username: "", email: "", password: "", confirmPassword: ""});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const allRulesPassed = getPasswordRules(formData.password).every((r) => r.passed);
  const passwordsMatch = !!formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!allRulesPassed) {
      toast.error("Password does not meet all requirements.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      router.push("/dashboard/user");
    } catch (err: any) {
      toast.error(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 min-h-screen bg-gray-50 dark:bg-[#0f1117] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5, ease: "easeOut"}}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="bg-white/80 dark:bg-[#1a1d24]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col md:flex-row">
          {/* Image Panel */}
          <div className="relative w-full md:w-1/2 h-52 md:h-auto overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
              alt="EventHive"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-800/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <span className="bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent font-bold text-2xl md:text-3xl drop-shadow-sm mb-2">
                EventHive
              </span>
              <p className="text-white/80 text-sm leading-relaxed max-w-[240px] mb-4">
                Book events in seconds, or list your own and manage bookings in one place.
              </p>
              <div className="flex flex-col gap-1.5">
                {["Book events in a couple taps", "Host and manage your own listings", "Track attendees and reviews"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="text-white/70 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="w-full md:w-1/2 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Create your{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  account
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Book events or start hosting your own.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                />
              </div>

              {/* Password + Rules */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 dark:bg-gray-800/60 border rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      formData.password
                        ? allRulesPassed
                          ? "border-emerald-400 dark:border-emerald-600 focus:ring-emerald-500/30"
                          : "border-red-300 dark:border-red-700 focus:ring-red-500/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={showPassword ? "off" : "on"}
                        initial={{opacity: 0, rotate: -45, scale: 0.6}}
                        animate={{opacity: 1, rotate: 0, scale: 1}}
                        exit={{opacity: 0, rotate: 45, scale: 0.6}}
                        transition={{duration: 0.2}}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>

                <AnimatePresence>
                  {(passwordFocused || (formData.password && !allRulesPassed)) && (
                    <PasswordRules password={formData.password} />
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 dark:bg-gray-800/60 border rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      formData.confirmPassword
                        ? passwordsMatch
                          ? "border-emerald-400 dark:border-emerald-600 focus:ring-emerald-500/30"
                          : "border-red-300 dark:border-red-700 focus:ring-red-500/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={showConfirm ? "off" : "on"}
                        initial={{opacity: 0, rotate: -45, scale: 0.6}}
                        animate={{opacity: 1, rotate: 0, scale: 1}}
                        exit={{opacity: 0, rotate: 45, scale: 0.6}}
                        transition={{duration: 0.2}}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>

                <AnimatePresence>
                  {formData.confirmPassword && (
                    <motion.p
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                      className={`text-xs mt-1.5 ml-1 flex items-center gap-1 ${
                        passwordsMatch ? "text-emerald-500" : "text-red-400"
                      }`}
                    >
                      {passwordsMatch ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Passwords match
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Passwords do not match
                        </>
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{scale: 0.95}}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-gray-400 dark:text-gray-500 text-xs">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <motion.button
              type="button"
              onClick={() => {
                try {
                  window.location.href = getGoogleAuthUrl();
                } catch {
                  toast.error("Google sign-in is not configured.");
                }
              }}
              whileTap={{scale: 0.95}}
              className="w-full py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.24 21.3 7.28 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 010-4.54V6.62H1.27a12 12 0 000 10.76l4-3.11z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
              </svg>
              Continue with Google
            </motion.button>

            <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
