// import { API_BASE_URL } from '@/constants/config';
// import axios from 'axios';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import {
//   ActivityIndicator, Alert, KeyboardAvoidingView,
//   Platform, StyleSheet, Text, TextInput,
//   TouchableOpacity, View,
// } from 'react-native';

// export default function LoginScreen() {
//   const [email, setEmail]     = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email.trim() || !email.includes('@')) {
//       Alert.alert('Error', 'Sahi email daalo'); return;
//     }
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/provider/send-otp`, {
//         email: email.trim().toLowerCase(),
//       });
//       if (res.data?.success) {
//         if (res.data?.otp) {
//           Alert.alert('OTP (Dev)', `OTP: ${res.data.otp}`, [
//             { text: 'OK', onPress: () => router.push({ pathname: '/(auth)/otp', params: { email } }) }
//           ]);
//         } else {
//           router.push({ pathname: '/(auth)/otp', params: { email } });
//         }
//       }
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || 'Error hua';
//       Alert.alert('Error', msg);
//     } finally { setLoading(false); }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar style="light" />
//       <View style={styles.top}>
//         <Text style={styles.emoji}>🚗</Text>
//         <Text style={styles.appName}>GaonConnect</Text>
//         <Text style={styles.role}>Driver App</Text>
//       </View>
//       <View style={styles.form}>
//         <Text style={styles.title}>Driver Login</Text>
//         <Text style={styles.subtitle}>Apna registered email daalo</Text>
//         <Text style={styles.label}>📧 Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="driver@email.com"
//           placeholderTextColor="#bbb"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           returnKeyType="done"
//           onSubmitEditing={handleLogin}
//         />
//         <TouchableOpacity
//           style={[styles.btn, loading && styles.btnDisabled]}
//           onPress={handleLogin} disabled={loading}
//         >
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>OTP Bhejo 📲</Text>}
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#1a3a5c' },
//   top: { flex: 0.42, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
//   emoji: { fontSize: 72, marginBottom: 12 },
//   appName: { fontSize: 32, fontWeight: '900', color: '#fff' },
//   role: { fontSize: 16, color: '#F5A623', fontWeight: '700', marginTop: 6 },
//   form: { flex: 0.58, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingTop: 32 },
//   title: { fontSize: 26, fontWeight: '900', color: '#1a1a2e', marginBottom: 6 },
//   subtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
//   label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
//   input: { backgroundColor: '#f5f5f5', borderRadius: 14, padding: 16, fontSize: 16, color: '#1a1a2e', borderWidth: 1.5, borderColor: '#eee', marginBottom: 20 },
//   btn: { backgroundColor: '#F5A623', borderRadius: 16, padding: 16, alignItems: 'center', elevation: 4 },
//   btnDisabled: { backgroundColor: '#ddd', elevation: 0 },
//   btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
// });


import { API_BASE_URL } from '@/constants/config';
import axios from 'axios';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !email.includes('@')) { Alert.alert('Error', 'Sahi email daalo'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/provider/send-otp`, { email: email.trim().toLowerCase() });
      if (res.data?.success) {
        if (res.data?.otp) {
          Alert.alert('OTP (Dev)', `OTP: ${res.data.otp}`, [
            { text: 'OK', onPress: () => router.push({ pathname: '/(auth)/otp', params: { email } }) }
          ]);
        } else {
          router.push({ pathname: '/(auth)/otp', params: { email } });
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Error hua');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <Text style={styles.emoji}>🚗</Text>
        <Text style={styles.appName}>GaonConnect</Text>
        <Text style={styles.role}>Driver App</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Driver Login</Text>
        <Text style={styles.subtitle}>Apna registered email daalo</Text>
        <Text style={styles.label}>📧 Email</Text>
        <TextInput
          style={styles.input} placeholder="driver@email.com" placeholderTextColor="#bbb"
          value={email} onChangeText={setEmail} keyboardType="email-address"
          autoCapitalize="none" returnKeyType="done" onSubmitEditing={handleLogin}
        />
        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>OTP Bhejo 📲</Text>}
        </TouchableOpacity>

        <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>ya</Text><View style={styles.dividerLine} /></View>

        <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerBtnText}>Naya Driver? Register Karo 🚀</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  top: { flex: 0.4, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emoji: { fontSize: 72, marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: '900', color: '#fff' },
  role: { fontSize: 16, color: '#F5A623', fontWeight: '700', marginTop: 6 },
  form: { flex: 0.6, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingTop: 32 },
  title: { fontSize: 26, fontWeight: '900', color: '#1a1a2e', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 14, padding: 16, fontSize: 16, color: '#1a1a2e', borderWidth: 1.5, borderColor: '#eee', marginBottom: 20 },
  btn: { backgroundColor: '#F5A623', borderRadius: 16, padding: 16, alignItems: 'center', elevation: 4 },
  btnDisabled: { backgroundColor: '#ddd', elevation: 0 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { marginHorizontal: 12, color: '#aaa', fontSize: 13 },
  registerBtn: { borderWidth: 2, borderColor: '#F5A623', borderRadius: 16, padding: 16, alignItems: 'center' },
  registerBtnText: { color: '#F5A623', fontSize: 15, fontWeight: '800' },
});
