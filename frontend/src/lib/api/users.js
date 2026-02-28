const BASE_URL = 'http://localhost:3000/api/v1';

async function getSuggestedUsers(fetch, token) {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

async function followUser(fetch, token, followeeId) {
  const reqData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ followeeId }),
  }

  const res = await fetch(`${BASE_URL}/follows`, reqData);

  return res.json();
}

export const peopleApi = {
  getSuggestedUsers,
  followUser,
}
