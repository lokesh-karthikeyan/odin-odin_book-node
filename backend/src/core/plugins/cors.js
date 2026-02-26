import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";

async function corsPlugin(fastify) {
  await fastify.register(fastifyCors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });
}

export default fp(corsPlugin);
