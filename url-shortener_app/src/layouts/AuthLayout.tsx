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
    <Box sx={{ width: '100%', minHeight: '100%', bgcolor: '#f1f5f9', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', py: 1.5, px: 4, flexShrink: 0 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>U</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0f172a', fontSize: '18px' }}>URLShort</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a', fontSize: '13px' }}>user@email.com</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px' }}>Free Plan</Typography>
              </Box>
              <Box sx={{ width: 28, height: 28, bgcolor: '#e2e8f0', borderRadius: '4px' }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Usage Indicator */}
        <Box sx={{ bgcolor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>Links Used</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b', fontSize: '13px' }}>5 of 100</Typography>
          </Box>
          <Box sx={{ width: '100%', bgcolor: '#e2e8f0', borderRadius: '9999px', height: 7, overflow: 'hidden' }}>
            <Box sx={{ width: '5%', height: '100%', bgcolor: '#14b8a6', borderRadius: '9999px' }} />
          </Box>
        </Box>

        {/* URL Form */}
        <Box sx={{ bgcolor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', p: 3, mb: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, height: 38, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
            <Box sx={{ height: 38, width: 90, bgcolor: '#14b8a6', borderRadius: '6px' }} />
          </Box>
        </Box>

        {/* URLs Table */}
        <Box sx={{ bgcolor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: '1px solid #e2e8f0', p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>Your Shortened URLs</Typography>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Original URL</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Short Code</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Clicks</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Date</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { url: 'https://github.com/example/project', code: 'gh7mK2', clicks: '245', date: 'Jan 5' },
                  { url: 'https://www.youtube.com/watch?v=tutorial', code: 'yt9nL4', clicks: '189', date: 'Jan 4' },
                  { url: 'https://docs.example.com/guide', code: 'doc5xP', clicks: '108', date: 'Jan 3' },
                ].map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#14b8a6', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{item.url}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#0f172a', fontFamily: 'monospace', fontWeight: 600, backgroundColor: '#f1f5f9' }}>{item.code}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#0f172a', textAlign: 'center', fontWeight: 600 }}>{item.clicks}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>{item.date}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Box sx={{ width: 24, height: 24, bgcolor: '#f1f5f9', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                        <Box sx={{ width: 24, height: 24, bgcolor: '#fee2e2', borderRadius: '4px', border: '1px solid #fecaca' }} />
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Container>

      {/* Animated blurred elements */}
      <Box sx={{ position: 'absolute', top: '5%', left: '5%', width: '30%', height: '25%', bgcolor: '#14b8a6', borderRadius: '12px', opacity: 0.04, filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', bottom: '10%', right: '8%', width: '35%', height: '30%', bgcolor: '#0ea5e9', borderRadius: '12px', opacity: 0.04, filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', top: '40%', right: '3%', width: '25%', height: '25%', bgcolor: '#14b8a6', borderRadius: '12px', opacity: 0.03, filter: 'blur(60px)' }} />
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
