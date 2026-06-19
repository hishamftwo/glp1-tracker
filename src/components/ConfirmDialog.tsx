import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const colors = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.dialog, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.inkSoft }]}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: colors.inkSoft }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirmBtn, { backgroundColor: colors.coral }]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  dialog: {
    width: '100%',
    borderRadius: 18,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {},
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
