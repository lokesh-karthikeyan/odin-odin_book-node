import { peopleApi } from "$lib/api";

export async function load({ params, locals, fetch }) {
  const result = await peopleApi.getConnections(
    fetch,
    locals.token,
    params.userId,
    'followers'
  );

  return {
    users: result.data.followers ?? [],
    token: locals.token,
  };
}
