const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export async function authenticate(path, body) {
  const response = await fetch(`${API_URL}/auth/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("codepage_token");

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    localStorage.removeItem("codepage_token");
    localStorage.removeItem("codepage_user");
    throw new Error(data.message || "Authentication failed.");
  }

  return data.user;
}


export async function updateUserProfile(profileData) {
  const token = localStorage.getItem("codepage_token");

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Profile update failed.");
  }

  return data.user;
}
