import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const LoginRecruiter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const handleRegister = () => setIsActive(true);
  const handleLogin = () => setIsActive(false);

  return (
    <div
      className={`relative overflow-hidden rounded-[30px] shadow-xl w-full max-w-3xl min-h-[480px] transition-all duration-500 ${
        isActive ? "active" : ""
      }`}
    >
      {/* Registration Form */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-10 transition-all duration-600 ${
          isActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"
        }`}
      >
        <form className="flex flex-col w-full items-center justify-center gap-3 bg-[#303030] p-6 rounded-xl text-white">
          <h1 className="text-3xl font-bold mb-3">Create Account</h1>
          <div className="flex gap-2 mb-3">
            <a href="#" className="text-2xl"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="text-2xl"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="text-2xl"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="text-2xl"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span className="text-xs mb-2">or use your email for registration</span>
          <input type="text" placeholder="Name" className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-500" />
          <input type="email" placeholder="Email" className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-500" />
          <input type="password" placeholder="Password" className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-500" />
          <button
            className="mt-2 px-10 py-2 text-white font-semibold rounded-lg"
            style={{ backgroundColor: "hsl(335.1, 77.6%, 42%)" }}
          >
            Log In
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-10 transition-all duration-600 ${
          isActive ? "translate-x-full" : "translate-x-0 z-20"
        }`}
      >
        <form
          onSubmit={async (e) => {
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
              if (data.user.role !== "recruiter") {
                toast({
                  title: " Access Denied",
                  description: "Only recruiter accounts can log in here.",
                  className: "bg-red-600 text-white font-semibold border border-red-700 rounded-lg shadow-lg",
                });
                return;
              }
              localStorage.setItem("user", JSON.stringify(data.user));
              toast({
                title: " Logged in Successfully",
                description: `Welcome back, ${data.user.name}!`,
                className: "bg-green-600 text-white font-semibold border border-green-700 rounded-lg shadow-lg",
              });
              setTimeout(() => {
                window.location.href = "/recruiter";
              }, 1500);
            } catch (err) {
              toast({
                title: " Login Failed",
                description: "Invalid email or password. Please try again.",
                className: "bg-red-600 text-white font-semibold border border-red-700 rounded-lg shadow-lg",
              });
              console.log("Login failed", err);
            }
          }}
          className="flex flex-col w-full items-center justify-center gap-3 bg-[#303030] p-6 rounded-xl text-white"
        >
          <h1 className="text-3xl font-bold mb-3">Log In</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#" className="text-xs mb-2 text-gray-300">Forget Your Password?</a>
          <button
            type="submit"
            className="mt-2 px-10 py-2 text-white font-semibold rounded-lg"
            style={{ backgroundColor: "hsl(335.1, 77.6%, 42%)" }}
          >
            Log In
          </button>
        </form>
      </div>

      {/* Toggle Panels */}
      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden rounded-l-[150px] transition-all duration-600 ${
          isActive ? "-translate-x-full" : ""
        }`}
      >
        <div
          className="relative left-[-100%] w-[200%] h-full text-white flex"
          style={{
            background: `linear-gradient(90deg, hsl(335.1, 77.6%, 42%) 0%, hsl(335.1, 77.6%, 42%) 100%)`,
          }}
        >
          {/* Left Panel */}
          <div
            className={`w-1/2 h-full flex flex-col items-center justify-center p-8 text-center transition-transform duration-600 ${
              isActive ? "translate-x-0" : "-translate-x-[200%]"
            }`}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="mb-4">Enter your personal details to use all of site features</p>
            <button
              onClick={handleLogin}
              className="px-8 py-2 border border-gray-300 rounded-full text-white font-semibold transition-colors"
              style={{ backgroundColor: "transparent", color: "white" }}
              onMouseEnter={e => e.currentTarget.style.color = "hsl(335.1, 77.6%, 42%)"}
              onMouseLeave={e => e.currentTarget.style.color = "white"}
            >
              Log In
            </button>
          </div>

          {/* Right Panel */}
          <div
            className={`w-1/2 h-full flex flex-col items-center justify-center p-8 text-center transition-transform duration-600 ${
              isActive ? "translate-x-[200%]" : "translate-x-0"
            }`}
          >
            <h1 className="text-3xl font-bold mb-2">Welcome Recruiter! </h1>
            <p className="mb-4">Log in to post jobs, review candidates, and connect with top talent. TalentFlow helps you streamline hiring and make smarter decisions with ease.</p>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRecruiter;