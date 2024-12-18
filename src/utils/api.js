/**
 * Sends an API request with optional authentication and body payload.
 * @param {string} url - The endpoint URL.
 * @param {string} [method="GET"] - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object|null} [body=null] - The request body (for POST/PUT requests).
 * @returns {Promise<object>} - The parsed JSON response.
 * @throws {Error} - If the response status is not OK or another error occurs.
 */
export const apiRequest = async (url, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  console.log(`[API REQUEST] ${method} ${url}`, body ? { body } : "No body");

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        `[API ERROR]: ${response.status} ${response.statusText}`,
        responseData
      );
      throw new Error(
        responseData.error || `Request failed with status ${response.status}`
      );
    }

    console.log(`[API RESPONSE]:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`[API FETCH ERROR]: ${error.message}`, {
      url,
      method,
      body,
    });
    throw error;
  }
};
