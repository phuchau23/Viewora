import { setCookies } from 'cookies-next';

export function saveTokenToCookie(token: string, cookieName = 'auth-token', days = 7) {
  const maxAge = 60 * 60 * 24 * days;

  setCookies(cookieName, token, {
    maxAge,
    path: '/',
  });
}