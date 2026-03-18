const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error((json as { message?: string }).message ?? "Something went wrong");
  }

  return json as ApiResponse<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
};
