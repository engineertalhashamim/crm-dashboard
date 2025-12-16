import { ApiError } from "../utils/ApiError.js";

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    throw new ApiError(400, "Login required");
  }
};
export default isLoggedIn;
