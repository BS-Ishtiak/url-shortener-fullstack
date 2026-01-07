'use client';

import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography, Stack } from '@mui/material';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

// Dashboard-like background for visual effect (no auth guard)
function DashboardBackground() {
  return (
    <Box sx={{ width: '100%', minHeight: '100%', bgcolor: '#f9fafb', p: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ space: 'y-8' }}>
          {/* Create URL Section */}
          <Box sx={{ bgcolor: 'white', borderRadius: 1, boxShadow: 1, p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Create Shortened URL
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  height: 40,
                  border: '1px solid #e5e7eb',
                  borderRadius: 1,
                  bgcolor: '#f3f4f6',
                }}
              />
              <Box
                sx={{
                  height: 40,
                  width: 120,
                  bgcolor: '#00b3a0',
                  borderRadius: 1,
                  color: 'white',
                }}
              />
            </Box>
          </Box>

          {/* URLs List Section */}
          <Box sx={{ bgcolor: 'white', borderRadius: 1, boxShadow: 1, p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your Shortened URLs
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px' }}>Original URL</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px' }}>Short Code</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px' }}>Clicks</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px' }}>Created</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#00b3a0' }}>https://example.com/very/long/url</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontFamily: 'monospace' }}>abc{i}23</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>42</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>1/7/2026</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Box sx={{ height: 24, width: 50, bgcolor: '#f3f4f6', borderRadius: 0.5 }} />
                          <Box sx={{ height: 24, width: 50, bgcolor: '#fee2e2', borderRadius: 0.5 }} />
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Blurred Dashboard Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: 'blur(8px)',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <DashboardBackground />
      </Box>

      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      {/* Form Container */}
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
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
                variant="h4"
                component="h5"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #00b3a0 0%, #00796b 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography variant="body1" color="primary">
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
