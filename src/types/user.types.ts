export interface UserType {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: "user" | "admin";
    provider: "credentials" | "google" | "github";
    createdAt: string;
    updatedAt: string;
}
