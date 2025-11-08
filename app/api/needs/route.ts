import databaseConnection from "../../database/dbinit";
import type { Need } from "@/app/types";

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
        const needs: Need[] = Array.isArray(rows) ? (rows as Need[]) : [];
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
