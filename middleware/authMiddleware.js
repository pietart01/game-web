// Auth middleware to check session state
export function checkAuthState(req, res, next) {
  // console.log('checkAuthState', req.headers.cookie);
  // alert('checkAuthState');
  // Get auth state from session storage on server side
  const authCookie = req.headers.cookie?.split(';').find(c => c.trim().startsWith('auth='));
  const isAuthenticated = !!authCookie;

  // Add auth state to res.locals so it's available in all views
  res.locals.isAuthenticated = isAuthenticated;

  next();
}
