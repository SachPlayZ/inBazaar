"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SignupData {
  firstname: string;
  lastname: string;
  url?: string;
  username: string;
  email: string;
  password: string;
  address?: string;
  contact_number?: string;
}

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, role: "BUYER" }),
      });

      if (!response.ok) throw new Error("Signup failed");

      // Handle successful signup
      console.log("Signup successful");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredLabel = ({
    htmlFor,
    children,
  }: {
    htmlFor: string;
    children: React.ReactNode;
  }) => (
    <Label
      htmlFor={htmlFor}
      className="text-teal-800 font-medium text-lg flex items-center gap-1"
    >
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.firstname.trim() !== "" &&
          formData.lastname.trim() !== "" &&
          formData.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) // Basic email validation
        );
      case 2:
        return (
          formData.username.trim() !== "" &&
          formData.password.trim() !== "" &&
          formData.password.length >= 6 // Basic password length validation
        );
      case 3:
        return true; // All fields optional in step 3
      default:
        return false;
    }
  };

  const paginate = (newDirection: number) => {
    if (
      currentStep + newDirection > 0 &&
      currentStep + newDirection <= 3 &&
      (newDirection < 0 || isStepValid(currentStep))
    ) {
      setPage([page + newDirection, newDirection]);
      setCurrentStep(currentStep + newDirection);
    }
  };

  const renderSignupStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="space-y-3">
              <RequiredLabel htmlFor="firstname">First Name</RequiredLabel>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-3">
              <RequiredLabel htmlFor="lastname">Last Name</RequiredLabel>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="space-y-3">
              <RequiredLabel htmlFor="email">Email</RequiredLabel>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Enter your email address"
                required
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="space-y-3">
              <RequiredLabel htmlFor="username">Username</RequiredLabel>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Choose a unique username"
                required
              />
            </div>
            <div className="space-y-3">
              <RequiredLabel htmlFor="password">Password</RequiredLabel>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Create a strong password"
                required
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="space-y-3">
              <Label
                htmlFor="url"
                className="text-teal-800 font-medium text-lg"
              >
                Profile URL
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Your profile URL (optional)"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="address"
                className="text-teal-800 font-medium text-lg"
              >
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Your delivery address (optional)"
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="contact"
                className="text-teal-800 font-medium text-lg"
              >
                Contact Number
              </Label>
              <Input
                id="contact"
                value={formData.contact_number}
                onChange={(e) =>
                  handleInputChange("contact_number", e.target.value)
                }
                className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                placeholder="Your contact number (optional)"
              />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px]"
      >
        <Card className="backdrop-blur-lg bg-white/30 shadow-xl rounded-2xl border border-white/30">
          <CardContent className="p-8 md:p-10">
            <CardTitle className="text-center text-teal-700 text-3xl font-bold mb-10">
              {isSignup
                ? `Create Account (Step ${currentStep}/3)`
                : "Welcome Back"}
            </CardTitle>

            <AnimatePresence mode="wait" custom={direction}>
              {isSignup ? (
                renderSignupStep()
              ) : (
                <motion.div
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <RequiredLabel htmlFor="login">
                      Email or Username
                    </RequiredLabel>
                    <Input
                      id="login"
                      className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                      placeholder="Enter your email or username"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <RequiredLabel htmlFor="password">Password</RequiredLabel>
                    <Input
                      id="password"
                      type="password"
                      className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div className="mt-8 space-y-4">
              {isSignup ? (
                <>
                  <Button
                    onClick={() => {
                      if (currentStep < 3) paginate(1);
                      else if (isStepValid(currentStep)) handleSubmit();
                    }}
                    disabled={isLoading || !isStepValid(currentStep)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : currentStep === 3 ? (
                      "Create Account"
                    ) : (
                      "Next"
                    )}
                  </Button>
                  {currentStep > 1 && (
                    <Button
                      onClick={() => paginate(-1)}
                      variant="outline"
                      disabled={isLoading}
                      className="w-full text-teal-600 font-semibold py-6 px-4 rounded-xl transition-all duration-200 text-lg"
                    >
                      Back
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-center mt-8 text-teal-800 text-lg"
            >
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  if (!isLoading) {
                    setIsSignup(!isSignup);
                    setCurrentStep(1);
                  }
                }}
                disabled={isLoading}
                className="font-semibold hover:underline text-teal-900 transition-colors disabled:opacity-50"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
