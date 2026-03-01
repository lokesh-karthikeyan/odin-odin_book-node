const BASE_URL = 'http://localhost:3000/api/v1';

const profileApi = {
  async getProfile(fetch, token, userId) {
    const res = await fetch(`${BASE_URL}/users/${userId}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.json();
  },

  async updateProfile(fetch, token, { fullName, bio, pictureFile }) {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('bio', bio ?? '');

    if (pictureFile) formData.append('picture', pictureFile);

    const res = await fetch(`${BASE_URL}/users/me/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!res.ok) throw await res.json();

    return res.json();
  }
}

export {
  profileApi,
}
