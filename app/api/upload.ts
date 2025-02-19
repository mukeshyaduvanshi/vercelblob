import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = (await request.json()) as HandleUploadBody;
    console.log("Received body:", body);

    if (!body || !(body as any).pathname) {
      return NextResponse.json(
        { error: "Invalid request: Missing pathname" },
        { status: 400 }
      );
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname) {
          throw new Error("Invalid pathname for upload.");
        }
        console.log("Generating upload token for:", pathname);

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            message: "Upload authorized",
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Blob upload completed:", blob, tokenPayload);

        try {
          // You can save the blob URL to a database here
          // Example: await db.collection("uploads").insertOne({ url: blob.url });

          console.log("File successfully saved:", blob.url);
        } catch (error) {
          console.error("Database update failed:", error);
          throw new Error("Could not save file to database.");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
