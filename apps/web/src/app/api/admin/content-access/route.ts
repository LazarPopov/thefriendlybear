import { NextResponse } from "next/server";
import {
  adminErrorResponse,
  getContentAdminContext,
  listStaffAccessRows,
  requireContentAccessManager,
  upsertStaffContentPermission
} from "@/lib/admin/content-server";

type AccessPayload = {
  staffProfileId?: string;
  can_edit_menu?: boolean;
  can_edit_reviews?: boolean;
  can_manage_content_permissions?: boolean;
  is_active?: boolean;
};

export async function GET(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireContentAccessManager(context);
    const staff = await listStaffAccessRows(context);

    return NextResponse.json({ context, staff });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireContentAccessManager(context);
    const body = (await request.json()) as AccessPayload;

    if (!body.staffProfileId) {
      return NextResponse.json({ error: "Staff profile id is required." }, { status: 400 });
    }

    const staff = await listStaffAccessRows(context);
    const target = staff.find((item) => item.staffProfileId === body.staffProfileId);

    if (!target) {
      return NextResponse.json({ error: "This staff profile does not belong to the current restaurant." }, { status: 404 });
    }

    await upsertStaffContentPermission(context, body.staffProfileId, {
      can_edit_menu: body.can_edit_menu ?? target.permissions.can_edit_menu,
      can_edit_reviews: body.can_edit_reviews ?? target.permissions.can_edit_reviews,
      can_manage_content_permissions:
        body.can_manage_content_permissions ?? target.permissions.can_manage_content_permissions,
      is_active: body.is_active ?? target.permissions.is_active
    });

    return NextResponse.json({ context, staff: await listStaffAccessRows(context) });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
