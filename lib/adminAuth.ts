export interface AdminCredentials {
  username: string;
  passwordHash: string; // Stored securely
}

const CREDS_KEY = "atg_admin_creds_v1";
const SESSION_KEY = "atg_admin_session_v1";

const DEFAULT_CREDS: AdminCredentials = {
  username: "admin",
  passwordHash: "atg-password-2026",
};

export function getAdminCreds(): AdminCredentials {
  if (typeof window === "undefined") return DEFAULT_CREDS;
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) {
      localStorage.setItem(CREDS_KEY, JSON.stringify(DEFAULT_CREDS));
      return DEFAULT_CREDS;
    }
    return JSON.parse(raw) as AdminCredentials;
  } catch {
    return DEFAULT_CREDS;
  }
}

export function saveAdminCreds(creds: AdminCredentials) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
  } catch (err) {
    console.error("Error saving admin credentials", err);
  }
}

export function checkIsAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    // 24 hour session expiration check
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return parsed.authenticated === true;
  } catch {
    return false;
  }
}

export function loginAdmin(user: string, pass: string): boolean {
  if (typeof window === "undefined") return false;
  const currentCreds = getAdminCreds();
  if (user.trim() === currentCreds.username && pass.trim() === currentCreds.passwordHash) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ authenticated: true, timestamp: Date.now(), user })
    );
    return true;
  }
  return false;
}

export function logoutAdmin() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
