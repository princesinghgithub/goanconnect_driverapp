// // import { API_BASE_URL } from '@/constants/config';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { router, useLocalSearchParams } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useRef, useState } from 'react';
// // import {
// //   ActivityIndicator, Alert, KeyboardAvoidingView,
// //   Platform, StyleSheet, Text, TextInput,
// //   TouchableOpacity, View,
// // } from 'react-native';

// // export default function OtpScreen() {
// //   const { email } = useLocalSearchParams<{ email: string }>();
// //   const [otp, setOtp] = useState(['', '', '', '', '', '']);
// //   const [loading, setLoading] = useState(false);
// //   const [timer, setTimer] = useState(30);
// //   const inputs = useRef<any[]>([]);

// //   useEffect(() => {
// //     const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
// //     return () => clearInterval(t);
// //   }, []);

// //   const handleChange = (val: string, i: number) => {
// //     const n = [...otp]; n[i] = val; setOtp(n);
// //     if (val && i < 5) inputs.current[i + 1]?.focus();
// //     if (val && i === 5) verify(n.join(''));
// //   };

// //   const handleKey = (e: any, i: number) => {
// //     if (e.nativeEvent.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
// //   };

// //   const verify = async (val?: string) => {
// //     const finalOtp = val || otp.join('');
// //     if (finalOtp.length !== 6) { Alert.alert('Error', '6 digit OTP daalo'); return; }
// //     setLoading(true);
// //     try {
// //       const res = await axios.post(`${API_BASE_URL}/provider/verify-otp`, { email, otp: finalOtp });
// //       if (res.data?.success) {
// //         await AsyncStorage.setItem('driverToken', res.data.token);
// //         await AsyncStorage.setItem('driverData', JSON.stringify(res.data.provider));
// //         router.replace('/(tabs)/home');
// //       }
// //     } catch (err: any) {
// //       Alert.alert('Error', err?.response?.data?.message || 'OTP galat hai');
// //       setOtp(['', '', '', '', '', '']);
// //       inputs.current[0]?.focus();
// //     } finally { setLoading(false); }
// //   };

// //   return (
// //     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
// //       <StatusBar style="light" />
// //       <View style={styles.top}>
// //         <Text style={styles.emoji}>📲</Text>
// //         <Text style={styles.title}>OTP Verify Karo</Text>
// //         <Text style={styles.sub}>{email} pe OTP bheja gaya</Text>
// //       </View>
// //       <View style={styles.form}>
// //         <View style={styles.otpRow}>
// //           {otp.map((d, i) => (
// //             <TextInput
// //               key={i}
// //               ref={(el) => {
// //                 if (el) inputs.current[i] = el;
// //               }}
// //               style={[styles.box, d ? styles.boxFilled : null]}
// //               value={d}
// //               onChangeText={(v) => handleChange(v.slice(-1), i)}
// //               onKeyPress={(e) => handleKey(e, i)}
// //               keyboardType="number-pad"
// //               maxLength={1}
// //               textAlign="center"
// //               autoFocus={i === 0}
// //             />
// //           ))}
// //         </View>
// //         <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={() => verify()} disabled={loading}>
// //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify ✅</Text>}
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.resend} onPress={() => { }} disabled={timer > 0}>
// //           <Text style={[styles.resendText, timer > 0 && { color: '#aaa' }]}>
// //             {timer > 0 ? `Resend OTP (${timer}s)` : 'OTP Dobara Bhejo 🔄'}
// //           </Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.back} onPress={() => router.replace('/(auth)/login')}>
// //           <Text style={styles.backText}>← Email Badlo</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#1a3a5c' },
// //   top: { flex: 0.32, justifyContent: 'center', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
// //   emoji: { fontSize: 52, marginBottom: 12 },
// //   title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 8 },
// //   sub: { fontSize: 14, color: '#adc6e0', textAlign: 'center' },
// //   form: { flex: 0.68, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingTop: 36 },
// //   otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
// //   box: { width: 48, height: 56, borderRadius: 14, borderWidth: 2, borderColor: '#eee', fontSize: 24, fontWeight: '800', color: '#1a1a2e', backgroundColor: '#f5f5f5' },
// //   boxFilled: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
// //   btn: { backgroundColor: '#F5A623', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16, elevation: 4 },
// //   btnDisabled: { backgroundColor: '#ddd', elevation: 0 },
// //   btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
// //   resend: { alignItems: 'center', padding: 12 },
// //   resendText: { fontSize: 14, fontWeight: '700', color: '#F5A623' },
// //   back: { alignItems: 'center', padding: 12 },
// //   backText: { fontSize: 14, color: '#888' },
// // });


// import { API_BASE_URL } from '@/constants/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator, Alert, KeyboardAvoidingView,
//   Platform, StyleSheet, Text, TextInput,
//   TouchableOpacity, View,
// } from 'react-native';

// export default function OtpScreen() {
//   const { email } = useLocalSearchParams<{ email: string }>();
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const inputs = useRef<any[]>([]);

//   useEffect(() => {
//     const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const handleChange = (val: string, i: number) => {
//     const n = [...otp]; n[i] = val; setOtp(n);
//     if (val && i < 5) inputs.current[i + 1]?.focus();
//     if (val && i === 5) verify(n.join(''));
//   };

//   const handleKey = (e: any, i: number) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
//   };

//   const verify = async (val?: string) => {
//     const finalOtp = val || otp.join('');
//     if (finalOtp.length !== 6) { Alert.alert('Error', '6 digit OTP daalo'); return; }
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/provider/verify-otp`, { email, otp: finalOtp });
//       if (res.data?.success) {
//         await AsyncStorage.setItem('driverToken', res.data.token);
//         await AsyncStorage.setItem('driverData', JSON.stringify(res.data.provider));
//         router.replace('/(tabs)/home');
//       }
//     } catch (err: any) {
//       Alert.alert('Error', err?.response?.data?.message || 'OTP galat hai');
//       setOtp(['', '', '', '', '', '']);
//       inputs.current[0]?.focus();
//     } finally { setLoading(false); }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar style="light" />
//       <View style={styles.top}>
//         <Text style={styles.emoji}>📲</Text>
//         <Text style={styles.title}>OTP Verify Karo</Text>
//         <Text style={styles.sub}>{email} pe OTP bheja gaya</Text>
//       </View>
//       <View style={styles.form}>
//         <View style={styles.otpRow}>
//           {otp.map((d, i) => (
//             <TextInput
//               key={i}
//               ref={(r) => {
//                 if (r) inputs.current[i] = r;
//               }}
//               style={[styles.box, d && styles.boxFilled]}
//               value={d}
//               onChangeText={(v) => handleChange(v.slice(-1), i)}
//               onKeyPress={(e) => handleKey(e, i)}
//               keyboardType="number-pad"
//               maxLength={1}
//               textAlign="center"
//               autoFocus={i === 0}
//             />
//           ))}
//         </View>
//         <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={() => verify()} disabled={loading}>
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify ✅</Text>}
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.resend} onPress={() => { }} disabled={timer > 0}>
//           <Text style={[styles.resendText, timer > 0 && { color: '#aaa' }]}>
//             {timer > 0 ? `Resend OTP (${timer}s)` : 'OTP Dobara Bhejo 🔄'}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.back} onPress={() => router.replace('/(auth)/login')}>
//           <Text style={styles.backText}>← Email Badlo</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#1a3a5c' },
//   top: { flex: 0.32, justifyContent: 'center', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
//   emoji: { fontSize: 52, marginBottom: 12 },
//   title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 8 },
//   sub: { fontSize: 14, color: '#adc6e0', textAlign: 'center' },
//   form: { flex: 0.68, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingTop: 36 },
//   otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
//   box: { width: 48, height: 56, borderRadius: 14, borderWidth: 2, borderColor: '#eee', fontSize: 24, fontWeight: '800', color: '#1a1a2e', backgroundColor: '#f5f5f5' },
//   boxFilled: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
//   btn: { backgroundColor: '#F5A623', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 16, elevation: 4 },
//   btnDisabled: { backgroundColor: '#ddd', elevation: 0 },
//   btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
//   resend: { alignItems: 'center', padding: 12 },
//   resendText: { fontSize: 14, fontWeight: '700', color: '#F5A623' },
//   back: { alignItems: 'center', padding: 12 },
//   backText: { fontSize: 14, color: '#888' },
// });

// app/(auth)/otp.tsx
// import { API_BASE_URL } from '@/constants/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator, Alert, KeyboardAvoidingView,
//   Platform, StyleSheet, Text, TextInput,
//   TouchableOpacity, View,
// } from 'react-native';

// export default function OtpScreen() {
//   const { email } = useLocalSearchParams<{ email: string }>();
//   const [otp, setOtp]         = useState(['', '', '', '', '', '']);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer]     = useState(30);
//   const inputs = useRef<any[]>([]);

//   useEffect(() => {
//     const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const handleChange = (val: string, idx: number) => {
//     const newOtp = [...otp];
//     newOtp[idx] = val.replace(/[^0-9]/g, '');
//     setOtp(newOtp);
//     if (val && idx < 5) inputs.current[idx + 1]?.focus();
//   };

//   const handleKey = (e: any, idx: number) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
//       inputs.current[idx - 1]?.focus();
//     }
//   };

//   const handleVerify = async () => {
//     const otpStr = otp.join('');
//     if (otpStr.length < 6) { Alert.alert('OTP Daalo', 'Poora 6 digit OTP daalo'); return; }
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/provider/verify-otp`, {
//         email, otp: otpStr
//       });

//       if (res.data?.success) {
//         const { token, user, provider } = res.data;

//         // Save tokens
//         await AsyncStorage.setItem('driverToken', token);
//         await AsyncStorage.setItem('driverData', JSON.stringify({ ...provider, user }));

//         router.replace('/(tabs)/home');
//       }
//     } catch (err: any) {
//       const msg   = err?.response?.data?.message || 'OTP galat hai';
//       const status = err?.response?.status;

//       // 403 = Not approved yet
//       if (status === 403) {
//         await AsyncStorage.setItem('pendingEmail', email || '');
//         router.replace('/(auth)/pending-approval');
//         return;
//       }

//       Alert.alert('Error', msg);
//     } finally { setLoading(false); }
//   };

//   const resend = async () => {
//     if (timer > 0) return;
//     try {
//       await axios.post(`${API_BASE_URL}/provider/send-otp`, { email });
//       setTimer(30);
//       setOtp(['', '', '', '', '', '']);
//       Alert.alert('OTP Bheja', 'Naya OTP bhej diya gaya');
//     } catch (e: any) {
//       Alert.alert('Error', e?.response?.data?.message || 'Resend fail hua');
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar style="light" />
//       <View style={styles.top}>
//         <Text style={styles.emoji}>📲</Text>
//         <Text style={styles.title}>OTP Verify Karo</Text>
//         <Text style={styles.sub}>6 digit OTP bheja gaya:{'\n'}<Text style={styles.email}>{email}</Text></Text>
//       </View>

//       <View style={styles.form}>
//         <View style={styles.otpRow}>
//           {otp.map((digit, i) => (
//         <TextInput
//   key={i}
//   ref={(r) => {
//     if (r) inputs.current[i] = r;
//   }}
//   style={[styles.otpBox, digit && styles.otpBoxFilled]}
//   value={digit}
//   onChangeText={(v) => handleChange(v, i)}
//   onKeyPress={(e) => handleKey(e, i)}
//   keyboardType="number-pad"
//   maxLength={1}
//   selectTextOnFocus
// />
//           ))}
//         </View>

//         <TouchableOpacity
//           style={[styles.verifyBtn, loading && styles.btnDisabled]}
//           onPress={handleVerify} disabled={loading}
//         >
//           {loading
//             ? <ActivityIndicator color="#fff" />
//             : <Text style={styles.verifyBtnText}>✅ Verify Karo</Text>
//           }
//         </TouchableOpacity>

//         <TouchableOpacity onPress={resend} disabled={timer > 0} style={styles.resendBtn}>
//           <Text style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
//             {timer > 0 ? `Resend OTP (${timer}s)` : '🔄 OTP Dobara Bhejo'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#1a3a5c' },
//   top: { flex: 0.45, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 },
//   emoji: { fontSize: 64, marginBottom: 16 },
//   title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 12 },
//   sub: { fontSize: 14, color: '#adc6e0', textAlign: 'center', lineHeight: 22 },
//   email: { color: '#F5A623', fontWeight: '700' },
//   form: { flex: 0.55, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingTop: 36 },
//   otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
//   otpBox: { width: 46, height: 56, borderRadius: 14, borderWidth: 2, borderColor: '#eee', fontSize: 24, fontWeight: '900', color: '#1a1a2e', textAlign: 'center', backgroundColor: '#f8f9fa' },
//   otpBoxFilled: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
//   verifyBtn: { backgroundColor: '#F5A623', borderRadius: 16, padding: 18, alignItems: 'center', elevation: 4 },
//   btnDisabled: { backgroundColor: '#ddd', elevation: 0 },
//   verifyBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
//   resendBtn: { alignItems: 'center', padding: 20 },
//   resendText: { color: '#F5A623', fontSize: 15, fontWeight: '700' },
//   resendDisabled: { color: '#bbb' },
// });


import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<any[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (val: string, idx: number) => {
    const n = [...otp];
    n[idx] = val.replace(/[^0-9]/g, '');
    setOtp(n);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKey = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length < 6) { Alert.alert('OTP Daalo', 'Poora 6 digit OTP daalo'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/provider/verify-otp`, {
        email: email?.toLowerCase().trim(), otp: otpStr
      });
      if (res.data?.success) {
        const { token, user, provider } = res.data;
        // Save everything properly
        await AsyncStorage.setItem('driverToken', token);
        await AsyncStorage.setItem('driverUser', JSON.stringify(user));
        await AsyncStorage.setItem('driverData', JSON.stringify(provider || {}));
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'OTP galat hai';
      if (status === 403) {
        await AsyncStorage.setItem('pendingEmail', email || '');
        router.replace('/(auth)/pending-approval');
        return;
      }
      Alert.alert('Error', msg);
    } finally { setLoading(false); }
  };

  const resend = async () => {
    if (timer > 0) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/provider/send-otp`, { email });
      setTimer(30); setOtp(['', '', '', '', '', '']);
      const newOtp = res.data?.otp;
      Alert.alert('OTP Bheja ✅', newOtp ? `Dev OTP: ${newOtp}` : 'Email check karo');
    } catch (e: any) { Alert.alert('Error', e?.response?.data?.message || 'Resend fail'); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <Text style={styles.emoji}>📲</Text>
        <Text style={styles.title}>OTP Verify Karo</Text>
        <Text style={styles.sub}>6 digit OTP bheja gaya:{'\n'}<Text style={styles.emailText}>{email}</Text></Text>
      </View>
      <View style={styles.form}>
        <View style={styles.otpRow}>
          {otp.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                if (r) inputs.current[i] = r;
              }}
              style={[styles.box, d && styles.boxFilled]}
              value={d}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKey(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        <TouchableOpacity style={[styles.btn, loading && styles.btnOff]} onPress={handleVerify} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>✅ Verify Karo</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={resend} disabled={timer > 0} style={styles.resend}>
          <Text style={[styles.resendText, timer > 0 && { color: '#bbb' }]}>
            {timer > 0 ? `Resend OTP (${timer}s)` : '🔄 OTP Dobara Bhejo'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  top: { flex: 0.45, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 12 },
  sub: { fontSize: 14, color: '#adc6e0', textAlign: 'center', lineHeight: 22 },
  emailText: { color: '#F5A623', fontWeight: '700' },
  form: { flex: 0.55, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingTop: 36 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  box: { width: 46, height: 56, borderRadius: 14, borderWidth: 2, borderColor: '#eee', fontSize: 24, fontWeight: '900', color: '#1a1a2e', textAlign: 'center', backgroundColor: '#f8f9fa' },
  boxFilled: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
  btn: { backgroundColor: '#F5A623', borderRadius: 16, padding: 18, alignItems: 'center', elevation: 4 },
  btnOff: { backgroundColor: '#ddd' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  resend: { alignItems: 'center', padding: 20 },
  resendText: { color: '#F5A623', fontSize: 15, fontWeight: '700' },
});
