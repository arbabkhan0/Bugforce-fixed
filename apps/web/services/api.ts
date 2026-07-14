const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
type ApiResponse<T> = { success: boolean; message: string; data: T };

let refreshPromise: Promise<string | null> | null = null;
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  if (!refreshPromise) {
    refreshPromise = fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: ApiResponse<{ accessToken: string }> | null) => {
        if (!body) return null;
        localStorage.setItem('accessToken', body.data.accessToken);
        return body.data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function api<T>(path: string, init: RequestInit = {}, isRetry = false): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (response.status === 401 && !isRetry && path !== '/auth/refresh' && path !== '/auth/login') {
    const newToken = await refreshAccessToken();
    if (newToken) return api<T>(path, init, true);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok) throw new Error(body.message);
  return body.data;
}
