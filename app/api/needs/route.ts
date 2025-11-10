
import databaseConnection from "../../database/dbinit";
import type { Need } from "@/app/types";


export async function PUT(request: Request) {
    try {
        const needID : number = Number(new URL(request.url).searchParams.get("needID"));
        const db = await databaseConnection();

        await db.execute(
            "UPDATE needs SET closed = true WHERE id = ?",
            [needID]
        );

        return new Response(null, { status: 200 });
    } catch (error) {
        console.error("Error closing need:", error);
        return new Response("Failed to close need", { status: 500 });
    }
}
    
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get("userID");

        const db = await databaseConnection();

        const [basketqres] = await db.execute(
            "SELECT basketID FROM baskets WHERE userID = ?",
            [userID]
        );

        const basketID = Array.isArray(basketqres) && basketqres.length > 0
            ? (basketqres[0] as { basketID: number }).basketID
            : null;

        if (!basketID) {
            const message = { error: "Basket not found" };
            return new Response(JSON.stringify(message), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const [needqres] = await db.execute(
            "SELECT needID FROM basket_needs WHERE basketID = ?",
            [basketID]
        );

        const basketNeedIDs = Array.isArray(needqres) ? needqres.map((row) => (row as { needID: number }).needID) : [];

        const [rows] = await db.execute("SELECT * FROM needs");
        const needs: Need[] = (Array.isArray(rows) ? (rows as Need[]) : [])
        .filter((need) => Number(need.amountNeeded) > Number(need.amountDonated));

        const priorityInt = (p: Need['priority']) => {
            switch (p) {
                case 'high': return 3;
                case 'medium': return 2;
                default: return 1; // last case is lowwww
            }
        };

        const computePriorityScore = (n: Need) => {
            const needWeight = priorityInt(n.priority); //priority based on listed priority
            const remainingtbd = Math.max(0, n.amountNeeded - (n.amountDonated ?? 0)); // remaining amount to be donated
            const urgency = n.amountNeeded > 0 ? remainingtbd / n.amountNeeded : 0; // percentage remaining to be donated
            const timeSensitivity = n.timeSensitive ? 1.0 : 0.0; //whether or not the need has been listed as time sensitive
            return (needWeight * 2) + (urgency * 3) + timeSensitivity; //priority formula
        };
        // for the team at rit reading this, hi!

        needs.sort((a, b) => {
            const needOne = computePriorityScore(a);
            const needTwo = computePriorityScore(b);
            if (needTwo === needOne) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return needTwo - needOne;
        });

        return new Response(JSON.stringify({ needs, basketNeedIDs }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching needs:", error);
        return new Response("Failed to fetch needs", { status: 500 });
    }
}