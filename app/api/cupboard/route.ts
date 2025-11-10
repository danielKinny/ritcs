import { Need } from "@/app/types";
import databaseConnection from "@/app/database/dbinit";

/**
 * 
 * this api can only be called from the cupboard page,
 * hence only admins will be able to access this route
 * due to existing route prot.
 * thus there arent many user role checks,
 * it isn't necessary
 * 
 */


export async function GET(request: Request) { //function to get all needs for a specific admin
  try {
    const { searchParams } = new URL(request.url);
    const db = await databaseConnection();
    const adminID: number = parseInt(searchParams.get("adminID") || "0"); // get adminid
    if (!adminID) {
      return new Response(
        JSON.stringify({ message: "Missing adminID parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const [rows] = await db.execute("SELECT * FROM needs WHERE adminID = ?", [
      adminID,
    ]); //fetch all needs for this specific admin

    const adminNeeds: Need[] = Array.isArray(rows) ? (rows as Need[]) : []; //typecast as per usual

    return new Response(JSON.stringify(adminNeeds), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(request: Request) { //function add a new need
  try {
    const { need }: { need: Need } = await request.json(); // get need from request body
    if (!need) {
      return new Response(JSON.stringify({ message: "Missing parameters" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const db = await databaseConnection();

    await db.execute(
      "INSERT INTO needs (title, description, category, priority, timeSensitive, contactInfo, amountDonated, amountNeeded, adminID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        need.title,
        need.description,
        need.category,
        need.priority,
        need.timeSensitive,
        need.contactInfo,
        need.amountDonated,
        need.amountNeeded,
        need.adminID,
      ] //large payload
    );

    return new Response(JSON.stringify({ message: "Need created successfully" }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PUT(request: Request) { //function to change the data about existing needs
    try {
        const { need }: { need: Need } = await request.json();
        if (!need || !need.id) {
            return new Response(JSON.stringify({ message: "Missing need or need ID" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const db = await databaseConnection();
        
        await db.execute(
            "UPDATE needs SET title = ?, description = ?, category = ?, priority = ?, timeSensitive = ?, contactInfo = ?, amountDonated = ?, amountNeeded = ? WHERE id = ?",
            [
                need.title,
                need.description,
                need.category,
                need.priority,
                need.timeSensitive,
                need.contactInfo,
                need.amountDonated,
                need.amountNeeded,
                need.id,
            ] //same payload as post req

            //maybe we couldddd further optimise this by only updating fields that have changed
            //however time is not on our side
        );

        return new Response(JSON.stringify({ message: "Need updated successfully" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export async function DELETE(req: Request) { //deletes specific need from the cupboard
  try {
    const { searchParams } = new URL(req.url);
    const needID: number = parseInt(searchParams.get("needID") || "0");
    if (!needID) {
      return new Response(
        JSON.stringify({ message: "Missing needID parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const db = await databaseConnection();
    await db.execute("DELETE FROM needs WHERE id = ?", [needID]); //simple delete query

    return new Response(
      JSON.stringify({ message: "Need deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}