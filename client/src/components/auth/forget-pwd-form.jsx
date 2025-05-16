import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:3001/forget-password", { email });

      toast.success("Password reset link sent! Check your email.", {
        duration: 3000,
        position: "bottom-right",
        style: {
          color: "black", // Modifie la couleur du texte ici
        },
      });

      setTimeout(() => {}, 3000);
    } catch (error) {
      toast.error("Invalid email. Please try again.");
      setError("Invalid email");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-6">
            <Logo className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl text-center items-center font-bold">
            Welcome to Flowly.
          </CardTitle>
          <CardDescription>
            <div className="text-center items-center text-sm">
              Enter your email address below, and we'll send you a link to reset
              your password.
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-3 mb-6">{error}</p>
                )}

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
            </div>
          </form>
          <Button variant="outline" className="w-full">
            <Link to="/login">Cancel </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
