import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  console.log(searchParams);

  const filename = searchParams.get("filename");

  const blob = await put(filename || "", request.body as any, {
    access: "public",
  });

  return NextResponse.json(blob);
}
