import { NextResponse } from "next/server";
import { adminErrorResponse, getContentAdminContext } from "@/lib/admin/content-server";

export async function GET(request: Request) {
  try {
    const context = await getContentAdminContext(request);

    return NextResponse.json({ context });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
