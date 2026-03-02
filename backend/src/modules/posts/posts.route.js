import { postsRepository } from "./posts.repository.js";
import { postsService } from "./posts.service.js";
import { postsController } from "./posts.controller.js";

export default async function (fastify) {
  const repo = postsRepository(fastify.db);
  const service = postsService(repo);
  const controller = postsController(service);

  fastify.get("/:id", {
    preHandler: [fastify.authenticate]
  }, controller.getPost);

  fastify.post("/", {
    preHandler: [fastify.authenticate],
  }, controller.create);

  fastify.get("/", {
    preHandler: [fastify.authenticate],
  }, controller.feed);

  fastify.post("/:id/like", {
    preHandler: [fastify.authenticate],
  }, controller.like);

  fastify.delete("/:id/like", {
    preHandler: [fastify.authenticate],
  }, controller.unlike);

  fastify.post("/:id/comment", {
    preHandler: [fastify.authenticate],
  }, controller.comment);
}
