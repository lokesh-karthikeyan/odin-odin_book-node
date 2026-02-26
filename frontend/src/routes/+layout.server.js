import { redirect } from "@sveltejs/kit";

async function load ({ locals, url }) {
  const user = locals.user;
  const path = url.pathname;

  const publicRoutes = ["/login", "/register"];
  const isPublic     = publicRoutes.includes(path);

  if (user && isPublic) throw redirect(303, '/');
  if (!user && !isPublic) throw redirect(303, '/login');

  return { user };
}

export { load };
