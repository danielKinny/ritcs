import databaseConnection from "../../database/dbinit";
import { Need } from "../../types";

export async function GET() {
    const db = await databaseConnection();

    const [rows] = (await db.execute(
        "SELECT * FROM needs"
    ))

    const needs = Array.from(rows as Array<Need>);
    const totalNeeded = needs.reduce((acc, need) => acc + Number(need.amountNeeded), 0);
    const totalDonated = needs.reduce((acc, need) => acc + Number(need.amountDonated), 0);

    //'Food' | 'Clothing' | 'Shelter' | 'Medical' | 'Education' | 'Other'

    return new Response(
        JSON.stringify({
            totalNeeds: needs.length,
            totalNeeded,
            totalDonated,
            needsByCategory: {
                Food: needs.filter(need => need.category === 'Food').length,
                Clothing: needs.filter(need => need.category === 'Clothing').length,
                Shelter: needs.filter(need => need.category === 'Shelter').length,
                Medical: needs.filter(need => need.category === 'Medical').length,
                Education: needs.filter(need => need.category === 'Education').length,
                Other: needs.filter(need => need.category === 'Other').length,
            }
        }),
        { status: 200 }
    );

    
}