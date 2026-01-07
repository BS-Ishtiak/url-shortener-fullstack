'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthLayout } from '@/layouts';
import { Button } from '@/components/common';
import authService from '@/services/auth.service';
import Link from 'next/link';
import {
  TextField,
  Stack,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const router = useRouter();
  const { login } = useAuth();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const user = response.data;

      login(user);

      addToast('Login successful!', 'success');
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to URL Shortener">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Email Field */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Mail size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Lock size={20} style={{ marginRight: '12px', color: '#667eea' }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
          </Box>

          {/* Remember Me & Forgot Password */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              component="label"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            >
              <input type="checkbox" />
              <Typography variant="caption">Remember me</Typography>
            </Typography>
            <Link href="#" className="text-blue-600 hover:underline text-sm">
              Forgot password?
            </Link>
          </Box>

          {/* Submit Button */}
          <Box
            component="button"
            type="submit"
            disabled={loading}
            sx={{
              width: '100%',
              py: 1.5,
              px: 3,
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: 1,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#764ba2',
              },
              '&:disabled': {
                opacity: 0.6,
                cursor: 'not-allowed',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
          </Box>
        </Stack>
      </form>

      {/* Sign Up Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            style={{
              color: '#667eea',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
