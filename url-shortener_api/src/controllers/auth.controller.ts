import { Request, Response, NextFunction } from 'express';
import { signUp, login, AuthPayload } from '../services/auth.service';
import { successResponse } from '../utils/response';

// Sign up controller
export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload: AuthPayload = req.body;
    const result = await signUp(payload);

    res.status(201).json(
      successResponse('User created successfully', {
        id: result.id,
        email: result.email,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Login controller
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload: AuthPayload = req.body;
    const result = await login(payload);

    res.status(200).json(
      successResponse('Login successful', {
        id: result.id,
        email: result.email,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get profile controller
export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json(
      successResponse('Profile retrieved', {
        id: req.user?.id,
        email: req.user?.email,
      })
    );
  } catch (error) {
    next(error);
  }
};
