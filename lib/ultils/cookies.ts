import { setCookie } from 'cookies-next';

export function saveTokenToCookie(token: string, cookieName = 'auth-token', days = 7) {
  const maxAge = 60 * 60 * 24 * days;

  setCookie(cookieName, token, {
    maxAge,
    path: '/',
  });
}
