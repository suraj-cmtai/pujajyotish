import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../store/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle2, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const adminEmail = "maharshijvigyan@gmail.com";
      const adminPassword = "pujajyotish";
      if (email === adminEmail && password === adminPassword) {
        dispatch(login({ email }));
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy/5 via-blue-50/30 to-orange-50/20 px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-8 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange to-orange/80 rounded-full flex items-center justify-center mb-4">
            <UserCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-navy">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-1">Sign in to your account</p>
        </div>
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}
        <form className="w-full space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-navy">Email</label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="pl-10 border-gray-300 focus:border-orange focus:ring-orange/20"
                required
                autoFocus
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-navy">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="pl-10 pr-10 border-gray-300 focus:border-orange focus:ring-orange/20"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="cursor-pointer w-full gap-2 bg-black text-white font-medium py-2.5 rounded-lg transition-all duration-150 shadow-md active:bg-gray-900"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 