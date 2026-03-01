import { profileApi } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, parent }) {
  const { token } = await parent();
  const { userId } = params;

  const res = await profileApi.getProfile(fetch, token, userId);

  if (!res.success) throw error(404, "User not found");

  return { profile: res.data.profile };
}
