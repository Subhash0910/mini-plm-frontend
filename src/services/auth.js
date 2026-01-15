const TOKEN_KEY = "mini_plm_token";
const USER_KEY = "mini_plm_user";

export const auth = {
  setAuth: (authResponse) => {
    if (!authResponse) return;

    const { token, ...user } = authResponse;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }

    // user may include id, username, email, role
    localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
