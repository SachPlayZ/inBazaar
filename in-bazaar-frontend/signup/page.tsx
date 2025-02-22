import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[rgb(var(--background-start-rgb))]">
      <Card className="w-full max-w-md bg-[rgb(var(--background-end-rgb))] shadow-xl rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-center text-teal-700 text-2xl font-bold">
            {isSignup ? "Sign Up" : "Sign In"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            {isSignup && (
              <div className="mb-4">
                <Label htmlFor="name" className="text-teal-800">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email" className="text-teal-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="text-teal-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1"
              />
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-xl">
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <div className="text-center mt-4 text-teal-800">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-semibold hover:underline text-teal-900"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
