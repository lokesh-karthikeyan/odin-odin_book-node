import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export default function ConversationsController(service) {
  return {
    async getMyConversations(req, reply) {
      const userId = req.user.id;
      const data = await service.getMyConversations(userId);
      return reply.send(data);
    },

    async createOrGetDM(req, reply) {
      const currentUserId = req.user.id;
      const { userId } = req.params;

      const convo = await service.createOrGetDM(
        currentUserId,
        userId
      );

      return reply.send(convo);
    },

    async getConversationWithMessages(req, reply) {
      const { id } = req.params;

      const data =
        await service.getConversationWithMessages(id);

      return reply.send(data);
    },

    async sendMessage(req, reply) {
      const userId = req.user.id;
      const conversationId = req.params.id;

      if (!conversationId) {
        return reply.code(400).send({
          success: false,
          message: "Conversation ID is required.",
        });
      }

      let content = null;
      let imageUrl = null;

      if (req.isMultipart && req.isMultipart()) {
        const parts = req.parts();

        for await (const part of parts) {
          if (part.type === "field" && part.fieldname === "content") {
            content = part.value;
          }

          if (part.type === "file") {
            const ext = path.extname(part.filename);
            const fileName = `${randomUUID()}${ext}`;
            const uploadDir = path.join(process.cwd(), "uploads");
            const filePath = path.join(uploadDir, fileName);

            await fs.mkdir(uploadDir, { recursive: true });
            await fs.writeFile(filePath, await part.toBuffer());

            imageUrl = `/uploads/${fileName}`;
          }
        }
      } else {
        content = req.body?.content ?? null;
      }

      if (!content && !imageUrl) {
        return reply.code(400).send({
          success: false,
          message: "Message must contain content or image",
        });
      }

      const message = await service.sendMessage({
        conversationId,
        senderId: userId,
        content,
        imageUrl,
      });

      return reply.send(message);
    },

    async getSuggestedUsersHandler(req, reply) {
      const userId = req.user.id;
      const users = await service.getSuggestedUsers(userId);
      return reply.send(users);
    },
  };
}
