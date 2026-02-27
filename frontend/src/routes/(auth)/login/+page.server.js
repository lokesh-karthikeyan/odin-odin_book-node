import { fail, redirect } from "@sveltejs/kit";
import { superValidate, setError, message } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { loginSchema } from "$lib/schemas";
import { login } from "$lib/api";
import { setTokenCookie } from "$lib/utils";

export const load = async () => {
  const form = await superValidate(zod4(loginSchema));
  return { form };
}

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(loginSchema));
    if (!form.valid) return fail(400, { form });

    const result = await login(form.data);

    if (!result.success) {
      if (result.errors) {
        for (const [field, errorMessage] of Object.entries(result.errors)) {
          setError(form, field, errorMessage);
        }
        return fail(400, { form });
      }
      return message(form, result.message || 'Login failed', { status: 400 });
    }

    setTokenCookie(cookies, result.data.token);

    throw redirect(303, '/');
  }
}
