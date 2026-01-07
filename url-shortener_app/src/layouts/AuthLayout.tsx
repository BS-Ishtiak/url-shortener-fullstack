'use client';

import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography, Stack } from '@mui/material';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          <Stack spacing={4}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {subtitle || (title === 'Sign In' ? 'Welcome back to URL Shortener' : 'Start shortening URLs today')}
              </Typography>
            </Box>

            {/* Form Section */}
            {children}

            {/* Divider with text */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
              <Box sx={{ flex: 1, height: 1, backgroundColor: '#e0e0e0' }} />
              <Typography variant="caption" color="textSecondary">
                OR
              </Typography>
              <Box sx={{ flex: 1, height: 1, backgroundColor: '#e0e0e0' }} />
            </Box>

            {/* Footer Info */}
            <Box sx={{ pt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                By using this service, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
