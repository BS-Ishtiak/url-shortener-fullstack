'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthLayout } from '@/layouts';
import authService from '@/services/auth.service';
import Link from 'next/link';
import {
  TextField,
  Stack,
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { Mail, Lock, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const router = useRouter();
  const { login } = useAuth();
  const { addToast } = useToast();

  // Password strength calculation
  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.signup({ email, password });
      const user = response.data;

      addToast('Account created successfully! Please login with your credentials.', 'success');
      router.push('/auth/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#10b981'][
    getPasswordStrength()
  ];

  return (
    <AuthLayout title="Sign Up" subtitle="Start shortening URLs today">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Email Field */}
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

          {/* Password Field */}
          <Box>
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
            {password && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Password Strength
                  </Typography>
                  <Typography variant="caption" sx={{ color: strengthColor, fontWeight: 600 }}>
                    {['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][getPasswordStrength()]}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(getPasswordStrength() + 1) * 20}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: strengthColor,
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <Lock size={20} style={{ marginRight: '12px', color: '#667eea' }} />
              ),
              endAdornment:
                password && confirmPassword && password === confirmPassword ? (
                  <CheckCircle size={20} style={{ color: '#10b981', marginLeft: '8px' }} />
                ) : null,
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

          {/* Password Requirements */}
          <Box sx={{ p: 2, backgroundColor: '#f3f4f6', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
              Password must contain:
            </Typography>
            <Stack spacing={0.5}>
              <PasswordRequirement
                met={password.length >= 8}
                text="At least 8 characters"
              />
              <PasswordRequirement
                met={/[a-z]/.test(password) && /[A-Z]/.test(password)}
                text="Uppercase and lowercase letters"
              />
              <PasswordRequirement met={/\d/.test(password)} text="At least one number" />
              <PasswordRequirement
                met={/[!@#$%^&*]/.test(password)}
                text="At least one special character"
              />
            </Stack>
          </Box>

          {/* Terms & Conditions */}
          <Typography
            component="label"
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, cursor: 'pointer' }}
          >
            <input type="checkbox" required style={{ marginTop: '4px' }} />
            <Typography variant="caption">
              I agree to the Terms of Service and Privacy Policy
            </Typography>
          </Typography>

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
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
          </Box>
        </Stack>
      </form>

      {/* Sign In Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            style={{
              color: '#667eea',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}

function PasswordRequirement({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: met ? '#10b981' : '#d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {met && <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Typography>}
      </Box>
      <Typography variant="caption" sx={{ color: met ? '#10b981' : '#6b7280' }}>
        {text}
      </Typography>
    </Box>
  );
}
