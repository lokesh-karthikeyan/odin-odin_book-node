import { postsApi, profileApi } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch, parent }) {
  const { token } = await parent();
  const { userId } = params;

  const [profileRes, postsRes] = await Promise.all([
    profileApi.getProfile(fetch, token, userId),
    postsApi.getFeed(fetch, token, userId),
  ])

  if (!profileRes.success) throw error(404, "User not found");

  return {
    profile: profileRes.data.profile,
    posts: postsRes.data.posts || [],
  };
}
