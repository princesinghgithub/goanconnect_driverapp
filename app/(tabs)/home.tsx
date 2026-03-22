// import { API_BASE_URL, SOCKET_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Haptics from 'expo-haptics';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert, Animated, Modal, RefreshControl,
//   ScrollView, StyleSheet, Text, TouchableOpacity,
//   Vibration, View,
// } from 'react-native';
// import { io } from 'socket.io-client';

// export default function DriverHomeScreen() {
//   const [user, setUser]         = useState<any>(null);
//   const [driver, setDriver]     = useState<any>(null);
//   const [isOnline, setIsOnline] = useState(false);
//   const [rideReq, setRideReq]   = useState<any>(null);
//   const [modalVisible, setModal]= useState(false);
//   const [stats, setStats]       = useState({ earnings: 0, rides: 0 });
//   const [reqTimer, setReqTimer] = useState(30);
//   const [refreshing, setRefresh]= useState(false);

//   const socketRef  = useRef<any>(null);
//   const pulseAnim  = useRef(new Animated.Value(1)).current;
//   const timerRef   = useRef<any>(null);
//   const pulseLoop  = useRef<any>(null);

//   useEffect(() => {
//     loadData();
//     return () => {
//       socketRef.current?.disconnect();
//       clearInterval(timerRef.current);
//       Vibration.cancel();
//       pulseLoop.current?.stop?.();
//     };
//   }, []);

//   const loadData = async () => {
//     const u = await AsyncStorage.getItem('driverUser');
//     const d = await AsyncStorage.getItem('driverData');
//     if (u) setUser(JSON.parse(u));
//     if (d) setDriver(JSON.parse(d));
//     fetchStats();
//   };

//   const fetchStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const res = await fetch(`${API_BASE_URL}/ride/history/driver`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       const done = (data?.data || []).filter((r: any) =>
//         r.status === 'completed' &&
//         new Date(r.createdAt).toDateString() === new Date().toDateString()
//       );
//       setStats({
//         earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0),
//         rides: done.length,
//       });
//     } catch {} finally { setRefresh(false); }
//   };

//   const startRing = () => {
//     Vibration.vibrate([500, 300, 500, 300, 500, 300, 500, 300], true);
//     try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
//   };
//   const stopRing = () => { Vibration.cancel(); };

//   const startPulse = () => {
//     pulseLoop.current = Animated.loop(Animated.sequence([
//       Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
//       Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
//     ]));
//     pulseLoop.current.start();
//   };
//   const stopPulse = () => { pulseLoop.current?.stop(); pulseAnim.setValue(1); };

//   const goOnline = async () => {
//     try {
//       const token      = await AsyncStorage.getItem('driverToken');
//       const userData   = await AsyncStorage.getItem('driverUser');
//       const driverData = await AsyncStorage.getItem('driverData');

//       if (!userData) { Alert.alert('Error', 'Login karo pehle'); return; }

//       const u = JSON.parse(userData);
//       const d = driverData ? JSON.parse(driverData) : null;

//       // ✅ Provider _id use karo — User _id nahi!
//       const providerId = d?._id || d?.id || u.id;

//       console.log('Going online — providerId:', providerId);
//       console.log('driverData:', JSON.stringify(d));

//       await fetch(`${API_BASE_URL}/provider/status`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isOnline: true, status: 'available' }),
//       });

//       const socket = io(SOCKET_URL, {
//         transports: ['websocket'],
//         query: { userId: u.id, role: 'driver' },
//       });

//       socket.on('connect', () => {
//         console.log('✅ Socket connected:', socket.id);
//         // ✅ Provider _id se driverOnline emit karo
//         socket.emit('driverOnline', { driverId: providerId });
//         console.log('📡 driverOnline emitted with:', providerId);
//       });

//       socket.on('newRideRequest', (req: any) => {
//         console.log('🔔 New ride request received!', req);
//         onNewRide(req);
//       });

//       socket.on('connect_error', (err) => {
//         console.log('Socket error:', err.message);
//         Alert.alert('Connection Error', 'Socket connect nahi hua');
//       });

//       socket.on('disconnect', () => console.log('Socket disconnected'));

//       socketRef.current = socket;
//       setIsOnline(true);
//       startPulse();
//     } catch (e: any) {
//       console.log('goOnline error:', e);
//       Alert.alert('Error', 'Online nahi ho sake');
//     }
//   };

//   const goOffline = async () => {
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       await fetch(`${API_BASE_URL}/provider/status`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isOnline: false, status: 'offline' }),
//       });
//     } catch {}
//     socketRef.current?.emit('driverOffline');
//     socketRef.current?.disconnect();
//     socketRef.current = null;
//     setIsOnline(false);
//     stopPulse();
//     clearInterval(timerRef.current);
//   };

//   const onNewRide = (req: any) => {
//     console.log('🔔 Showing ride modal:', req);
//     setRideReq(req);
//     setReqTimer(30);
//     setModal(true);
//     startRing();

//     clearInterval(timerRef.current);
//     let t = 30;
//     timerRef.current = setInterval(() => {
//       t -= 1;
//       setReqTimer(t);
//       if (t <= 0) {
//         clearInterval(timerRef.current);
//         setModal(false);
//         setRideReq(null);
//         stopRing();
//       }
//     }, 1000);
//   };

//   const acceptRide = async () => {
//     clearInterval(timerRef.current);
//     setModal(false);
//     stopRing();
//     try {
//       const token  = await AsyncStorage.getItem('driverToken');
//       const rideId = rideReq?.rideId || rideReq?._id;
//       const res    = await fetch(`${API_BASE_URL}/ride/accept`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ rideId }),
//       });
//       const data = await res.json();
//       if (data?.success) {
//         try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
//         router.push({
//           pathname: '/(ride)/active-ride',
//           params: {
//             rideId,
//             customerName:  rideReq?.customerName   || 'Customer',
//             customerPhone: rideReq?.customerPhone   || '',
//             pickupAddress: rideReq?.pickup?.address || '',
//             dropAddress:   rideReq?.drop?.address   || '',
//             fare:          String(rideReq?.fare      || 0),
//             distance:      String(rideReq?.distance  || 0),
//             otp:           data?.data?.otp           || '',
//           },
//         });
//       } else {
//         Alert.alert('Error', data?.message || 'Accept nahi hua');
//       }
//     } catch { Alert.alert('Error', 'Accept nahi hua'); }
//     setRideReq(null);
//   };

//   const rejectRide = async () => {
//     clearInterval(timerRef.current);
//     setModal(false);
//     stopRing();
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       await fetch(`${API_BASE_URL}/ride/reject`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ rideId: rideReq?.rideId || rideReq?._id }),
//       });
//     } catch {}
//     setRideReq(null);
//   };

//   const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
//   const vType = driver?.vehicle?.type   || '';
//   const vNum  = driver?.vehicle?.number || '';
//   const name  = user?.name || 'Driver';

//   return (
//     <ScrollView style={styles.container}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefresh(true); fetchStats(); }} colors={['#F5A623']} />}
//       contentContainerStyle={{ paddingBottom: 30 }}>
//       <StatusBar style="light" />

//       <View style={styles.header}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.greeting}>Namaste, {name}! 👋</Text>
//           <Text style={styles.vehicle}>{VEMOJI[vType] || '🚗'} {vType.toUpperCase()}{vNum ? ` • ${vNum}` : ''}</Text>
//         </View>
//         <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//           <View style={styles.avatar}><Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text></View>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.toggleCard}>
//         <Animated.View style={[styles.statusCircle, isOnline ? styles.circleOn : styles.circleOff, { transform: [{ scale: pulseAnim }] }]}>
//           <View style={[styles.statusDot, { backgroundColor: isOnline ? '#27ae60' : '#e74c3c' }]} />
//           <Text style={[styles.statusLbl, { color: isOnline ? '#27ae60' : '#e74c3c' }]}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
//         </Animated.View>
//         <Text style={styles.statusDesc}>{isOnline ? '✅ Ride requests aa sakti hain' : 'Online ho kar rides receive karo'}</Text>
//         <TouchableOpacity style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]} onPress={isOnline ? goOffline : goOnline}>
//           <Text style={styles.toggleBtnTxt}>{isOnline ? 'Offline Ho Jao' : 'Online Ho Jao'}</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statsRow}>
//         {[
//           { emoji: '💰', val: `₹${stats.earnings}`, lbl: 'Aaj Ki Kamai' },
//           { emoji: '🚗', val: `${stats.rides}`,      lbl: 'Aaj Ki Rides' },
//           { emoji: '⭐', val: driver?.rating?.average > 0 ? driver.rating.average.toFixed(1) : '—', lbl: 'Rating' },
//         ].map((s, i) => (
//           <View key={i} style={styles.statCard}>
//             <Text style={styles.statEmoji}>{s.emoji}</Text>
//             <Text style={styles.statVal}>{s.val}</Text>
//             <Text style={styles.statLbl}>{s.lbl}</Text>
//           </View>
//         ))}
//       </View>

//       {!isOnline ? (
//         <View style={styles.tipCard}>
//           <Text style={styles.tipTitle}>💡 Zyada Kamai Ke Tips</Text>
//           <Text style={styles.tipTxt}>• Subah 8-10 aur Shaam 5-8 baje online raho</Text>
//           <Text style={styles.tipTxt}>• Rides accept karte raho — acceptance rate badhao</Text>
//           <Text style={styles.tipTxt}>• Gaadi saaf rakho — 5 ⭐ rating pao</Text>
//         </View>
//       ) : (
//         <View style={styles.waitCard}>
//           <Text style={styles.waitEmoji}>📡</Text>
//           <Text style={styles.waitTitle}>Ride Request Ka Intezaar...</Text>
//           <Text style={styles.waitSub}>Jaise hi koi book kare, phone vibrate karega 📳</Text>
//         </View>
//       )}

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.overlay}>
//           <View style={styles.modal}>
//             <View style={styles.timerBg}>
//               <View style={[styles.timerFill, { width: `${(reqTimer / 30) * 100}%`, backgroundColor: reqTimer <= 10 ? '#e74c3c' : '#F5A623' }]} />
//             </View>
//             <View style={styles.modalTop}>
//               <View>
//                 <Text style={styles.modalTitle}>🔔 Naya Ride Request!</Text>
//                 <Text style={styles.modalCus}>{rideReq?.customerName || 'Customer'}</Text>
//               </View>
//               <View style={[styles.timerBadge, reqTimer <= 10 && { backgroundColor: '#e74c3c' }]}>
//                 <Text style={styles.timerTxt}>{reqTimer}s</Text>
//               </View>
//             </View>
//             <View style={styles.routeBox}>
//               <View style={styles.routeRow}>
//                 <View style={[styles.rDot, { backgroundColor: '#27ae60' }]} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.rTag}>PICKUP</Text>
//                   <Text style={styles.rAddr} numberOfLines={2}>{rideReq?.pickup?.address || '—'}</Text>
//                 </View>
//               </View>
//               <View style={styles.rLine} />
//               <View style={styles.routeRow}>
//                 <View style={[styles.rDot, { backgroundColor: '#e74c3c' }]} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.rTag}>DROP</Text>
//                   <Text style={styles.rAddr} numberOfLines={2}>{rideReq?.drop?.address || '—'}</Text>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.fareRow}>
//               <View style={styles.fareItem}>
//                 <Text style={styles.fareEmoji}>📍</Text>
//                 <Text style={styles.fareVal}>{Number(rideReq?.distance || 0).toFixed(1)} km</Text>
//               </View>
//               <View style={[styles.fareItem, styles.fareHL]}>
//                 <Text style={styles.fareEmoji}>💰</Text>
//                 <Text style={[styles.fareVal, { color: '#F5A623', fontSize: 22, fontWeight: '900' }]}>₹{rideReq?.fare || 0}</Text>
//               </View>
//               <View style={styles.fareItem}>
//                 <Text style={styles.fareEmoji}>💳</Text>
//                 <Text style={styles.fareVal}>{rideReq?.paymentMethod === 'online' ? 'Online' : 'Cash'}</Text>
//               </View>
//             </View>
//             <View style={styles.modalBtns}>
//               <TouchableOpacity style={styles.rejectBtn} onPress={rejectRide}>
//                 <Ionicons name="close-circle" size={22} color="#e74c3c" />
//                 <Text style={styles.rejectTxt}>Reject</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.acceptBtn} onPress={acceptRide}>
//                 <Ionicons name="checkmark-circle" size={22} color="#fff" />
//                 <Text style={styles.acceptTxt}>Accept Karo</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f0f4f8' },
//   header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
//   greeting: { fontSize: 18, fontWeight: '800', color: '#fff' },
//   vehicle: { fontSize: 13, color: '#adc6e0', marginTop: 3 },
//   avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
//   avatarTxt: { color: '#fff', fontWeight: '900', fontSize: 20 },
//   toggleCard: { backgroundColor: '#fff', margin: 16, borderRadius: 24, padding: 24, alignItems: 'center', elevation: 3 },
//   statusCircle: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
//   circleOn:  { backgroundColor: '#eafaf1', borderWidth: 3, borderColor: '#27ae60' },
//   circleOff: { backgroundColor: '#fef9e7', borderWidth: 3, borderColor: '#e74c3c' },
//   statusDot: { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
//   statusLbl: { fontSize: 14, fontWeight: '900', letterSpacing: 1 },
//   statusDesc: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 18, lineHeight: 20 },
//   toggleBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 36 },
//   onBtn: { backgroundColor: '#27ae60' },
//   offBtn: { backgroundColor: '#e74c3c' },
//   toggleBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
//   statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
//   statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, alignItems: 'center', elevation: 2 },
//   statEmoji: { fontSize: 26, marginBottom: 6 },
//   statVal: { fontSize: 20, fontWeight: '900', color: '#1a1a2e' },
//   statLbl: { fontSize: 10, color: '#aaa', marginTop: 3, textAlign: 'center' },
//   tipCard: { backgroundColor: '#fff8ee', marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#ffe0a0' },
//   tipTitle: { fontSize: 14, fontWeight: '800', color: '#F5A623', marginBottom: 10 },
//   tipTxt: { fontSize: 13, color: '#666', marginBottom: 5, lineHeight: 20 },
//   waitCard: { backgroundColor: '#eef6ff', marginHorizontal: 16, borderRadius: 18, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#c5deff' },
//   waitEmoji: { fontSize: 48, marginBottom: 12 },
//   waitTitle: { fontSize: 16, fontWeight: '800', color: '#1a3a5c', marginBottom: 6 },
//   waitSub: { fontSize: 13, color: '#7a9bc4', textAlign: 'center' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
//   modal: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 36, overflow: 'hidden' },
//   timerBg: { height: 6, backgroundColor: '#f0f0f0' },
//   timerFill: { height: 6 },
//   modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
//   modalTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a2e' },
//   modalCus: { fontSize: 13, color: '#888', marginTop: 3 },
//   timerBadge: { backgroundColor: '#F5A623', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
//   timerTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },
//   routeBox: { backgroundColor: '#f8fafc', marginHorizontal: 16, borderRadius: 16, padding: 14, marginBottom: 14 },
//   routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5 },
//   rDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 3 },
//   rTag: { fontSize: 10, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 2 },
//   rAddr: { fontSize: 14, color: '#1a1a2e', fontWeight: '600', lineHeight: 20 },
//   rLine: { width: 1.5, height: 16, backgroundColor: '#ddd', marginLeft: 5, marginVertical: 2 },
//   fareRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, gap: 8 },
//   fareItem: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, padding: 12, alignItems: 'center' },
//   fareHL: { backgroundColor: '#fff8ee', borderWidth: 1.5, borderColor: '#F5A623' },
//   fareEmoji: { fontSize: 20, marginBottom: 4 },
//   fareVal: { fontSize: 15, fontWeight: '800', color: '#1a1a2e' },
//   modalBtns: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
//   rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, padding: 16, borderWidth: 2, borderColor: '#e74c3c' },
//   rejectTxt: { color: '#e74c3c', fontWeight: '800', fontSize: 16 },
//   acceptBtn: { flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, padding: 16, backgroundColor: '#27ae60', elevation: 3 },
//   acceptTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
// });

// import { API_BASE_URL, SOCKET_URL } from "@/constants/config";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Haptics from "expo-haptics";
// import { router } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Animated,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Vibration,
//   View,
// } from "react-native";
// import { io } from "socket.io-client";

// export default function DriverHomeScreen() {
//   const [user, setUser] = useState<any>(null);
//   const [driver, setDriver] = useState<any>(null);
//   const [isOnline, setIsOnline] = useState(false);
//   const [rideReq, setRideReq] = useState<any>(null);
//   const [modalVisible, setModal] = useState(false);
//   const [stats, setStats] = useState({ earnings: 0, rides: 0 });
//   const [reqTimer, setReqTimer] = useState(30);
//   const [refreshing, setRefresh] = useState(false);

//   const socketRef = useRef<any>(null);
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const timerRef = useRef<any>(null);
//   const pulseLoop = useRef<any>(null);
//   // ✅ Yeh flag — ride accept hone ke baad duplicate actions rokta hai
//   const isNavigating = useRef(false);

//   useEffect(() => {
//     loadData();
//     return () => {
//       socketRef.current?.disconnect();
//       clearInterval(timerRef.current);
//       Vibration.cancel();
//       pulseLoop.current?.stop?.();
//     };
//   }, []);

//   const loadData = async () => {
//     const u = await AsyncStorage.getItem("driverUser");
//     const d = await AsyncStorage.getItem("driverData");
//     if (u) setUser(JSON.parse(u));
//     if (d) setDriver(JSON.parse(d));
//     fetchStats();
//   };

//   const fetchStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem("driverToken");
//       const res = await fetch(`${API_BASE_URL}/ride/history/driver`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       const done = (data?.data || []).filter(
//         (r: any) =>
//           r.status === "completed" &&
//           new Date(r.createdAt).toDateString() === new Date().toDateString(),
//       );
//       setStats({
//         earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0),
//         rides: done.length,
//       });
//     } catch {
//     } finally {
//       setRefresh(false);
//     }
//   };

//   const startRing = () => {
//     Vibration.vibrate([500, 300, 500, 300, 500, 300], true);
//     try {
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
//     } catch {}
//   };
//   const stopRing = () => {
//     Vibration.cancel();
//   };

//   const startPulse = () => {
//     pulseLoop.current = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.2,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1.0,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ]),
//     );
//     pulseLoop.current.start();
//   };
//   const stopPulse = () => {
//     pulseLoop.current?.stop();
//     pulseAnim.setValue(1);
//   };

//   const goOnline = async () => {
//     // ✅ Agar pehle se online hai toh dobara connect mat karo
//     if (isOnline || socketRef.current?.connected) return;

//     try {
//       const token = await AsyncStorage.getItem("driverToken");
//       const userData = await AsyncStorage.getItem("driverUser");
//       const driverData = await AsyncStorage.getItem("driverData");

//       if (!userData) {
//         Alert.alert("Error", "Login karo pehle");
//         return;
//       }

//       const u = JSON.parse(userData);
//       const d = driverData ? JSON.parse(driverData) : null;
//       const providerId = d?._id || d?.id || u.id;

//       await fetch(`${API_BASE_URL}/provider/status`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isOnline: true, status: "available" }),
//       });

//       const socket = io(SOCKET_URL, {
//         transports: ["websocket"],
//         query: { userId: u.id, role: "driver" },
//         reconnection: true,
//         reconnectionAttempts: 3,
//       });

//       socket.on("connect", () => {
//         console.log("✅ Socket connected:", socket.id);
//         socket.emit("driverOnline", { driverId: providerId });
//       });

//       socket.on("newRideRequest", (req: any) => {
//         // ✅ Agar navigate ho raha hai toh naya request mat dikhao
//         if (isNavigating.current) return;
//         console.log("🔔 New ride request:", req);
//         onNewRide(req);
//       });

//       socket.on("connect_error", (err) => {
//         console.log("Socket error:", err.message);
//       });

//       socketRef.current = socket;
//       setIsOnline(true);
//       startPulse();
//     } catch (e: any) {
//       Alert.alert("Error", "Online nahi ho sake");
//     }
//   };

//   const goOffline = async () => {
//     try {
//       const token = await AsyncStorage.getItem("driverToken");
//       await fetch(`${API_BASE_URL}/provider/status`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isOnline: false, status: "offline" }),
//       });
//     } catch {}
//     socketRef.current?.emit("driverOffline");
//     socketRef.current?.disconnect();
//     socketRef.current = null;
//     setIsOnline(false);
//     stopPulse();
//     clearInterval(timerRef.current);
//   };

//   const onNewRide = useCallback((req: any) => {
//     if (isNavigating.current) return;
//     setRideReq(req);
//     setReqTimer(30);
//     setModal(true);
//     startRing();

//     clearInterval(timerRef.current);
//     let t = 30;
//     timerRef.current = setInterval(() => {
//       t -= 1;
//       setReqTimer(t);
//       if (t <= 0) {
//         clearInterval(timerRef.current);
//         setModal(false);
//         setRideReq(null);
//         stopRing();
//       }
//     }, 1000);
//   }, []);

//   const acceptRide = async () => {
//     // ✅ Double tap se bachao
//     if (isNavigating.current) return;
//     isNavigating.current = true;

//     clearInterval(timerRef.current);
//     setModal(false);
//     stopRing();

//     try {
//       const token = await AsyncStorage.getItem("driverToken");
//       const rideId = rideReq?.rideId || rideReq?._id;
//       const res = await fetch(`${API_BASE_URL}/ride/accept`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ rideId }),
//       });
//       const data = await res.json();

//       if (data?.success) {
//         try {
//           Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         } catch {}

//         // ✅ Socket se newRideRequest events band karo — zigzag rokne ke liye
//         socketRef.current?.off("newRideRequest");

//         router.replace({
//           pathname: "/(ride)/active-ride",
//           params: {
//             rideId,
//             customerName: rideReq?.customerName || "Customer",
//             customerPhone: rideReq?.customerPhone || "",
//             pickupAddress: rideReq?.pickup?.address || "",
//             dropAddress: rideReq?.drop?.address || "",
//             fare: String(rideReq?.fare || 0),
//             distance: String(rideReq?.distance || 0),
//             otp: data?.data?.otp || "",
//           },
//         });
//       } else {
//         Alert.alert("Error", data?.message || "Accept nahi hua");
//         isNavigating.current = false;
//       }
//     } catch {
//       Alert.alert("Error", "Accept nahi hua");
//       isNavigating.current = false;
//     }
//     setRideReq(null);
//   };

//   const rejectRide = async () => {
//     clearInterval(timerRef.current);
//     setModal(false);
//     stopRing();
//     try {
//       const token = await AsyncStorage.getItem("driverToken");
//       await fetch(`${API_BASE_URL}/ride/reject`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ rideId: rideReq?.rideId || rideReq?._id }),
//       });
//     } catch {}
//     setRideReq(null);
//   };

//   const VEMOJI: any = {
//     bike: "🏍️",
//     auto: "🛺",
//     car: "🚗",
//     tractor: "🚜",
//     tempo: "🚐",
//     truck: "🚛",
//     jcb: "🚧",
//   };
//   const vType = driver?.vehicle?.type || "";
//   const vNum = driver?.vehicle?.number || "";
//   const name = user?.name || "Driver";

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={() => {
//             setRefresh(true);
//             fetchStats();
//           }}
//           colors={["#F5A623"]}
//         />
//       }
//       contentContainerStyle={{ paddingBottom: 30 }}
//     >
//       <StatusBar style="light" />

//       <View style={styles.header}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.greeting}>Namaste, {name}! 👋</Text>
//           <Text style={styles.vehicle}>
//             {VEMOJI[vType] || "🚗"} {vType.toUpperCase()}
//             {vNum ? ` • ${vNum}` : ""}
//           </Text>
//         </View>
//         <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.toggleCard}>
//         <Animated.View
//           style={[
//             styles.statusCircle,
//             isOnline ? styles.circleOn : styles.circleOff,
//             { transform: [{ scale: pulseAnim }] },
//           ]}
//         >
//           <View
//             style={[
//               styles.statusDot,
//               { backgroundColor: isOnline ? "#27ae60" : "#e74c3c" },
//             ]}
//           />
//           <Text
//             style={[
//               styles.statusLbl,
//               { color: isOnline ? "#27ae60" : "#e74c3c" },
//             ]}
//           >
//             {isOnline ? "ONLINE" : "OFFLINE"}
//           </Text>
//         </Animated.View>
//         <Text style={styles.statusDesc}>
//           {isOnline
//             ? "✅ Ride requests aa sakti hain"
//             : "Online ho kar rides receive karo"}
//         </Text>
//         <TouchableOpacity
//           style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]}
//           onPress={isOnline ? goOffline : goOnline}
//         >
//           <Text style={styles.toggleBtnTxt}>
//             {isOnline ? "Offline Ho Jao" : "Online Ho Jao"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statsRow}>
//         {[
//           { emoji: "💰", val: `₹${stats.earnings}`, lbl: "Aaj Ki Kamai" },
//           { emoji: "🚗", val: `${stats.rides}`, lbl: "Aaj Ki Rides" },
//           {
//             emoji: "⭐",
//             val:
//               driver?.rating?.average > 0
//                 ? driver.rating.average.toFixed(1)
//                 : "—",
//             lbl: "Rating",
//           },
//         ].map((s, i) => (
//           <View key={i} style={styles.statCard}>
//             <Text style={styles.statEmoji}>{s.emoji}</Text>
//             <Text style={styles.statVal}>{s.val}</Text>
//             <Text style={styles.statLbl}>{s.lbl}</Text>
//           </View>
//         ))}
//       </View>

//       {!isOnline ? (
//         <View style={styles.tipCard}>
//           <Text style={styles.tipTitle}>💡 Zyada Kamai Ke Tips</Text>
//           <Text style={styles.tipTxt}>
//             • Subah 8-10 aur Shaam 5-8 baje online raho
//           </Text>
//           <Text style={styles.tipTxt}>
//             • Rides accept karte raho — acceptance rate badhao
//           </Text>
//           <Text style={styles.tipTxt}>
//             • Gaadi saaf rakho — 5 ⭐ rating pao
//           </Text>
//         </View>
//       ) : (
//         <View style={styles.waitCard}>
//           <Text style={styles.waitEmoji}>📡</Text>
//           <Text style={styles.waitTitle}>Ride Request Ka Intezaar...</Text>
//           <Text style={styles.waitSub}>
//             Jaise hi koi book kare, phone vibrate karega 📳
//           </Text>
//         </View>
//       )}

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.overlay}>
//           <View style={styles.modal}>
//             <View style={styles.timerBg}>
//               <View
//                 style={[
//                   styles.timerFill,
//                   {
//                     width: `${(reqTimer / 30) * 100}%`,
//                     backgroundColor: reqTimer <= 10 ? "#e74c3c" : "#F5A623",
//                   },
//                 ]}
//               />
//             </View>
//             <View style={styles.modalTop}>
//               <View>
//                 <Text style={styles.modalTitle}>🔔 Naya Ride Request!</Text>
//                 <Text style={styles.modalCus}>
//                   {rideReq?.customerName || "Customer"}
//                 </Text>
//               </View>
//               <View
//                 style={[
//                   styles.timerBadge,
//                   reqTimer <= 10 && { backgroundColor: "#e74c3c" },
//                 ]}
//               >
//                 <Text style={styles.timerTxt}>{reqTimer}s</Text>
//               </View>
//             </View>
//             <View style={styles.routeBox}>
//               <View style={styles.routeRow}>
//                 <View style={[styles.rDot, { backgroundColor: "#27ae60" }]} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.rTag}>PICKUP</Text>
//                   <Text style={styles.rAddr} numberOfLines={2}>
//                     {rideReq?.pickup?.address || "—"}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.rLine} />
//               <View style={styles.routeRow}>
//                 <View style={[styles.rDot, { backgroundColor: "#e74c3c" }]} />
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.rTag}>DROP</Text>
//                   <Text style={styles.rAddr} numberOfLines={2}>
//                     {rideReq?.drop?.address || "—"}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.fareRow}>
//               <View style={styles.fareItem}>
//                 <Text style={styles.fareEmoji}>📍</Text>
//                 <Text style={styles.fareVal}>
//                   {Number(rideReq?.distance || 0).toFixed(1)} km
//                 </Text>
//               </View>
//               <View style={[styles.fareItem, styles.fareHL]}>
//                 <Text style={styles.fareEmoji}>💰</Text>
//                 <Text
//                   style={[
//                     styles.fareVal,
//                     { color: "#F5A623", fontSize: 22, fontWeight: "900" },
//                   ]}
//                 >
//                   ₹{rideReq?.fare || 0}
//                 </Text>
//               </View>
//               <View style={styles.fareItem}>
//                 <Text style={styles.fareEmoji}>💳</Text>
//                 <Text style={styles.fareVal}>
//                   {rideReq?.paymentMethod === "online" ? "Online" : "Cash"}
//                 </Text>
//               </View>
//             </View>
//             <View style={styles.modalBtns}>
//               <TouchableOpacity style={styles.rejectBtn} onPress={rejectRide}>
//                 <Ionicons name="close-circle" size={22} color="#e74c3c" />
//                 <Text style={styles.rejectTxt}>Reject</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.acceptBtn} onPress={acceptRide}>
//                 <Ionicons name="checkmark-circle" size={22} color="#fff" />
//                 <Text style={styles.acceptTxt}>Accept Karo</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f0f4f8" },
//   header: {
//     backgroundColor: "#1a3a5c",
//     paddingTop: 55,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   greeting: { fontSize: 18, fontWeight: "800", color: "#fff" },
//   vehicle: { fontSize: 13, color: "#adc6e0", marginTop: 3 },
//   avatar: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: "#F5A623",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   avatarTxt: { color: "#fff", fontWeight: "900", fontSize: 20 },
//   toggleCard: {
//     backgroundColor: "#fff",
//     margin: 16,
//     borderRadius: 24,
//     padding: 24,
//     alignItems: "center",
//     elevation: 3,
//   },
//   statusCircle: {
//     width: 130,
//     height: 130,
//     borderRadius: 65,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   circleOn: {
//     backgroundColor: "#eafaf1",
//     borderWidth: 3,
//     borderColor: "#27ae60",
//   },
//   circleOff: {
//     backgroundColor: "#fef9e7",
//     borderWidth: 3,
//     borderColor: "#e74c3c",
//   },
//   statusDot: { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
//   statusLbl: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
//   statusDesc: {
//     fontSize: 13,
//     color: "#888",
//     textAlign: "center",
//     marginBottom: 18,
//     lineHeight: 20,
//   },
//   toggleBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 20,
//     paddingVertical: 14,
//     paddingHorizontal: 36,
//   },
//   onBtn: { backgroundColor: "#27ae60" },
//   offBtn: { backgroundColor: "#e74c3c" },
//   toggleBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
//   statsRow: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     gap: 10,
//     marginBottom: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     padding: 14,
//     alignItems: "center",
//     elevation: 2,
//   },
//   statEmoji: { fontSize: 26, marginBottom: 6 },
//   statVal: { fontSize: 20, fontWeight: "900", color: "#1a1a2e" },
//   statLbl: { fontSize: 10, color: "#aaa", marginTop: 3, textAlign: "center" },
//   tipCard: {
//     backgroundColor: "#fff8ee",
//     marginHorizontal: 16,
//     borderRadius: 18,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#ffe0a0",
//   },
//   tipTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#F5A623",
//     marginBottom: 10,
//   },
//   tipTxt: { fontSize: 13, color: "#666", marginBottom: 5, lineHeight: 20 },
//   waitCard: {
//     backgroundColor: "#eef6ff",
//     marginHorizontal: 16,
//     borderRadius: 18,
//     padding: 28,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#c5deff",
//   },
//   waitEmoji: { fontSize: 48, marginBottom: 12 },
//   waitTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#1a3a5c",
//     marginBottom: 6,
//   },
//   waitSub: { fontSize: 13, color: "#7a9bc4", textAlign: "center" },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.65)",
//     justifyContent: "flex-end",
//   },
//   modal: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     paddingBottom: 36,
//     overflow: "hidden",
//   },
//   timerBg: { height: 6, backgroundColor: "#f0f0f0" },
//   timerFill: { height: 6 },
//   modalTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//     paddingBottom: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "900", color: "#1a1a2e" },
//   modalCus: { fontSize: 13, color: "#888", marginTop: 3 },
//   timerBadge: {
//     backgroundColor: "#F5A623",
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//   },
//   timerTxt: { color: "#fff", fontWeight: "900", fontSize: 16 },
//   routeBox: {
//     backgroundColor: "#f8fafc",
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 14,
//   },
//   routeRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingVertical: 5,
//   },
//   rDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 12,
//     marginTop: 3,
//   },
//   rTag: {
//     fontSize: 10,
//     fontWeight: "800",
//     color: "#aaa",
//     letterSpacing: 1,
//     marginBottom: 2,
//   },
//   rAddr: { fontSize: 14, color: "#1a1a2e", fontWeight: "600", lineHeight: 20 },
//   rLine: {
//     width: 1.5,
//     height: 16,
//     backgroundColor: "#ddd",
//     marginLeft: 5,
//     marginVertical: 2,
//   },
//   fareRow: {
//     flexDirection: "row",
//     marginHorizontal: 16,
//     marginBottom: 20,
//     gap: 8,
//   },
//   fareItem: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//     borderRadius: 14,
//     padding: 12,
//     alignItems: "center",
//   },
//   fareHL: {
//     backgroundColor: "#fff8ee",
//     borderWidth: 1.5,
//     borderColor: "#F5A623",
//   },
//   fareEmoji: { fontSize: 20, marginBottom: 4 },
//   fareVal: { fontSize: 15, fontWeight: "800", color: "#1a1a2e" },
//   modalBtns: { flexDirection: "row", gap: 12, paddingHorizontal: 16 },
//   rejectBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     borderRadius: 18,
//     padding: 16,
//     borderWidth: 2,
//     borderColor: "#e74c3c",
//   },
//   rejectTxt: { color: "#e74c3c", fontWeight: "800", fontSize: 16 },
//   acceptBtn: {
//     flex: 1.6,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     borderRadius: 18,
//     padding: 16,
//     backgroundColor: "#27ae60",
//     elevation: 3,
//   },
//   acceptTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
// });

import { API_BASE_URL, SOCKET_URL } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { io } from "socket.io-client";

export default function DriverHomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [rideReq, setRideReq] = useState<any>(null);
  const [modalVisible, setModal] = useState(false);
  const [stats, setStats] = useState({ earnings: 0, rides: 0 });
  const [reqTimer, setReqTimer] = useState(30);
  const [refreshing, setRefresh] = useState(false);

  const socketRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);
  const pulseLoop = useRef<any>(null);
  const isNavigating = useRef(false);
  const soundRef = useRef<any>(null); // ✅ Sound ref

  useEffect(() => {
    loadData();
    return () => {
      socketRef.current?.disconnect();
      clearInterval(timerRef.current);
      Vibration.cancel();
      pulseLoop.current?.stop?.();
      // ✅ Cleanup sound
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadData = async () => {
    const u = await AsyncStorage.getItem("driverUser");
    const d = await AsyncStorage.getItem("driverData");
    if (u) setUser(JSON.parse(u));
    if (d) setDriver(JSON.parse(d));
    fetchStats();
  };

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem("driverToken");
      const res = await fetch(`${API_BASE_URL}/ride/history/driver`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const done = (data?.data || []).filter(
        (r: any) =>
          r.status === "completed" &&
          new Date(r.createdAt).toDateString() === new Date().toDateString(),
      );
      setStats({
        earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0),
        rides: done.length,
      });
    } catch {
    } finally {
      setRefresh(false);
    }
  };

  // ✅ Ring START — vibration + sound dono
  const startRing = async () => {
    Vibration.vibrate([500, 300, 500, 300, 500, 300], true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/ring.wav"),
        { isLooping: true, volume: 1.0 },
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.log("Sound error:", e);
    }
  };

  // ✅ Ring STOP — vibration + sound dono band
  const stopRing = async () => {
    Vibration.cancel();
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch {}
  };

  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.current.start();
  };

  const stopPulse = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const goOnline = async () => {
    if (isOnline || socketRef.current?.connected) return;
    try {
      const token = await AsyncStorage.getItem("driverToken");
      const userData = await AsyncStorage.getItem("driverUser");
      const driverData = await AsyncStorage.getItem("driverData");

      if (!userData) {
        Alert.alert("Error", "Login karo pehle");
        return;
      }

      const u = JSON.parse(userData);
      const d = driverData ? JSON.parse(driverData) : null;
      const providerId = d?._id || d?.id || u.id;

      await fetch(`${API_BASE_URL}/provider/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isOnline: true, status: "available" }),
      });

      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        query: { userId: u.id, role: "driver" },
        reconnection: true,
        reconnectionAttempts: 3,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
        socket.emit("driverOnline", { driverId: providerId });
      });

      socket.on("newRideRequest", (req: any) => {
        if (isNavigating.current) return;
        console.log("🔔 New ride request:", req);
        onNewRide(req);
      });

      socket.on("connect_error", (err) => {
        console.log("Socket error:", err.message);
      });

      socketRef.current = socket;
      setIsOnline(true);
      startPulse();
    } catch {
      Alert.alert("Error", "Online nahi ho sake");
    }
  };

  const goOffline = async () => {
    try {
      const token = await AsyncStorage.getItem("driverToken");
      await fetch(`${API_BASE_URL}/provider/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isOnline: false, status: "offline" }),
      });
    } catch {}
    socketRef.current?.emit("driverOffline");
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsOnline(false);
    stopPulse();
    clearInterval(timerRef.current);
  };

  const onNewRide = useCallback((req: any) => {
    if (isNavigating.current) return;
    setRideReq(req);
    setReqTimer(30);
    setModal(true);
    startRing(); // ✅ Sound + vibration

    clearInterval(timerRef.current);
    let t = 30;
    timerRef.current = setInterval(() => {
      t -= 1;
      setReqTimer(t);
      if (t <= 0) {
        clearInterval(timerRef.current);
        setModal(false);
        setRideReq(null);
        stopRing(); // ✅ Band karo
      }
    }, 1000);
  }, []);

  const acceptRide = async () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    clearInterval(timerRef.current);
    setModal(false);
    stopRing(); // ✅ Band karo

    try {
      const token = await AsyncStorage.getItem("driverToken");
      const rideId = rideReq?.rideId || rideReq?._id;
      const res = await fetch(`${API_BASE_URL}/ride/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();

      if (data?.success) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        socketRef.current?.off("newRideRequest");
        router.replace({
          pathname: "/(ride)/active-ride",
          params: {
            rideId,
            customerName: rideReq?.customerName || "Customer",
            customerPhone: rideReq?.customerPhone || "",
            pickupAddress: rideReq?.pickup?.address || "",
            dropAddress: rideReq?.drop?.address || "",
            fare: String(rideReq?.fare || 0),
            distance: String(rideReq?.distance || 0),
            otp: data?.data?.otp || "",
          },
        });
      } else {
        Alert.alert("Error", data?.message || "Accept nahi hua");
        isNavigating.current = false;
      }
    } catch {
      Alert.alert("Error", "Accept nahi hua");
      isNavigating.current = false;
    }
    setRideReq(null);
  };

  const rejectRide = async () => {
    clearInterval(timerRef.current);
    setModal(false);
    stopRing(); // ✅ Band karo
    try {
      const token = await AsyncStorage.getItem("driverToken");
      await fetch(`${API_BASE_URL}/ride/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rideId: rideReq?.rideId || rideReq?._id }),
      });
    } catch {}
    setRideReq(null);
  };

  const VEMOJI: any = {
    bike: "🏍️",
    auto: "🛺",
    car: "🚗",
    tractor: "🚜",
    tempo: "🚐",
    truck: "🚛",
    jcb: "🚧",
  };
  const vType = driver?.vehicle?.type || "";
  const vNum = driver?.vehicle?.number || "";
  const name = user?.name || "Driver";

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefresh(true);
            fetchStats();
          }}
          colors={["#F5A623"]}
        />
      }
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Namaste, {name}! 👋</Text>
          <Text style={styles.vehicle}>
            {VEMOJI[vType] || "🚗"} {vType.toUpperCase()}
            {vNum ? ` • ${vNum}` : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleCard}>
        <Animated.View
          style={[
            styles.statusCircle,
            isOnline ? styles.circleOn : styles.circleOff,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOnline ? "#27ae60" : "#e74c3c" },
            ]}
          />
          <Text
            style={[
              styles.statusLbl,
              { color: isOnline ? "#27ae60" : "#e74c3c" },
            ]}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </Text>
        </Animated.View>
        <Text style={styles.statusDesc}>
          {isOnline
            ? "✅ Ride requests aa sakti hain"
            : "Online ho kar rides receive karo"}
        </Text>
        <TouchableOpacity
          style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]}
          onPress={isOnline ? goOffline : goOnline}
        >
          <Text style={styles.toggleBtnTxt}>
            {isOnline ? "Offline Ho Jao" : "Online Ho Jao"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { emoji: "💰", val: `₹${stats.earnings}`, lbl: "Aaj Ki Kamai" },
          { emoji: "🚗", val: `${stats.rides}`, lbl: "Aaj Ki Rides" },
          {
            emoji: "⭐",
            val:
              driver?.rating?.average > 0
                ? driver.rating.average.toFixed(1)
                : "—",
            lbl: "Rating",
          },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLbl}>{s.lbl}</Text>
          </View>
        ))}
      </View>

      {!isOnline ? (
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Zyada Kamai Ke Tips</Text>
          <Text style={styles.tipTxt}>
            • Subah 8-10 aur Shaam 5-8 baje online raho
          </Text>
          <Text style={styles.tipTxt}>
            • Rides accept karte raho — acceptance rate badhao
          </Text>
          <Text style={styles.tipTxt}>
            • Gaadi saaf rakho — 5 ⭐ rating pao
          </Text>
        </View>
      ) : (
        <View style={styles.waitCard}>
          <Text style={styles.waitEmoji}>📡</Text>
          <Text style={styles.waitTitle}>Ride Request Ka Intezaar...</Text>
          <Text style={styles.waitSub}>
            Jaise hi koi book kare, phone ring karega 🔔
          </Text>
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.timerBg}>
              <View
                style={[
                  styles.timerFill,
                  {
                    width: `${(reqTimer / 30) * 100}%`,
                    backgroundColor: reqTimer <= 10 ? "#e74c3c" : "#F5A623",
                  },
                ]}
              />
            </View>
            <View style={styles.modalTop}>
              <View>
                <Text style={styles.modalTitle}>🔔 Naya Ride Request!</Text>
                <Text style={styles.modalCus}>
                  {rideReq?.customerName || "Customer"}
                </Text>
              </View>
              <View
                style={[
                  styles.timerBadge,
                  reqTimer <= 10 && { backgroundColor: "#e74c3c" },
                ]}
              >
                <Text style={styles.timerTxt}>{reqTimer}s</Text>
              </View>
            </View>
            <View style={styles.routeBox}>
              <View style={styles.routeRow}>
                <View style={[styles.rDot, { backgroundColor: "#27ae60" }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rTag}>PICKUP</Text>
                  <Text style={styles.rAddr} numberOfLines={2}>
                    {rideReq?.pickup?.address || "—"}
                  </Text>
                </View>
              </View>
              <View style={styles.rLine} />
              <View style={styles.routeRow}>
                <View style={[styles.rDot, { backgroundColor: "#e74c3c" }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rTag}>DROP</Text>
                  <Text style={styles.rAddr} numberOfLines={2}>
                    {rideReq?.drop?.address || "—"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.fareRow}>
              <View style={styles.fareItem}>
                <Text style={styles.fareEmoji}>📍</Text>
                <Text style={styles.fareVal}>
                  {Number(rideReq?.distance || 0).toFixed(1)} km
                </Text>
              </View>
              <View style={[styles.fareItem, styles.fareHL]}>
                <Text style={styles.fareEmoji}>💰</Text>
                <Text
                  style={[
                    styles.fareVal,
                    { color: "#F5A623", fontSize: 22, fontWeight: "900" },
                  ]}
                >
                  ₹{rideReq?.fare || 0}
                </Text>
              </View>
              <View style={styles.fareItem}>
                <Text style={styles.fareEmoji}>💳</Text>
                <Text style={styles.fareVal}>
                  {rideReq?.paymentMethod === "online" ? "Online" : "Cash"}
                </Text>
              </View>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.rejectBtn} onPress={rejectRide}>
                <Ionicons name="close-circle" size={22} color="#e74c3c" />
                <Text style={styles.rejectTxt}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={acceptRide}>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.acceptTxt}>Accept Karo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  header: {
    backgroundColor: "#1a3a5c",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: { fontSize: 18, fontWeight: "800", color: "#fff" },
  vehicle: { fontSize: 13, color: "#adc6e0", marginTop: 3 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F5A623",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarTxt: { color: "#fff", fontWeight: "900", fontSize: 20 },
  toggleCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 3,
  },
  statusCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  circleOn: {
    backgroundColor: "#eafaf1",
    borderWidth: 3,
    borderColor: "#27ae60",
  },
  circleOff: {
    backgroundColor: "#fef9e7",
    borderWidth: 3,
    borderColor: "#e74c3c",
  },
  statusDot: { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
  statusLbl: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
  statusDesc: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  onBtn: { backgroundColor: "#27ae60" },
  offBtn: { backgroundColor: "#e74c3c" },
  toggleBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    elevation: 2,
  },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statVal: { fontSize: 20, fontWeight: "900", color: "#1a1a2e" },
  statLbl: { fontSize: 10, color: "#aaa", marginTop: 3, textAlign: "center" },
  tipCard: {
    backgroundColor: "#fff8ee",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffe0a0",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F5A623",
    marginBottom: 10,
  },
  tipTxt: { fontSize: 13, color: "#666", marginBottom: 5, lineHeight: 20 },
  waitCard: {
    backgroundColor: "#eef6ff",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c5deff",
  },
  waitEmoji: { fontSize: 48, marginBottom: 12 },
  waitTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a3a5c",
    marginBottom: 6,
  },
  waitSub: { fontSize: 13, color: "#7a9bc4", textAlign: "center" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 36,
    overflow: "hidden",
  },
  timerBg: { height: 6, backgroundColor: "#f0f0f0" },
  timerFill: { height: 6 },
  modalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", color: "#1a1a2e" },
  modalCus: { fontSize: 13, color: "#888", marginTop: 3 },
  timerBadge: {
    backgroundColor: "#F5A623",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  timerTxt: { color: "#fff", fontWeight: "900", fontSize: 16 },
  routeBox: {
    backgroundColor: "#f8fafc",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  rDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 3,
  },
  rTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#aaa",
    letterSpacing: 1,
    marginBottom: 2,
  },
  rAddr: { fontSize: 14, color: "#1a1a2e", fontWeight: "600", lineHeight: 20 },
  rLine: {
    width: 1.5,
    height: 16,
    backgroundColor: "#ddd",
    marginLeft: 5,
    marginVertical: 2,
  },
  fareRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  fareItem: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  fareHL: {
    backgroundColor: "#fff8ee",
    borderWidth: 1.5,
    borderColor: "#F5A623",
  },
  fareEmoji: { fontSize: 20, marginBottom: 4 },
  fareVal: { fontSize: 15, fontWeight: "800", color: "#1a1a2e" },
  modalBtns: { flexDirection: "row", gap: 12, paddingHorizontal: 16 },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e74c3c",
  },
  rejectTxt: { color: "#e74c3c", fontWeight: "800", fontSize: 16 },
  acceptBtn: {
    flex: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#27ae60",
    elevation: 3,
  },
  acceptTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
