export function setTokenCookie(cookies, token) {
  cookies.set('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24,
  });
}
