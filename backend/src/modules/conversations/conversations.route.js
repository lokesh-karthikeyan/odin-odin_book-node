import ConversationsRepository from "./conversations.repository.js";
import ConversationsService from "./conversations.service.js";
import ConversationsController from "./conversations.controller.js";

export default async function (fastify) {
  const repo = ConversationsRepository(fastify.db);
  const service = ConversationsService(repo, fastify);
  const controller = ConversationsController(service);

  fastify.get("/", { preHandler: [fastify.authenticate] }, controller.getMyConversations);
  fastify.get('/suggested-users', { preHandler: [fastify.authenticate] }, controller.getSuggestedUsersHandler);
  fastify.post("/:userId", { preHandler: [fastify.authenticate] }, controller.createOrGetDM);
  fastify.get("/:id", { preHandler: [fastify.authenticate] }, controller.getConversationWithMessages);
  fastify.post("/:id/messages", {
    preHandler: [fastify.authenticate],
  }, controller.sendMessage);
}
