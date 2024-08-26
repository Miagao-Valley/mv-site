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
    const projects = formData.get("projects")?.toString();
    const goals = formData.get("goals")?.toString();
    const isLeader = formData.get("isLeader")?.toString();
    const proposal = formData.get("proposals")?.toString();
    const additionalInfo = formData.get("additionalInfo")?.toString();
    const isWilling = formData.get("isWilling")?.toString();

    const isIncomplete = name && email && course && yearLevel && goals && isLeader && isWilling;

    if (isIncomplete) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }
    try {
        const db = getFirestore(app);
        const testRef = db.collection("membership");
        await testRef.add({
            name,
            email,
            course,
            yearLevel,
            projects,
            goals,
            isLeader,
            proposal,
            additionalInfo
        });
    } catch (error) {
        return new Response("Something went wrong" + error, {
            status: 500,
        });
    }
    return redirect("/");
};