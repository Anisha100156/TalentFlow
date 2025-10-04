import { useState } from "react";
import { ArrowDown } from "lucide-react";
import LoginSignup from "./loginForm"; // candidate login form
import LoginRecruiter from "./loginRecruiter"; // recruiter login form
import { motion, AnimatePresence } from "framer-motion";

export const HeroSection = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userType, setUserType] = useState(null); // "candidate" | "recruiter"

  const handleCandidateClick = () => {
    setUserType("candidate");
    setShowLogin(true);
  };

  const handleRecruiterClick = () => {
    setUserType("recruiter");
    setShowLogin(true);
  };

  const handleClose = () => {
    setShowLogin(false);
    setUserType(null);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="container max-w-4xl mx-auto text-center z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="opacity-0 animate-fade-in"> Welcome to</span>
            <span className="text-primary opacity-0 animate-fade-in-delay-1">
              {" "}
              Talent
            </span>
            <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">
              {" "}
              Flow
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-2-2xl mx-auto opacity-0 animate-fade-in-delay-3">
            Bridging the gap between talented candidates and forward-thinking companies, creating opportunities for growth, success, and the perfect career fit.
          </p>

          <p className="text-lg md:text-xl text-muted-foreground max-2-2xl mx-auto opacity-0 animate-fade-in-delay-3">
            Login As
          </p>

          <div className="pt-4 opacity-0 animate-fade-in-delay-4 flex justify-center space-x-4">
            <button onClick={handleCandidateClick} className="cosmic-button">
              Candidate
            </button>
            <button onClick={handleRecruiterClick} className="cosmic-button">
              Recruiter
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-muted-foreground mb-2"> Scroll </span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>

      {/* Login Form Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-800 rounded-3xl shadow-xl w-full max-w-3xl p-6 relative"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 text-2xl font-bold"
              >
                &times;
              </button>
              
              {/* Render based on userType */}
              {userType === "candidate" && <LoginSignup />}
              {userType === "recruiter" && <LoginRecruiter />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
