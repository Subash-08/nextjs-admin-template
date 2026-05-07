"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { register, handleSubmit } = useForm();

    const onUpload = async (data: any) => {
        const file = data.file[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "dashboard-uploads");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();
            setImageUrl(json.result.secure_url);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Welcome back, {session?.user?.name || "User"}!</h2>
                <p className="text-muted-foreground">
                    This is a protected page. Your role is: <span className="font-mono bg-muted px-2 py-1 rounded">{session?.user?.email}</span>
                </p>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">File Upload Example (Cloudinary)</h2>
                <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
                    <input
                        {...register("file")}
                        type="file"
                        className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </form>

                {imageUrl && (
                    <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">Uploaded Image:</h3>
                        <img src={imageUrl} alt="Uploaded" className="max-w-xs rounded-lg border" />
                    </div>
                )}
            </div>
        </div>
    );
}
