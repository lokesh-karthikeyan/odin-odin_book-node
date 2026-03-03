const BASE_URL = 'http://localhost:3000/api/v1';

export const conversationsApi = {
  async getAll(fetch, token) {
    const res = await fetch(`${BASE_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getById(fetch, token, conversationId) {
    const res = await fetch(
      `${BASE_URL}/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw await res.json();
    return res.json();
  },

  async createOrGet(fetch, token, userId) {
    const res = await fetch(
      `${BASE_URL}/conversations/${userId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw await res.json();
    return res.json();
  },

  async sendMessage(fetch, token, conversationId, formData) {
    const res = await fetch(
      `${BASE_URL}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getSuggestedUsers(fetch, token) {
    const res = await fetch(`${BASE_URL}/conversations/suggested-users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw await res.json();
    return res.json();
  },

  subscribe(token, onMessage) {
    const socket = new WebSocket(`${BASE_URL}/ws?token=${token}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_MESSAGE') {
          onMessage(data.payload);
        }
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };

    socket.onerror = (err) => console.error("WS Socket Error:", err);
    return () => {
      if (socket.readyState === 1) socket.close();
    };
  },
};
