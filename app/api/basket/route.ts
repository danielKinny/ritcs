import { BasketItem } from "@/app/types";
import databaseConnection from "@/app/database/dbinit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //used to fetch all items in a user's basket
  const { searchParams } = new URL(request.url);
  const userID: number = parseInt(searchParams.get("userID") || "0");
  if (!userID) {
    return new Response(
      JSON.stringify({ message: "Missing userID parameter" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const db = await databaseConnection();

  const [rows] = await db.execute(
    "SELECT basketID FROM baskets WHERE userID = ?",
    [userID]
  ); //retreive basketid first so that we can further query

  const userBasketID = rows as Array<{ basketID: number }>; //typecasting

  if (!userBasketID) {
    return new Response(JSON.stringify({ message: "Basket not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } // fun error handling stuffs

  const [basketNeeds] = await db.execute(
    "SELECT needs.*,basket_needs.donation FROM needs INNER JOIN basket_needs ON needs.id = basket_needs.needID WHERE basket_needs.basketID = ?",
    [userBasketID[0].basketID]
  ); // inner join cos we're goated like that

  // simplifying logic by using smart queries

  return new NextResponse(JSON.stringify(basketNeeds as BasketItem[]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }, //basketItems is an extension of the need type made specifically to also carry donation amount
  });
}

export async function POST(request: Request) {
  //used to add an item to a user's basket
  try {
    const { searchParams } = new URL(request.url);
    const donationAmount: number = (await request.json()).donationAmount;
    const needID: number = parseInt(searchParams.get("needID") || "0");
    const userID: number = parseInt(searchParams.get("userID") || "0");

    // console.log("Donation amount:", donationAmount);

    if (!needID || !userID) {
      return new Response(
        JSON.stringify({ message: "Missing needID or userID parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const db = await databaseConnection();

    await db.execute(
      "INSERT INTO basket_needs (basketID, needID, donation) VALUES ((SELECT basketID FROM baskets WHERE userID = ?), ?, ?)",
      [userID, needID, donationAmount]
    ); // insert into junction table along with number donated

    return new Response(
      JSON.stringify({ message: "Need added to basket successfully" }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } //simple error handling
}

export async function DELETE(request: Request) {
  //used to remove items from a user's basket
  try {
    const { searchParams } = new URL(request.url);
    const needID: number = parseInt(searchParams.get("needID") || "0");
    const userID: number = parseInt(searchParams.get("userID") || "0");
    if (!needID || !userID) {
      return new Response(
        JSON.stringify({ message: "Missing needID or userID parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const db = await databaseConnection();

    const [rows] = await db.execute(
      "SELECT basketID FROM baskets WHERE userID = ?",
      [userID]
    ); //retrieve basketid so that we can delete form junction table

    const basketID = (rows as Array<{ basketID: number }>)[0]?.basketID;

    if (!basketID) {
      return new Response(JSON.stringify({ message: "Basket not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    //hello to the team at rit!

    let query = "DELETE FROM basket_needs WHERE basketID = ?"; //dynamic programming at it's finest
    //using query as a base case and then adding more accordingly

    if (needID === -1) {
      //old logic
      await db.execute(query, [basketID]);
      return new Response(
        JSON.stringify({
          message: "All needs removed from basket successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    query += " AND needID = ?";
    await db.execute(query, [basketID, needID]); // deletes specific need from junction

    return new Response(
      JSON.stringify({ message: "Need removed from basket successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }); //err handling
  }
}
