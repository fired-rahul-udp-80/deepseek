import {Webhook} from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req){
    try {
        const signingSecret = process.env.SIGNING_SECRET;

        if (!signingSecret) {
            return NextResponse.json(
                { message: "SIGNING_SECRET is not configured" },
                { status: 500 }
            );
        }

        const wh = new Webhook(signingSecret);
        const svixHeader = {
            "svix-id": req.headers.get("svix-id"),
            "svix-timestamp": req.headers.get("svix-timestamp"),
            "svix-signature": req.headers.get("svix-signature"),
        };

        const payload = await req.text();
        const { data, type } = wh.verify(payload, svixHeader);

        await connectDB();

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || data.email_address || "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" ") || data.username || "",
            image: data.profile_image_url,
        };

        switch (type) {
            case "user.created":
            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                });
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;
            default:
                break;
        }

        return NextResponse.json({message : "Event received successfully"}, {status : 200});
    } catch (error) {
        console.error("Clerk webhook error:", error);
        return NextResponse.json(
            { message: "Webhook processing failed" },
            { status: 400 }
        );
    }

}