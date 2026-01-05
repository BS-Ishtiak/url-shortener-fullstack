import pool from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../config/jwt';
import { ValidationError, AuthError, ConflictError } from '../utils/errors';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

// Sign up new user
export const signUp = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { email, password } = payload;

  // Validate input
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hashedPassword]
  );

  const user = result.rows[0];

  // Generate tokens
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });

  return {
    id: user.id,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

// Login user
export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { email, password } = payload;

  // Validate input
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user
  const result = await pool.query('SELECT id, email, password FROM users WHERE email = $1', [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new AuthError('Invalid email or password');
  }

  const user = result.rows[0];

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AuthError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });

  return {
    id: user.id,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

// Get user by ID
export const getUserById = async (id: string) => {
  const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};
