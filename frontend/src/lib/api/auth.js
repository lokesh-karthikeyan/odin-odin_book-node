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

export {
  login,
  register,
}
