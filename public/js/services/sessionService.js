// Session management service
export const sessionService = {
  set(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  clear() {
    localStorage.removeItem('user');
  },

  get() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};