export interface JWTPayload {
  user: {
    user_id: string;
    name: string;
    email: string;
    phone: string;
    is_active: boolean;
  };
  platform_role: string;
  exp: number;
}

export interface AuthOrg {
  id: string;
  name: string;
  role: string;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as JWTPayload;
  } catch {
    return null;
  }
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getRedirectPath(platformRole: string, organisations: AuthOrg[]): string {
  if (platformRole === "super_admin") return "/super-admin/dashboard";

  if (organisations.length > 0) {
    const org = organisations[0];
    if (org.role === "student") return "/student/dashboard";
    return `/org/${org.id}/dashboard`;
  }

  return "/onboarding";
}
