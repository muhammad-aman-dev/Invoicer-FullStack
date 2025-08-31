import dbConnect from "@/lib/databaseconnect";

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ message: "Database connected successfully" });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}