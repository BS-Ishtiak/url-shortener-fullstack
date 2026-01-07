'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  Typography,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement | SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar>
          <Link href="/" style={{ textDecoration: 'none', color: 'white', flex: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                fontSize: '1.5rem',
                letterSpacing: '-0.5px',
              }}
            >
              ⚡ URL Shortener
            </Typography>
          </Link>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Desktop Menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500,
                  }}
                >
                  {user.email}
                </Typography>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#764ba2',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  onClick={handleMenuOpen}
                >
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              {/* Mobile Menu */}
              <MenuIcon
                size={24}
                style={{ cursor: 'pointer', display: 'none' }}
                onClick={handleMenuOpen}
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
          <LogOut size={18} />
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        {children}
      </Container>


    </Box>
  );
}
