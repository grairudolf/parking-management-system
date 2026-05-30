// Simple client-side auth stub. Stored in localStorage.
const KEY = "parkcar_auth";

export type AuthUser = {
  name: string;
  email: string;
  role: string;
  customerId: string;
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

export function login(userData: { name: string; email: string; customerId: string }): AuthUser {
  const user: AuthUser = {
    name: userData.name,
    email: userData.email,
    role: "Customer",
    customerId: userData.customerId,
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
}
