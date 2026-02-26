import { signup, login } from "./auth.service.js";

async function signupHandler(request, reply) {
  const user = await signup(request.server, request.body);

  const token = request.server.jwt.sign({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  });

  const data = { token };

  return reply.success("User created successfully", data, 201);
}

async function loginHandler(request, reply) {
  const user = await login(request.server, request.body);

  const token = request.server.jwt.sign({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  });

  const data = { token }

  return reply.success("Logged in successfully", data);
}

async function logoutHandler(request, reply) {
  return reply.success("Logged out successfully");
}

export {
  signupHandler,
  loginHandler,
  logoutHandler,
};
