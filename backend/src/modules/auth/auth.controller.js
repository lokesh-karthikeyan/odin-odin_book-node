import { signup, login } from "./auth.service.js";

async function signupHandler(request, reply) {
  try {
    const user = await signup(request.server, request.body);

    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    })

    reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
    return { message: 'User created successfully' };
  } catch (err) {
    reply.code(400).send({ message: err.message });
  }
}

async function loginHandler(request, reply) {
  try {
    const user = await login(request.server, request.body);

    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    })

    reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'strict' });
    return { message: 'Logged in successfully' };
  } catch (err) {
    reply.code(401).send({ message: err.message });
  }
}

async function logoutHandler(request, reply) {
  reply.clearCookie('token', { path: '/' });
  return { message: 'Logged out successfully' };
}

export {
  signupHandler,
  loginHandler,
  logoutHandler,
}
