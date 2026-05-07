import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: "user" | "admin" | "editor";
    provider: "credentials" | "google" | "github";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        image: { type: String },
        role: { type: String, enum: ["user", "admin", "editor"], default: "user" },
        provider: { type: String, default: "credentials" },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

UserSchema.methods.comparePassword = async function (password: string) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
