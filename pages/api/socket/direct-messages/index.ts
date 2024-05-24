import { currentProfilePages } from "@/lib/current-profile-pages";
import db from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";

import { NextApiRequest } from "next";

export default async function handeler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "unauthorised" });
    }

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId  missing" });
    }

    if (!content) {
      return res.status(400).json({ message: "content missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "conversation not found " });
    }

    const member =
      conversation.memberOne.profileId == profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    // console.log(member);

    if (!member) {
      return res.status(404).json({ message: "member not found " });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
