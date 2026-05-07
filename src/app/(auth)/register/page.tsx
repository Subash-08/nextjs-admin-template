"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validations/auth.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setError(null);
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            router.push("/login?registered=true");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md border text-card-foreground">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            {...register("name")}
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.name && (
                            <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.email && (
                            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.password && (
                            <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.confirmPassword && (
                            <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
