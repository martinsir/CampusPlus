/**
 * Save the token to localStorage.
 * @param {string} token - The JWT token to save.
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem("token", token);
    console.log("Token saved successfully.");
  } catch (error) {
    console.error("Failed to save token:", error);
  }
};

/**
 * Clear the token from localStorage.
 */
export const clearToken = () => {
  try {
    localStorage.removeItem("token");
    console.log("Token cleared successfully.");
  } catch (error) {
    console.error("Failed to clear token:", error);
  }
};

/**
 * Decode the JWT token and return its payload.
 * @param {string} token - The JWT token to decode.
 * @returns {object|null} The decoded payload or null if invalid.
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Extract the user role from the JWT token.
 * @param {string} token - The JWT token.
 * @returns {string|null} The user role or null if invalid.
 */
export const getRoleFromToken = (token) => {
  const payload = decodeToken(token);
  if (payload && payload.role) {
    console.log("User role extracted:", payload.role);
    return payload.role;
  }
  console.warn("Role not found in token.");
  return null;
};

/**
 * Retrieve the saved token from localStorage.
 * @returns {string|null} The saved token or null if not found.
 */
export const getToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token retrieved successfully.");
      return token;
    }
    console.warn("No token found in localStorage.");
    return null;
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    return null;
  }
};
