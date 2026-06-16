const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (username: string, password: string, rememberMe: boolean) => {
  const res = await fetch(`${API_URL}/Login/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ Username: username, Password: password, RememberMe: rememberMe }),
  });
  if (!res.ok) throw new Error("Login failed");
};

export const logout = async () => {
  await fetch(`${API_URL}/Login/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export const clearToken = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};