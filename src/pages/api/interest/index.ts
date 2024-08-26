import type { APIRoute } from "astro";
import { app } from "../../../firebase/server.ts";
import { getFirestore } from "firebase-admin/firestore";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const course = formData.get("course")?.toString();
    const yearLevel = formData.get("yearLevel")?.toString();
    const source = formData.get("source")?.toString();
    const involvementType = formData.get("involvementType")?.toString();
    const skills = formData.get("skills")?.toString();
    const interests = formData.get("interests")?.toString();
    const expectations = formData.get("expectations")?.toString();
    const suggestions = formData.get("suggestions")?.toString();
    const additionalInfo = formData.get("additionalInfo")?.toString();

    const isIncomplete = !course || !yearLevel || !source || !involvementType || !skills || !interests || !expectations || !suggestions;

    if (isIncomplete) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }
    try {
        const db = getFirestore(app);
        const interestRef = db.collection("interest-check");
        await interestRef.add({
            name,
            email,
            course,
            yearLevel,
            source,
            involvementType,
            skills,
            interests,
            expectations,
            suggestions,
            additionalInfo
        });
    } catch (error) {
        return new Response("Something went wrong" + error, {
            status: 500,
        });
    }
    return redirect("/");
};