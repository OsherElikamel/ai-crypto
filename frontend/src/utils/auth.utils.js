import axios from "axios";

export const buildRequest = async (url, body) => {
  const apiBase = import.meta.env.VITE_SERVER_URL || "";
  try {
    const response = await axios.post(`${apiBase}${url}`, body, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(
        data?.error || data?.message || `Request failed (${status})`
      );
    } else if (error.request) {
      throw new Error("No response from server. Check if backend is running.");
    } else {
      throw new Error(error.message);
    }
  }
};
