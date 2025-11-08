import { Need } from "@/app/types";
import databaseConnection from "@/app/database/dbinit";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const db = await databaseConnection();
    const adminID: number = parseInt(searchParams.get("adminID") || "0");
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
    ]);

    const adminNeeds: Need[] = Array.isArray(rows) ? (rows as Need[]) : [];

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

export async function POST(request: Request) {
  try {
    const { need }: { need: Need } = await request.json();
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
      ]
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

export async function PUT(request: Request) {
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
            ]
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

export async function DELETE(req: Request) {
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
    await db.execute("DELETE FROM needs WHERE id = ?", [needID]);

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
