import { z } from 'zod';
import { ValidationError } from './errors';

// Auth Validation Schemas
export const AuthPayloadSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

// URL Validation Schemas
export const CreateUrlPayloadSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'Original URL is required')
    .url('Invalid URL format'),
});

export type CreateUrlPayload = z.infer<typeof CreateUrlPayloadSchema>;

// Utility function to validate and parse with Zod
export const validateData = <T>(schema: z.ZodSchema, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new ValidationError(errors);
  }
  return result.data as T;
};
