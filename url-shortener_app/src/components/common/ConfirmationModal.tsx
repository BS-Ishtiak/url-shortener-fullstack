'use client';

import React from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button as MuiButton } from '@mui/material';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isDangerous && (
            <AlertCircle size={24} color="#ef4444" />
          )}
          <span>{title}</span>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
            {message}
          </p>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <MuiButton
          onClick={onCancel}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {cancelText}
        </MuiButton>
        <Button
          variant={isDangerous ? 'danger' : 'primary'}
          size="sm"
          loading={loading}
          disabled={loading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
