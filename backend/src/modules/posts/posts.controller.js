import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export const postsController = (service) => ({
  create: async (request, reply) => {
    const userId = request.user.id;

    let content = null;
    let imageUrl = null;

    if (request.isMultipart()) {
      const parts = request.parts();

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
      content = request.body?.content ?? null;
    }

    if (!content && !imageUrl) {
      return reply.code(400).send({
        success: false,
        message: "Post must contain content or image",
      });
    }

    const post = await service.createPost(userId, {
      content,
      imageUrl,
    });

    return reply.success("Post created successfully", post, 201);
  },

  feed: async (request, reply) => {
    const userId = request.query.userId || request.user.id;
    const posts = await service.getFeed(userId);
    const data = { posts };
    return reply.success(data);
  },

  like: async (request, reply) => {
    const userId = request.user.id;
    const postId = request.params.id;

    await service.likePost(userId, postId);

    return reply.success("Post liked");
  },

  unlike: async (request, reply) => {
    const userId = request.user.id;
    const postId = request.params.id;

    await service.unlikePost(userId, postId);

    return reply.success("Post unliked");
  },

  comment: async (request, reply) => {
    const userId = request.user.id;
    const postId = request.params.id;
    const { content } = request.body;

    if (!content) {
      return reply.code(400).send({
        success: false,
        message: "Comment content is required",
      });
    }

    const comment = await service.commentPost(userId, postId, content);

    return reply.success("Comment added", comment, 201);
  },

  getPost: async (req, reply) => {
    const post = await service.getFeed(req.user.id);
    const single = post.find(p => p.id === req.params.id);
    return reply.send(single ?? {});
  }
});
