import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AppData } from '../types';

const STORAGE_KEY = '@pinwell_data';
const ENCRYPTION_KEY_NAME = 'pinwell_enc_key';

export const defaultData: AppData = {
  injections: [],
  weights: [],
  profile: {
    name: '',
    age: 0,
    sex: '',
    height: 0,
    startWeight: 0,
    goalWeight: 0,
    reminderEnabled: true,
    reminderTime: '09:00',
    weightUnit: 'lbs',
    heightUnit: 'cm',
    darkMode: false,
    onboardingComplete: false,
  },
};

// Simple XOR-based encryption (lightweight for local storage)
function encrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  // Convert to base64 for safe storage
  return btoa(encodeURIComponent(result));
}

function decrypt(encoded: string, key: string): string {
  const text = decodeURIComponent(atob(encoded));
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function generateKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

async function getEncryptionKey(): Promise<string> {
  try {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
    if (!key) {
      key = generateKey();
      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
    }
    return key;
  } catch (e) {
    // Fallback if SecureStore is not available
    return 'pinwell_fallback_key_2026';
  }
}

export async function loadData(): Promise<AppData> {
  try {
    const encryptedJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (encryptedJson) {
      const key = await getEncryptionKey();
      let json: string;
      try {
        json = decrypt(encryptedJson, key);
      } catch (e) {
        // If decryption fails, try reading as plain JSON (migration from old format)
        json = encryptedJson;
      }
      const parsed = JSON.parse(json) as AppData;
      // Ensure new fields exist for older saved data
      if (parsed.profile.darkMode === undefined) parsed.profile.darkMode = false;
      if (parsed.profile.onboardingComplete === undefined) parsed.profile.onboardingComplete = false;
      if (parsed.profile.name === undefined) parsed.profile.name = '';
      if (parsed.profile.age === undefined) parsed.profile.age = 0;
      if (parsed.profile.sex === undefined) parsed.profile.sex = '';
      if (parsed.profile.height === undefined) parsed.profile.height = 0;
      if (parsed.profile.heightUnit === undefined) parsed.profile.heightUnit = 'cm';
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load data', e);
  }
  return defaultData;
}

export async function saveData(data: AppData): Promise<void> {
  try {
    const key = await getEncryptionKey();
    const json = JSON.stringify(data);
    const encrypted = encrypt(json, key);
    await AsyncStorage.setItem(STORAGE_KEY, encrypted);
  } catch (e) {
    console.error('Failed to save data', e);
  }
}
