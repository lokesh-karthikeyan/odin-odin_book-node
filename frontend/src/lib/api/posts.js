const BASE_URL = 'http://localhost:3000/api/v1';

export const postsApi = {
  async getFeed(fetch, token, userId = null) {
    const url = userId
      ? `${BASE_URL}/posts?userId=${userId}`
      : `${BASE_URL}/posts`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async create(fetch, formData, token) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  async toggleLike(fetch, token, postId, isLiked) {
    const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: isLiked ? 'DELETE' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  async addComment(fetch, token, postId, content) {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });
    return res.json();
  },

  async getPost(fetch, token, postId) {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
