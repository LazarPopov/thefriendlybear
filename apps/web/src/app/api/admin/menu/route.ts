import { NextResponse } from "next/server";
import {
  adminErrorResponse,
  fetchLatestSeasonalMenu,
  getContentAdminContext,
  publishSeasonalMenu,
  requireMenuEditor,
  saveSeasonalMenuDraft
} from "@/lib/admin/content-server";
import { normalizeSeasonalMenuPayload } from "@/lib/content-types";
import { springMenuContent } from "@/lib/spring-menu-content";

export async function GET(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireMenuEditor(context);

    const [draft, published] = await Promise.all([fetchLatestSeasonalMenu("draft"), fetchLatestSeasonalMenu("published")]);
    const menu = normalizeSeasonalMenuPayload(draft?.payload ?? published?.payload ?? springMenuContent, springMenuContent);

    return NextResponse.json({
      context,
      draft,
      published,
      menu
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireMenuEditor(context);

    const body = (await request.json()) as { action?: string; menu?: unknown };
    const payload = normalizeSeasonalMenuPayload(body.menu, springMenuContent);

    if (body.action === "publish") {
      const published = await publishSeasonalMenu(context, payload);
      return NextResponse.json({ context, published, menu: payload });
    }

    const draft = await saveSeasonalMenuDraft(context, payload);
    return NextResponse.json({ context, draft, menu: payload });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
