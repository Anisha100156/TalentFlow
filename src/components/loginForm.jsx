import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
const LoginSignup = () => {
  const [isActive, setIsActive] = useState(false);

  // login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast(); // ✅ toast hook

  const handleLogin = () => setIsActive(false);

  // ✅ Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", { email, password });
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response:", res);

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();

      if (data.user.role !== "candidate") {
        toast({
          title: "❌ Access Denied",
          description: "Only candidate accounts can log in here.",
          className: "bg-red-600 text-white font-semibold border border-red-700 rounded-lg shadow-lg",
        });
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      // 🎉 Success toast
      toast({
        title: "✅ Logged in Successfully",
        description: `Welcome back, ${data.user.name}!`,
        className:
          "bg-green-600 text-white font-semibold border border-green-700 rounded-lg shadow-lg",
      });

      // redirect to candidate dashboard
      setTimeout(() => {
        window.location.href = "/candidate";
      }, 1500); // small delay so user sees toast
    } catch (err) {
      // ❌ Error toast
      toast({
        title: "❌ Login Failed",
        description: "Invalid email or password. Please try again.",
        className:
          "bg-red-600 text-white font-semibold border border-red-700 rounded-lg shadow-lg",
      });
      console.log("Login failed", err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[30px] shadow-xl w-full max-w-3xl min-h-[480px] transition-all duration-500">
      {/* Login Form */}
      <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-10 z-20">
        <form
          onSubmit={handleLoginSubmit}
          className="flex flex-col w-full items-center justify-center gap-3 bg-[#303030] p-6 rounded-xl text-white"
        >
          <h1 className="text-3xl font-bold mb-3">Candidate Log In</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="mt-2 px-10 py-2 text-white font-semibold rounded-lg"
            style={{ backgroundColor: "hsl(335.1, 77.6%, 42%)" }}
          >
            Log In
          </button>
        </form>
      </div>

      {/* Toggle Panels (Welcome messages) */}
      <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden rounded-l-[150px] transition-all duration-600">
        <div
          className="relative left-[-100%] w-[200%] h-full text-white flex"
          style={{
            background: `linear-gradient(90deg, hsl(335.1, 77.6%, 42%) 0%, hsl(335.1, 77.6%, 42%) 100%)`,
          }}
        >
          {/* Left Panel */}
          <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="mb-4">
              Enter your personal details to use all of site features
            </p>
            <button
              onClick={handleLogin}
              className="px-8 py-2 border border-gray-300 rounded-full text-white font-semibold transition-colors"
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              Log In
            </button>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Candidate!</h1>
            <p className="mb-4">
              Log in to track your applications, complete assessments, and stay
              updated on your job progress. Enter your credentials below to
              access your personalized dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;