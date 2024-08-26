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
    const isCommittee = formData.get("isCommittee")?.toString();
    const proposals = formData.get("proposals")?.toString();
    const additionalInfo = formData.get("additional-info")?.toString();
    const isWilling = formData.get("isWilling")?.toString();

    const isIncomplete = !(name && email && course && yearLevel && goals && isLeader && isCommittee && isWilling);

    if (isIncomplete) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }
    try {
        const db = getFirestore(app);
        const membershipRef = db.collection("membership");
        await membershipRef.add({
            name,
            email,
            course,
            yearLevel,
            projects,
            goals,
            isLeader,
            isCommittee,
            proposals,
            additionalInfo,
            isWilling
        });
    } catch (error) {
        return new Response("Something went wrong" + error, {
            status: 500,
        });
    }
    return redirect("https://discord.gg/RXhsYtQSbe");
};