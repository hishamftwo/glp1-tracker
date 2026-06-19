import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppDataProvider, useAppData } from './src/hooks/useAppData';
import { FAB } from './src/components/FAB';
import { LogSheet } from './src/components/LogSheet';
import { Toast } from './src/components/Toast';
import { Colors } from './src/constants/theme';
import OnboardingScreen from './src/screens/OnboardingScreen';

function AppContent() {
  const { data } = useAppData();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleSuccess = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Show onboarding if not complete
  if (!data.profile.onboardingComplete) {
    return <OnboardingScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgApp} />
      <AppNavigator />
      <FAB onPress={() => setSheetVisible(true)} />
      <LogSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSuccess={handleSuccess}
      />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
