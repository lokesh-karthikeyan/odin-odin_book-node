import { PUBLIC_API_URL } from '$env/static/public';

export function getAvatarUrl({ picture, fullName } = {}) {
  if (picture) {
    if (picture.startsWith('http')) return picture;
    return `${PUBLIC_API_URL}${picture}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName || 'User'
  )}&background=random&color=random`;
}
