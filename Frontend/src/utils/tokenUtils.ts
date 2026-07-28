const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function removeTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export interface DecodedToken {
  user_id: number;
  role: "student" | "counselor" | "admin";
  exp: number;
  iat: number;
}

export function decodeRole(): DecodedToken["role"] | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload)) as DecodedToken;
    return decoded.role;
  } catch {
    return null;
  }
}
