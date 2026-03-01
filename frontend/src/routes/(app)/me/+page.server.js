import { profileApi } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, parent }) {
  const { user, token } = await parent();
  if (!user) throw redirect(303, '/login');

  const res = await profileApi.getProfile(fetch, token, user.id);
  return { profile: res.data.profile, token };
}
