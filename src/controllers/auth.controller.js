import { loginService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const loginData = await loginService(req.body);

    res.status(200).json({
      tokenType: "Bearer",
      ...loginData
    });
  } catch (error) {
    next(error);
  }
};
