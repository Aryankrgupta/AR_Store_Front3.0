import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOption } from "./auth/[...nextauth]";

export default async function handle(req,res) {
    await mongooseConnect();
    const {user} = await getServerSession(req,res,authOption);
    res.json(
        await Order.find({userEmail:user.email})
    )
}