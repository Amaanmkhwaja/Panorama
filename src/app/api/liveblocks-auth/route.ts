import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST(request: Request) {
  // Get the current user from db
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  const { room } = await request.json();

  // TODO: Check if user has permission
  // const funnelPageDetails = await db.funnelPage.findUnique({
  //   where: { id: room }
  // });
  // const permission = await db.permissions.findFirst({
  //   where: {
  //     subAccountId: funnelPageDetails.
  //   }
  // })

  const userInfo = {
    name: user.name || "Teammaate",
    picture:
      user.image ||
      "https://utfs.io/f/973e016a-44fe-4142-b9d1-de18c64a456f-77ybic.jpg",
  };

  const session = liveblocks.prepareSession(
    user?.id!,
    { userInfo } // Optional
  );

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
