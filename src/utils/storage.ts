import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';

const STORAGE_KEY = '@glp1_tracker_data';

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

export async function loadData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json) as AppData;
      // Ensure new fields exist for older saved data
      if (parsed.profile.darkMode === undefined) {
        parsed.profile.darkMode = false;
      }
      if (parsed.profile.onboardingComplete === undefined) {
        parsed.profile.onboardingComplete = false;
      }
      if (parsed.profile.name === undefined) {
        parsed.profile.name = '';
      }
      if (parsed.profile.age === undefined) {
        parsed.profile.age = 0;
      }
      if (parsed.profile.sex === undefined) {
        parsed.profile.sex = '';
      }
      if (parsed.profile.height === undefined) {
        parsed.profile.height = 0;
      }
      if (parsed.profile.heightUnit === undefined) {
        parsed.profile.heightUnit = 'cm';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load data', e);
  }
  return defaultData;
}

export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}
