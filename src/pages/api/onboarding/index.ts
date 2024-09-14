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
    const isHelpful = formData.get("isHelpful")?.toString();
    const likedEvent = formData.get("likedEvent")?.toString();
    const mvImage = formData.get("mvImage")?.toString();
    const goalAlignment = formData.get("goalAlignment")?.toString();
    const willJoin = formData.get("willJoin")?.toString();
    const joinFactors = formData.get("joinFactors")?.toString();
    const toImprove = formData.get("toImprove")?.toString();
    const additional = formData.get("additional")?.toString();

    const isIncomplete = !(course && yearLevel && isHelpful && likedEvent && mvImage && goalAlignment && willJoin && joinFactors && toImprove);

    if (isIncomplete) {
        return new Response("Missing required fields", {
            status: 400,
        });
    }
    try {
        const db = getFirestore(app);
        const membershipRef = db.collection("forms").doc("feedbacks").collection("onboarding");
        await membershipRef.add({
            name,
            email,
            course,
            yearLevel,
            isHelpful,
            likedEvent,
            mvImage,
            goalAlignment,
            willJoin,
            joinFactors,
            toImprove,
            additional
        });
    } catch (error) {
        return new Response("Something went wrong" + error, {
            status: 500,
        });
    }
    return redirect("../");
};