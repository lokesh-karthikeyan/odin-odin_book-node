import { peopleApi } from "$lib/api";

export async function load({ fetch, locals }) {
  try {
    const result = await peopleApi.getSuggestedUsers(fetch, locals.token);
    return { users: result.data.users || [] };
  } catch (error) {
    return { users: [], error: 'Could not load users' };
  }
}
