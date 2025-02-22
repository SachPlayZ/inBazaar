"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);

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
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className="text-center text-teal-700 text-3xl font-bold mb-10">
                {isSignup ? "Create Account" : "Welcome Back"}
              </CardTitle>
            </motion.div>

            <form className="space-y-8">
              <AnimatePresence mode="wait">
                {isSignup && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-3">
                      <Label
                        htmlFor="name"
                        className="text-teal-800 font-medium text-lg"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="space-y-3"
              >
                <Label
                  htmlFor="email"
                  className="text-teal-800 font-medium text-lg"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="space-y-3"
              >
                <Label
                  htmlFor="password"
                  className="text-teal-800 font-medium text-lg"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-white/50 border-white/30 focus:border-teal-500 transition-colors h-12 text-lg"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                  {isSignup ? "Sign Up" : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-center mt-8 text-teal-800 text-lg"
            >
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="font-semibold hover:underline text-teal-900 transition-colors"
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
