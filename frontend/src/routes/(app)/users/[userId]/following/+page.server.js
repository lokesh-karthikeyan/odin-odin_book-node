import { peopleApi } from "$lib/api";

export async function load({ params, locals, fetch }) {
  const result = await peopleApi.getConnections(
    fetch,
    locals.token,
    params.userId,
    'following'
  );

  return {
    users: result.data.following ?? [],
    token: locals.token
  };
}
