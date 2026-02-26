import { jwtVerify } from "jose";
import { JWT_SECRET } from "$env/static/private";

async function handle ({ event, resolve }) {
    console.log('--- HOOK TRIGGERED ---');
    console.log('URL:', event.url.pathname);

  const token = event.cookies.get('token');
    console.log('Token Cookie:', token ? 'Found' : 'Missing');

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
