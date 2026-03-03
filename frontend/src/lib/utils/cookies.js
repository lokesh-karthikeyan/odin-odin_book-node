export function setTokenCookie(cookies, token) {
  cookies.set('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24,
  });
}

export const removeTokenCookie = (cookies) => {
  cookies.delete('token', { path: '/' });
};
