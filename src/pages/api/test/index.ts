import type { APIRoute } from "astro";
import { app } from "../../../firebase/server.ts";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();

    if (!name || !email) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }
    try {
        const db = getFirestore(app);
        const testRef = db.collection("test");
        await testRef.add({
            name,
            email,
        });
    } catch (error) {
        return new Response("Something went wrong" + error, {
            status: 500,
        });
    }
    return redirect("/");
};