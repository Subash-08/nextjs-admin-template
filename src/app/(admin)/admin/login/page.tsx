"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/auth.schema"; // Reusing existing schema
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError(null);
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (result?.error) {
            setError("Invalid admin credentials");
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md border text-card-foreground">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
