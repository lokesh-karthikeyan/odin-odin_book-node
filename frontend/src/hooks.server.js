import { jwtVerify } from "jose";
import { JWT_SECRET } from "$env/static/private";

async function handle ({ event, resolve }) {
  const token = event.cookies.get('token');

  if (token) {
    try {
      const secret      = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      event.locals.user = {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName
      }
    } catch (err) {
      console.error("JWT Verification failed:", err.message);
      event.cookies.delete('token', { path: '/' });
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}

export { handle };
