/**
 * Middleware to add view helper variables
 */
export function addViewHelpers(req, res, next) {
  // Add current path to res.locals so it's available in all views
  res.locals.path = req.path;
  
  // Add other view helpers here
  res.locals.isActive = (path) => req.path === path;
  
  next();
}