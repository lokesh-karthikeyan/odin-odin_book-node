const BASE_URL = 'http://localhost:3000/api/v1/auth';

async function request(endpoint, data) {
  const reqData = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  };

  const res = await fetch(`${BASE_URL}/${endpoint}`, reqData);
  return res.json();
}

async function login({ email, password }) {
  return request("login", { email, password });
}

async function register({ fullName, email, password }) {
  return request("signup", { fullName, email, password });
}

async function logout(token) {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({}),
    credentials: "include"
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
}

export {
  login,
  register,
  logout,
}
