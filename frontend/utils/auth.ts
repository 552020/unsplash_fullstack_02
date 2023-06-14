export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const headersWithToken = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
};
