// // app/(auth)/index.tsx
// import { router } from 'expo-router';
// import { useEffect } from 'react';
// import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// export default function SplashScreen() {
//   useEffect(() => {
//     setTimeout(checkLogin, 1000);
//   }, []);

//   const checkLogin = async () => {
//     try {
//       // Dynamic import to avoid crash if not installed
//       const AsyncStorage = require('@react-native-async-storage/async-storage').default;
//       const token = await AsyncStorage.getItem('driverToken');
//       if (token) {
//         router.replace('/(tabs)/home');
//       } else {
//         router.replace('/(auth)/login');
//       }
//     } catch (e) {
//       // AsyncStorage error — seedha login pe jao
//       console.log('Storage error, going to login:', e);
//       router.replace('/(auth)/login');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.emoji}>🚗</Text>
//       <Text style={styles.title}>GaonConnect</Text>
//       <Text style={styles.sub}>Driver App</Text>
//       <ActivityIndicator size="large" color="#F5A623" style={{ marginTop: 40 }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, backgroundColor: '#1a3a5c',
//     justifyContent: 'center', alignItems: 'center',
//   },
//   emoji: { fontSize: 80, marginBottom: 16 },
//   title: { fontSize: 36, fontWeight: '900', color: '#fff' },
//   sub: { fontSize: 16, color: '#F5A623', marginTop: 8, fontWeight: '700' },
// });


// app/(auth)/index.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(checkLogin, 1000);
  }, []);

  const checkLogin = async () => {
    try {
      // Dynamic import to avoid crash if not installed
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('driverToken');
      if (token) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (e) {
      // AsyncStorage error — seedha login pe jao
      console.log('Storage error, going to login:', e);
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚗</Text>
      <Text style={styles.title}>GaonConnect</Text>
      <Text style={styles.sub}>Driver App</Text>
      <ActivityIndicator size="large" color="#F5A623" style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1a3a5c',
    justifyContent: 'center', alignItems: 'center',
  },
  emoji: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: '900', color: '#fff' },
  sub: { fontSize: 16, color: '#F5A623', marginTop: 8, fontWeight: '700' },
});
