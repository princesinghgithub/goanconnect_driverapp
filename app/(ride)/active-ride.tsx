// // // app/(ride)/active-ride.tsx
// // import { API_BASE_URL } from '@/constants/config';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { router, useLocalSearchParams } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useState } from 'react';
// // import {
// //     Alert, Linking, ScrollView, StyleSheet,
// //     Text, TextInput, TouchableOpacity, View,
// // } from 'react-native';

// // const STEPS = ['arrived', 'started', 'completed'];
// // const STEP_LABEL: any = {
// //   arrived:   { text: 'Pickup Pe Pahunch Gaya', emoji: '📍', color: '#9b59b6', btn: 'Pahunch Gaya ✅' },
// //   started:   { text: 'Ride Chal Rahi Hai 🚀',  emoji: '🚗', color: '#3498db', btn: 'Ride Complete Karo 🏁' },
// //   completed: { text: 'Ride Complete! 🎉',       emoji: '✅', color: '#27ae60', btn: 'Done' },
// // };

// // export default function ActiveRideScreen() {
// //   const params = useLocalSearchParams<{
// //     rideId: string;
// //     customerName: string;
// //     customerPhone: string;
// //     pickupAddress: string;
// //     dropAddress: string;
// //     fare: string;
// //     distance: string;
// //     otp: string;
// //   }>();

// //   const [step, setStep]         = useState<'arrived' | 'started' | 'completed'>('arrived');
// //   const [otpInput, setOtpInput] = useState('');
// //   const [loading, setLoading]   = useState(false);
// //   const [otpVerified, setOtpVerified] = useState(false);

// //   const handleCall = () => {
// //     if (params.customerPhone) Linking.openURL(`tel:${params.customerPhone}`);
// //   };

// //   const handleArrived = async () => {
// //     setLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       await axios.put(`${API_BASE_URL}/ride/status`,
// //         { rideId: params.rideId, status: 'arrived' },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setStep('started');
// //     } catch (e: any) {
// //       Alert.alert('Error', e?.response?.data?.message || 'Status update nahi hua');
// //     } finally { setLoading(false); }
// //   };

// //   const handleVerifyOtp = async () => {
// //     if (!otpInput || otpInput.length < 4) {
// //       Alert.alert('OTP Daalo', 'Customer ka OTP enter karo'); return;
// //     }
// //     setLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       const res = await axios.post(`${API_BASE_URL}/ride/verify-otp`,
// //         { rideId: params.rideId, otp: otpInput },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data?.success) {
// //         setOtpVerified(true);
// //         Alert.alert('OTP Sahi! ✅', 'Ride shuru karo');
// //       }
// //     } catch (e: any) {
// //       Alert.alert('Galat OTP', e?.response?.data?.message || 'OTP sahi nahi hai');
// //     } finally { setLoading(false); }
// //   };

// //   const handleComplete = async () => {
// //     if (!otpVerified && step === 'started') {
// //       Alert.alert('OTP Verify Karo', 'Pehle customer ka OTP verify karo'); return;
// //     }
// //     setLoading(true);
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       await axios.put(`${API_BASE_URL}/ride/status`,
// //         { rideId: params.rideId, status: 'completed' },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setStep('completed');
// //       setTimeout(() => router.replace('/(tabs)/home'), 2000);
// //     } catch (e: any) {
// //       Alert.alert('Error', e?.response?.data?.message || 'Complete nahi hua');
// //     } finally { setLoading(false); }
// //   };

// //   const currentStep = STEP_LABEL[step];

// //   return (
// //     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
// //       <StatusBar style="light" />

// //       {/* Header */}
// //       <View style={[styles.header, { backgroundColor: currentStep.color }]}>
// //         <Text style={styles.headerEmoji}>{currentStep.emoji}</Text>
// //         <Text style={styles.headerText}>{currentStep.text}</Text>
// //       </View>

// //       {/* Customer Card */}
// //       <View style={styles.card}>
// //         <Text style={styles.cardTitle}>👤 Customer</Text>
// //         <View style={styles.customerRow}>
// //           <View style={styles.customerAvatar}>
// //             <Text style={styles.customerAvatarText}>
// //               {(params.customerName || 'C').charAt(0).toUpperCase()}
// //             </Text>
// //           </View>
// //           <View style={styles.customerInfo}>
// //             <Text style={styles.customerName}>{params.customerName || 'Customer'}</Text>
// //             <Text style={styles.customerPhone}>{params.customerPhone}</Text>
// //           </View>
// //           <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
// //             <Ionicons name="call" size={20} color="#fff" />
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* Route Card */}
// //       <View style={styles.card}>
// //         <Text style={styles.cardTitle}>🗺️ Route</Text>
// //         <View style={styles.routeRow}>
// //           <View style={[styles.dot, { backgroundColor: '#27ae60' }]} />
// //           <Text style={styles.routeText} numberOfLines={2}>{params.pickupAddress}</Text>
// //         </View>
// //         <View style={styles.routeLine} />
// //         <View style={styles.routeRow}>
// //           <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
// //           <Text style={styles.routeText} numberOfLines={2}>{params.dropAddress}</Text>
// //         </View>
// //         <View style={styles.fareRow}>
// //           <Text style={styles.fareLabel}>📍 {parseFloat(params.distance || '0').toFixed(1)} km</Text>
// //           <Text style={styles.fareValue}>₹{params.fare}</Text>
// //         </View>
// //       </View>

// //       {/* OTP Verify — sirf started step pe */}
// //       {step === 'started' && !otpVerified && (
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>🔐 Customer OTP Verify Karo</Text>
// //           <Text style={styles.otpHint}>Customer apna OTP batayega — woh yahan daalo</Text>
// //           <View style={styles.otpRow}>
// //             <TextInput
// //               style={styles.otpInput}
// //               placeholder="OTP daalo"
// //               placeholderTextColor="#bbb"
// //               value={otpInput}
// //               onChangeText={setOtpInput}
// //               keyboardType="number-pad"
// //               maxLength={6}
// //             />
// //             <TouchableOpacity style={styles.otpBtn} onPress={handleVerifyOtp} disabled={loading}>
// //               <Text style={styles.otpBtnText}>Verify</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       )}

// //       {otpVerified && (
// //         <View style={styles.verifiedBadge}>
// //           <Text style={styles.verifiedText}>✅ OTP Verified — Ride Chal Rahi Hai!</Text>
// //         </View>
// //       )}

// //       {/* Action Button */}
// //       {step === 'completed' ? (
// //         <View style={styles.completedCard}>
// //           <Text style={styles.completedEmoji}>🎉</Text>
// //           <Text style={styles.completedText}>Ride Complete! ₹{params.fare} mila</Text>
// //         </View>
// //       ) : (
// //         <TouchableOpacity
// //           style={[styles.actionBtn, { backgroundColor: currentStep.color }, loading && styles.actionBtnDisabled]}
// //           onPress={step === 'arrived' ? handleArrived : handleComplete}
// //           disabled={loading}
// //         >
// //           <Text style={styles.actionBtnText}>
// //             {loading ? 'Wait karo...' : currentStep.btn}
// //           </Text>
// //         </TouchableOpacity>
// //       )}
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// //   header: {
// //     paddingTop: 60, paddingBottom: 24,
// //     alignItems: 'center', paddingHorizontal: 20,
// //   },
// //   headerEmoji: { fontSize: 48, marginBottom: 8 },
// //   headerText: { fontSize: 20, fontWeight: '800', color: '#fff' },
// //   card: {
// //     backgroundColor: '#fff', margin: 16, marginBottom: 4,
// //     borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee', elevation: 1,
// //   },
// //   cardTitle: { fontSize: 13, fontWeight: '800', color: '#888', marginBottom: 12 },
// //   customerRow: { flexDirection: 'row', alignItems: 'center' },
// //   customerAvatar: {
// //     width: 48, height: 48, borderRadius: 24,
// //     backgroundColor: '#1a3a5c', justifyContent: 'center',
// //     alignItems: 'center', marginRight: 12,
// //   },
// //   customerAvatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
// //   customerInfo: { flex: 1 },
// //   customerName: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
// //   customerPhone: { fontSize: 13, color: '#888', marginTop: 2 },
// //   callBtn: {
// //     width: 44, height: 44, borderRadius: 22,
// //     backgroundColor: '#27ae60', justifyContent: 'center', alignItems: 'center',
// //   },
// //   routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
// //   dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10, marginTop: 4 },
// //   routeLine: { width: 1, height: 14, backgroundColor: '#ddd', marginLeft: 4, marginVertical: 2 },
// //   routeText: { flex: 1, fontSize: 14, color: '#1a1a2e', fontWeight: '500' },
// //   fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
// //   fareLabel: { fontSize: 14, color: '#888' },
// //   fareValue: { fontSize: 22, fontWeight: '900', color: '#F5A623' },
// //   otpHint: { fontSize: 13, color: '#888', marginBottom: 12 },
// //   otpRow: { flexDirection: 'row', gap: 10 },
// //   otpInput: {
// //     flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12,
// //     padding: 14, fontSize: 18, fontWeight: '800',
// //     borderWidth: 1.5, borderColor: '#eee', color: '#1a1a2e',
// //     textAlign: 'center', letterSpacing: 4,
// //   },
// //   otpBtn: {
// //     backgroundColor: '#3498db', borderRadius: 12,
// //     paddingHorizontal: 20, justifyContent: 'center',
// //   },
// //   otpBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
// //   verifiedBadge: {
// //     backgroundColor: '#e8f8f5', margin: 16, marginBottom: 4,
// //     borderRadius: 14, padding: 14, alignItems: 'center',
// //     borderWidth: 1, borderColor: '#27ae60',
// //   },
// //   verifiedText: { color: '#27ae60', fontWeight: '800', fontSize: 14 },
// //   actionBtn: {
// //     margin: 16, borderRadius: 16, padding: 18, alignItems: 'center', elevation: 4,
// //   },
// //   actionBtnDisabled: { opacity: 0.6 },
// //   actionBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
// //   completedCard: {
// //     margin: 16, backgroundColor: '#e8f8f5', borderRadius: 16,
// //     padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#27ae60',
// //   },
// //   completedEmoji: { fontSize: 56, marginBottom: 12 },
// //   completedText: { fontSize: 18, fontWeight: '800', color: '#27ae60' },
// // });


// import { API_BASE_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { router, useLocalSearchParams } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function ActiveRideScreen() {
//   const params = useLocalSearchParams<{ rideId:string; customerName:string; customerPhone:string; pickupAddress:string; dropAddress:string; fare:string; distance:string; otp:string; }>();
//   const [step, setStep]           = useState<'arrived'|'started'|'completed'>('arrived');
//   const [otpInput, setOtpInput]   = useState('');
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [loading, setLoading]     = useState(false);

//   const updateStatus = async (status: string) => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       await axios.put(`${API_BASE_URL}/ride/status`, { rideId: params.rideId, status }, { headers: { Authorization: `Bearer ${token}` } });
//       if (status === 'arrived')   setStep('started');
//       if (status === 'completed') { setStep('completed'); setTimeout(() => router.replace('/(tabs)/home'), 2500); }
//     } catch (e: any) { Alert.alert('Error', e?.response?.data?.message || 'Update nahi hua'); }
//     finally { setLoading(false); }
//   };

//   const verifyOtp = async () => {
//     if (!otpInput || otpInput.length < 4) { Alert.alert('OTP Daalo', 'Sahi OTP enter karo'); return; }
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const res = await axios.post(`${API_BASE_URL}/ride/verify-otp`, { rideId: params.rideId, otp: otpInput }, { headers: { Authorization: `Bearer ${token}` } });
//       if (res.data?.success) { setOtpVerified(true); Alert.alert('✅ OTP Sahi!', 'Ride shuru ho gayi'); }
//     } catch (e: any) { Alert.alert('Galat OTP', e?.response?.data?.message || 'OTP sahi nahi'); }
//     finally { setLoading(false); }
//   };

//   const COLORS: any = { arrived: '#9b59b6', started: '#3498db', completed: '#27ae60' };
//   const TITLES: any = { arrived: '📍 Pickup Pe Pahuncho', started: '🚗 Ride Chal Rahi Hai', completed: '✅ Ride Complete!' };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       <StatusBar style="light" />
//       <View style={[styles.header, { backgroundColor: COLORS[step] }]}>
//         <Text style={styles.headerTitle}>{TITLES[step]}</Text>
//         <View style={styles.progressRow}>
//           {['arrived','started','completed'].map((s,i) => (
//             <View key={s} style={styles.progressItem}>
//               <View style={[styles.progressDot, (step === s || (i === 0 && step !== 'arrived') || (i === 1 && step === 'completed')) && styles.progressDotActive]} />
//               {i < 2 && <View style={[styles.progressLine, ((i===0 && step !== 'arrived') || (i===1 && step==='completed')) && styles.progressLineActive]} />}
//             </View>
//           ))}
//         </View>
//       </View>

//       {/* Customer */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>👤 Customer</Text>
//         <View style={styles.row}>
//           <View style={styles.cAvatar}><Text style={styles.cAvatarText}>{(params.customerName||'C').charAt(0).toUpperCase()}</Text></View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.cName}>{params.customerName}</Text>
//             <Text style={styles.cPhone}>{params.customerPhone}</Text>
//           </View>
//           <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${params.customerPhone}`)}>
//             <Ionicons name="call" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Route */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>🗺️ Route</Text>
//         <View style={styles.routeRow}><View style={[styles.dot, {backgroundColor:'#27ae60'}]} /><Text style={styles.routeText} numberOfLines={2}>{params.pickupAddress}</Text></View>
//         <View style={styles.routeLine} />
//         <View style={styles.routeRow}><View style={[styles.dot, {backgroundColor:'#e74c3c'}]} /><Text style={styles.routeText} numberOfLines={2}>{params.dropAddress}</Text></View>
//         <View style={styles.fareRow}>
//           <Text style={styles.fareLabel}>📍 {parseFloat(params.distance||'0').toFixed(1)} km</Text>
//           <Text style={styles.fareVal}>₹{params.fare}</Text>
//         </View>
//       </View>

//       {/* OTP Section */}
//       {step === 'started' && !otpVerified && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>🔐 Customer OTP Verify Karo</Text>
//           <Text style={styles.otpHint}>Customer se OTP lo aur yahan daalo</Text>
//           <View style={styles.otpRow}>
//             <TextInput style={styles.otpInput} placeholder="OTP" placeholderTextColor="#bbb"
//               value={otpInput} onChangeText={setOtpInput} keyboardType="number-pad" maxLength={6} />
//             <TouchableOpacity style={styles.otpBtn} onPress={verifyOtp} disabled={loading}>
//               <Text style={styles.otpBtnText}>Verify</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {otpVerified && (
//         <View style={styles.verifiedCard}>
//           <Text style={styles.verifiedText}>✅ OTP Verified! Ride chal rahi hai</Text>
//         </View>
//       )}

//       {/* Action Button */}
//       {step === 'completed' ? (
//         <View style={styles.completedCard}>
//           <Text style={styles.completedEmoji}>🎉</Text>
//           <Text style={styles.completedText}>Ride Complete! ₹{params.fare} mila</Text>
//           <Text style={styles.completedSub}>Home pe wapas ja rahe hain...</Text>
//         </View>
//       ) : (
//         <TouchableOpacity
//           style={[styles.actionBtn, { backgroundColor: COLORS[step] }, loading && { opacity: 0.6 }]}
//           disabled={loading || (step === 'started' && !otpVerified)}
//           onPress={() => step === 'arrived' ? updateStatus('arrived') : updateStatus('completed')}
//         >
//           <Text style={styles.actionBtnText}>
//             {loading ? 'Wait...' : step === 'arrived' ? '📍 Pickup Pe Pahunch Gaya' : '🏁 Ride Complete Karo'}
//           </Text>
//         </TouchableOpacity>
//       )}
//       {step === 'started' && !otpVerified && (
//         <Text style={styles.otpWarning}>⚠️ Pehle OTP verify karo — phir complete</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
//   headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 16 },
//   progressRow: { flexDirection: 'row', alignItems: 'center' },
//   progressItem: { flexDirection: 'row', alignItems: 'center' },
//   progressDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.3)' },
//   progressDotActive: { backgroundColor: '#fff' },
//   progressLine: { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
//   progressLineActive: { backgroundColor: '#fff' },
//   card: { backgroundColor: '#fff', margin: 16, marginBottom: 4, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eee', elevation: 1 },
//   cardTitle: { fontSize: 12, fontWeight: '800', color: '#aaa', marginBottom: 12, letterSpacing: 1 },
//   row: { flexDirection: 'row', alignItems: 'center' },
//   cAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   cAvatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
//   cName: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
//   cPhone: { fontSize: 13, color: '#888', marginTop: 2 },
//   callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#27ae60', justifyContent: 'center', alignItems: 'center' },
//   routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
//   dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10, marginTop: 4 },
//   routeLine: { width: 1, height: 14, backgroundColor: '#ddd', marginLeft: 4, marginVertical: 2 },
//   routeText: { flex: 1, fontSize: 14, color: '#1a1a2e', fontWeight: '500' },
//   fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
//   fareLabel: { fontSize: 14, color: '#888' },
//   fareVal: { fontSize: 24, fontWeight: '900', color: '#F5A623' },
//   otpHint: { fontSize: 13, color: '#888', marginBottom: 12 },
//   otpRow: { flexDirection: 'row', gap: 10 },
//   otpInput: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, fontSize: 20, fontWeight: '800', borderWidth: 1.5, borderColor: '#eee', color: '#1a1a2e', textAlign: 'center', letterSpacing: 6 },
//   otpBtn: { backgroundColor: '#3498db', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
//   otpBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
//   verifiedCard: { backgroundColor: '#e8f8f5', margin: 16, marginBottom: 4, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#27ae60' },
//   verifiedText: { color: '#27ae60', fontWeight: '800', fontSize: 14 },
//   actionBtn: { margin: 16, borderRadius: 16, padding: 18, alignItems: 'center', elevation: 4 },
//   actionBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
//   otpWarning: { textAlign: 'center', color: '#e74c3c', fontSize: 13, marginTop: -8, marginBottom: 8 },
//   completedCard: { margin: 16, backgroundColor: '#e8f8f5', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#27ae60' },
//   completedEmoji: { fontSize: 64, marginBottom: 12 },
//   completedText: { fontSize: 20, fontWeight: '900', color: '#27ae60' },
//   completedSub: { fontSize: 13, color: '#888', marginTop: 8 },
// });


// app/(ride)/active-ride.tsx — COMPLETE RAPIDO-STYLE ACTIVE RIDE
import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Linking,
  ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

type Step = 'pickup' | 'otp' | 'riding' | 'done';

export default function ActiveRideScreen() {
  const p = useLocalSearchParams<{
    rideId: string; customerName: string; customerPhone: string;
    pickupAddress: string; dropAddress: string; fare: string; distance: string; otp: string;
  }>();

  const [step, setStep]         = useState<Step>('pickup');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading]   = useState(false);

  const token = async () => (await AsyncStorage.getItem('driverToken')) || '';

  const updateStatus = async (status: string, nextStep: Step) => {
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/ride/status`,
        { rideId: p.rideId, status },
        { headers: { Authorization: `Bearer ${await token()}` } }
      );
      setStep(nextStep);
    } catch (e: any) { Alert.alert('Error', e?.response?.data?.message || 'Update nahi hua'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otpInput.length < 4) { Alert.alert('OTP Daalo', 'Customer ka OTP enter karo'); return; }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/ride/verify-otp`,
        { rideId: p.rideId, otp: otpInput },
        { headers: { Authorization: `Bearer ${await token()}` } }
      );
      setStep('riding');
      await updateStatus('started', 'riding');
    } catch (e: any) { Alert.alert('Galat OTP', e?.response?.data?.message || 'OTP sahi nahi'); }
    finally { setLoading(false); }
  };

  const completeRide = async () => {
    Alert.alert('Ride Complete?', 'Kya aap destination pe pahunch gaye?', [
      { text: 'Nahi', style: 'cancel' },
      { text: 'Haan, Complete Karo', onPress: async () => {
        setLoading(true);
        try {
          await axios.put(`${API_BASE_URL}/ride/status`,
            { rideId: p.rideId, status: 'completed' },
            { headers: { Authorization: `Bearer ${await token()}` } }
          );
          setStep('done');
          setTimeout(() => router.replace('/(tabs)/home'), 3000);
        } catch (e: any) { Alert.alert('Error', e?.response?.data?.message || 'Complete nahi hua'); }
        finally { setLoading(false); }
      }}
    ]);
  };

  const STEPS = ['pickup', 'otp', 'riding', 'done'];
  const stepIdx = STEPS.indexOf(step);
  const STEP_LABELS = ['Pickup Pe Jao', 'OTP Verify', 'Ride Chal Rahi', 'Complete!'];
  const STEP_COLORS: any = { pickup: '#9b59b6', otp: '#3498db', riding: '#F5A623', done: '#27ae60' };

  if (step === 'done') {
    return (
      <View style={styles.doneScreen}>
        <StatusBar style="light" />
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>Ride Complete!</Text>
        <Text style={styles.doneFare}>₹{p.fare}</Text>
        <Text style={styles.doneSub}>Kamai ho gayi! Home pe ja rahe hain...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header with progress */}
      <View style={[styles.header, { backgroundColor: STEP_COLORS[step] }]}>
        <Text style={styles.headerTitle}>{STEP_LABELS[stepIdx]}</Text>
        <View style={styles.progressBar}>
          {STEPS.slice(0, -1).map((_, i) => (
            <View key={i} style={[styles.progressSeg, i < stepIdx && styles.progressDone,
              { backgroundColor: i < stepIdx ? '#fff' : 'rgba(255,255,255,0.3)' }]} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>

        {/* Customer Card */}
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.cusAvatar}>
              <Text style={styles.cusAvatarTxt}>{(p.customerName || 'C').charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cusName}>{p.customerName || 'Customer'}</Text>
              <Text style={styles.cusPhone}>{p.customerPhone || 'N/A'}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}
              onPress={() => p.customerPhone && Linking.openURL(`tel:${p.customerPhone}`)}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: '#25D366', marginLeft: 8 }]}
              onPress={() => p.customerPhone && Linking.openURL(`https://wa.me/91${p.customerPhone}`)}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Card */}
        <View style={styles.card}>
          <Text style={styles.cardHead}>🗺️ ROUTE</Text>
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, { backgroundColor: '#27ae60' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTag}>PICKUP</Text>
              <Text style={styles.routeAddr}>{p.pickupAddress || '—'}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, { backgroundColor: '#e74c3c' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTag}>DROP</Text>
              <Text style={styles.routeAddr}>{p.dropAddress || '—'}</Text>
            </View>
          </View>
          <View style={styles.rideMetaRow}>
            <View style={styles.rideMeta}><Text style={styles.rideMetaVal}>📍 {parseFloat(p.distance || '0').toFixed(1)} km</Text></View>
            <View style={[styles.rideMeta, { borderColor: '#F5A623' }]}>
              <Text style={[styles.rideMetaVal, { color: '#F5A623', fontSize: 22, fontWeight: '900' }]}>₹{p.fare}</Text>
            </View>
          </View>
        </View>

        {/* OTP Card — only when at otp step */}
        {step === 'otp' && (
          <View style={styles.card}>
            <Text style={styles.cardHead}>🔐 OTP VERIFY KARO</Text>
            <Text style={styles.otpHint}>Customer se 4-6 digit OTP lo</Text>
            <View style={styles.otpRow}>
              <TextInput style={styles.otpInput} placeholder="OTP daalo" placeholderTextColor="#bbb"
                value={otpInput} onChangeText={setOtpInput}
                keyboardType="number-pad" maxLength={6} />
              <TouchableOpacity style={[styles.otpBtn, loading && { opacity: 0.6 }]}
                onPress={verifyOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.otpBtnTxt}>Verify</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomBar}>
        {step === 'pickup' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#9b59b6' }, loading && { opacity: 0.6 }]}
            onPress={() => updateStatus('arrived', 'otp')} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <>
              <Ionicons name="location" size={22} color="#fff" />
              <Text style={styles.actionBtnTxt}>Pickup Pe Pahunch Gaya</Text>
            </>}
          </TouchableOpacity>
        )}
        {step === 'otp' && (
          <View style={styles.otpHintBar}>
            <Ionicons name="lock-closed" size={18} color="#3498db" />
            <Text style={styles.otpHintBarTxt}>Upar OTP enter karke verify karo</Text>
          </View>
        )}
        {step === 'riding' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#27ae60' }, loading && { opacity: 0.6 }]}
            onPress={completeRide} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <>
              <Ionicons name="flag" size={22} color="#fff" />
              <Text style={styles.actionBtnTxt}>Ride Complete Karo</Text>
            </>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 14 },
  progressBar: { flexDirection: 'row', gap: 6 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2 },
  progressDone: { backgroundColor: '#fff' },

  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  cardHead: { fontSize: 11, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 14 },

  customerRow: { flexDirection: 'row', alignItems: 'center' },
  cusAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cusAvatarTxt: { color: '#fff', fontWeight: '900', fontSize: 22 },
  cusName: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
  cusPhone: { fontSize: 13, color: '#888', marginTop: 3 },
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#27ae60', justifyContent: 'center', alignItems: 'center' },

  routeItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 4 },
  routeTag: { fontSize: 10, fontWeight: '800', color: '#aaa', letterSpacing: 1 },
  routeAddr: { fontSize: 14, color: '#1a1a2e', fontWeight: '600', marginTop: 2, lineHeight: 20 },
  routeLine: { width: 1.5, height: 18, backgroundColor: '#eee', marginLeft: 5, marginVertical: 2 },
  rideMetaRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  rideMeta: { flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: '#eee', padding: 12, alignItems: 'center' },
  rideMetaVal: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },

  otpHint: { fontSize: 13, color: '#888', marginBottom: 14 },
  otpRow: { flexDirection: 'row', gap: 10 },
  otpInput: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 14, padding: 16, fontSize: 22, fontWeight: '900', color: '#1a1a2e', textAlign: 'center', letterSpacing: 8, borderWidth: 1.5, borderColor: '#eee' },
  otpBtn: { backgroundColor: '#3498db', borderRadius: 14, paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center' },
  otpBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderRadius: 18, padding: 18, elevation: 4 },
  actionBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 17 },
  otpHintBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, backgroundColor: '#eef6ff', borderRadius: 14 },
  otpHintBarTxt: { color: '#3498db', fontWeight: '700', fontSize: 14 },

  doneScreen: { flex: 1, backgroundColor: '#27ae60', justifyContent: 'center', alignItems: 'center' },
  doneEmoji: { fontSize: 100, marginBottom: 16 },
  doneTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 },
  doneFare: { fontSize: 56, fontWeight: '900', color: '#fff', marginBottom: 8 },
  doneSub: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },
});
