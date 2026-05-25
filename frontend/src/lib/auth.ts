// Simple client-side auth stub. Stored in localStorage.
const KEY = "parkcar_auth";

export type AuthUser = {
  name: string;
  email: string;
  role: string;
};

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function login(email: string): AuthUser {
  const user: AuthUser = {
    name: "Alex Rivera",
    email: email || "manager@urbaninfra.com",
    role: "Fleet Manager",
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
}
