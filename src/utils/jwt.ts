import type { JwtPayload } from "../types";

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((character) => {
          const code = character.charCodeAt(0);

          return `%${code
            .toString(16)
            .padStart(2, "0")}`;
        })
        .join("")
    );

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(
  payload: JwtPayload | null
): boolean {
  if (!payload?.exp) {
    return false;
  }

  const currentTimeInSeconds = Math.floor(
    Date.now() / 1000
  );

  return payload.exp <= currentTimeInSeconds;
}
