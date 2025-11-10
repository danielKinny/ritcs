import type { CommunityItem } from "@/app/types";
import databaseConnection from "../../database/dbinit";

export async function GET() {
  try {
    const db = await databaseConnection();
    const [rows] = await db.execute(
      "SELECT community_items.*,admin_community_items.adminID FROM community_items INNER JOIN admin_community_items ON community_items.id = admin_community_items.communityItemID ORDER BY createdAt DESC"
    );

    console.log(rows);
    const communityItems: CommunityItem[] = Array.isArray(rows)
      ? (rows as CommunityItem[])
      : [];

    return new Response(JSON.stringify(communityItems), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching community items:", error);
    return new Response("Failed to fetch community items", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, category, adminID } = await request.json();

    const db = await databaseConnection();

    await db.execute(
      "INSERT INTO community_items (title, description, category, createdAt) VALUES (?, ?, ?, NOW())",
      [title, description, category]
    );

    const [lastID] = await db.execute("SELECT LAST_INSERT_ID() as communityID");

    const communityItemID =
      Array.isArray(lastID) && lastID.length > 0
        ? (lastID[0] as { communityID: number }).communityID
        : null;

    if (communityItemID === null) {
      throw new Error("Failed to retrieve last inserted community item ID");
    }

    await db.execute(
      "INSERT INTO admin_community_items (communityItemID, adminID) VALUES (?, ?)",
      [communityItemID, adminID]
    );

    return new Response(null, { status: 201 });
  } catch (error) {
    console.error("Error creating community item:", error);
    return new Response("Failed to create community item", { status: 500 });
  }
}
