import User, { IUser } from "@/models/User";
import dbConnect from "@/lib/db";

export async function getUsers() {
    await dbConnect();
    const users = await User.find({}).lean();
    return users;
}

export async function createUser(data: Partial<IUser>) {
    await dbConnect();
    const user = await User.create(data);
    return user;
}
