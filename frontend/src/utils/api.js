const API_BASE_URL = "http://localhost:8080";

export const getAuthToken = () => localStorage.getItem("token");

const api = {
    get: async (endpoint, params = {}) => {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        const token = getAuthToken();
        if (token) url.searchParams.append("token", token);

        // Append additional params
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        return response.text();
    },

    post: async (endpoint, body, params = {}) => {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        const token = getAuthToken();
        if (token) url.searchParams.append("token", token);

        // Append additional params
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Some endpoints return text error messages
            throw new Error(await response.text());
        }

        // Handle valid responses that might be text or JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }
        return response.text();
    }
};

export default api;
