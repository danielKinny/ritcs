
import databaseConnection from "../../database/dbinit";
import { GET } from "../basket/route";

export const POST = async (request: Request) => {
  try {
    const {
      userID,
    }: { userID: number } =
      await request.json();

    const res = await GET(new Request(`${request.url}?userID=${userID}`));

    if (!res.ok) {
        const message = { error: "Failed to retrieve basket data" };
        return new Response(JSON.stringify(message), {
            status: res.status,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const needData = await res.json()
    //first get the user's basketid so that we can use it to delete recs from junction table
    const db = await databaseConnection();
    const [basketqres] = await db.execute(
      "SELECT basketID FROM baskets WHERE userID = ?",
      [userID]
    );

    //typecasting basketid to number or null (depending on whether there were any resutls)
    const basketID =
      Array.isArray(basketqres) && basketqres.length > 0
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

    let userDonation = 0; // let this rep the total amount donated
    for (const need of needData) {
      // each need being funded: update the need by its primary id (column `id`)
      await db.execute(
        "UPDATE needs SET amountDonated = amountDonated + ? WHERE id = ?",
        [need.donation, need.id]
      );
      userDonation += need.donation;
    }

    //update user's amount donated
    await db.execute(
      "UPDATE users SET amountDonated = amountDonated + ? WHERE id = ?",
      [userDonation, userID]
    );

    // delete all existing needs from basket_needs for this basket
    await db.execute("DELETE FROM basket_needs WHERE basketID = ?", [basketID]);

    return new Response(
      JSON.stringify({ message: "Checkout successful", total: userDonation }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during checkout:", error);
    return new Response("Checkout failed", { status: 500 });
  }
};
