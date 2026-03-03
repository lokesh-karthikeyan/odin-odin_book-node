import { postsApi, profileApi, logout } from '$lib/api';
import { removeTokenCookie } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, parent }) {
  const { user, token } = await parent();
  if (!user) throw redirect(303, '/login');

  const [profileRes, postsRes] = await Promise.all([
    profileApi.getProfile(fetch, token, user.id),
    postsApi.getFeed(fetch, token, user.id)
  ]);

  if (!profileRes.success) throw redirect(303, '/login');

  return {
    profile: profileRes.data.profile,
    posts: postsRes.data.posts || [],
    token,
  };
}

export const actions = {
  logout: async ({ cookies }) => {
    const token = cookies.get('token');

    if (token) {
      try {
        const res = await logout(token);
      } catch (err) {
        console.error("Fastify logout failed, clearing local cookie anyway:", err);
      }
    }

    removeTokenCookie(cookies);
    throw redirect(303, '/login');
  }
};
