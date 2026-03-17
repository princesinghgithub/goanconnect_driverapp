// // // 


// // // app/(tabs)/home.tsx — COMPLETE RAPIDO-STYLE HOME
// // import { API_BASE_URL, SOCKET_URL } from '@/constants/config';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { router } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useRef, useState } from 'react';
// // import {
// //   Alert, Animated, Modal, RefreshControl,
// //   ScrollView, StyleSheet, Text, TouchableOpacity, View,
// // } from 'react-native';
// // import { io } from 'socket.io-client';

// // export default function DriverHomeScreen() {
// //   const [user, setUser]           = useState<any>(null);
// //   const [driver, setDriver]       = useState<any>(null);
// //   const [isOnline, setIsOnline]   = useState(false);
// //   const [rideReq, setRideReq]     = useState<any>(null);
// //   const [modalVisible, setModal]  = useState(false);
// //   const [stats, setStats]         = useState({ earnings: 0, rides: 0 });
// //   const [reqTimer, setReqTimer]   = useState(30);
// //   const [refreshing, setRefresh]  = useState(false);
// //   const socketRef = useRef<any>(null);
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const timerRef  = useRef<any>(null);
// //   const pulseRef  = useRef<any>(null);

// //   useEffect(() => {
// //     loadData();
// //     return () => {
// //       socketRef.current?.disconnect();
// //       clearInterval(timerRef.current);
// //       pulseRef.current?.stop?.();
// //     };
// //   }, []);

// //   const loadData = async () => {
// //     try {
// //       const u = await AsyncStorage.getItem('driverUser');
// //       const d = await AsyncStorage.getItem('driverData');
// //       if (u) setUser(JSON.parse(u));
// //       if (d) setDriver(JSON.parse(d));
// //       fetchStats();
// //     } catch (e) {}
// //   };

// //   const fetchStats = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       const [todayRes, weekRes] = await Promise.all([
// //         axios.get(`${API_BASE_URL}/provider/earnings/today`,  { headers: { Authorization: `Bearer ${token}` } }),
// //         axios.get(`${API_BASE_URL}/provider/earnings/weekly`, { headers: { Authorization: `Bearer ${token}` } }),
// //       ]);
// //       setStats({
// //         earnings: todayRes.data?.data?.totalEarnings || 0,
// //         rides:    todayRes.data?.data?.totalRides    || 0,
// //       });
// //     } catch (e) {
// //       // fallback: ride history se nikalo
// //       try {
// //         const token = await AsyncStorage.getItem('driverToken');
// //         const res = await axios.get(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } });
// //         const done = (res.data?.data || []).filter((r: any) =>
// //           r.status === 'completed' && new Date(r.createdAt).toDateString() === new Date().toDateString()
// //         );
// //         setStats({ earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0), rides: done.length });
// //       } catch {}
// //     } finally { setRefresh(false); }
// //   };

// //   const startPulse = () => {
// //     pulseRef.current = Animated.loop(Animated.sequence([
// //       Animated.timing(pulseAnim, { toValue: 1.18, duration: 700, useNativeDriver: true }),
// //       Animated.timing(pulseAnim, { toValue: 1.0,  duration: 700, useNativeDriver: true }),
// //     ]));
// //     pulseRef.current.start();
// //   };
// //   const stopPulse = () => { pulseRef.current?.stop(); pulseAnim.setValue(1); };

// //   const goOnline = async () => {
// //     try {
// //       const userData = await AsyncStorage.getItem('driverUser');
// //       const token    = await AsyncStorage.getItem('driverToken');
// //       if (!userData) return;
// //       const u = JSON.parse(userData);

// //       // Update status on backend
// //       await axios.put(`${API_BASE_URL}/provider/status`,
// //         { isOnline: true, status: 'available' },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       // Connect socket
// //       const socket = io(SOCKET_URL, {
// //         transports: ['websocket'],
// //         query: { userId: u.id, role: 'driver' }
// //       });
// //       socket.on('connect', () => {
// //         console.log('Socket connected');
// //         socket.emit('driverOnline', { driverId: u.id });
// //       });
// //       socket.on('newRideRequest', (req: any) => {
// //         console.log('New ride:', req);
// //         setRideReq(req);
// //         setReqTimer(30);
// //         setModal(true);
// //         startReqCountdown();
// //       });
// //       socket.on('disconnect', () => console.log('Socket disconnected'));
// //       socketRef.current = socket;

// //       setIsOnline(true);
// //       startPulse();
// //     } catch (e: any) {
// //       Alert.alert('Error', e?.response?.data?.message || 'Online nahi ho sake');
// //     }
// //   };

// //   const goOffline = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       await axios.put(`${API_BASE_URL}/provider/status`,
// //         { isOnline: false, status: 'offline' },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //     } catch (e) {}
// //     socketRef.current?.emit('driverOffline');
// //     socketRef.current?.disconnect();
// //     socketRef.current = null;
// //     setIsOnline(false);
// //     stopPulse();
// //     clearInterval(timerRef.current);
// //   };

// //   const startReqCountdown = () => {
// //     clearInterval(timerRef.current);
// //     let t = 30;
// //     timerRef.current = setInterval(() => {
// //       t -= 1; setReqTimer(t);
// //       if (t <= 0) { clearInterval(timerRef.current); setModal(false); setRideReq(null); }
// //     }, 1000);
// //   };

// //   const acceptRide = async () => {
// //     clearInterval(timerRef.current); setModal(false);
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       const rideId = rideReq?.rideId || rideReq?._id;
// //       const res = await axios.post(`${API_BASE_URL}/ride/accept`,
// //         { rideId },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data?.success) {
// //         router.push({
// //           pathname: '/(ride)/active-ride',
// //           params: {
// //             rideId,
// //             customerName:  rideReq?.customerName  || 'Customer',
// //             customerPhone: rideReq?.customerPhone || '',
// //             pickupAddress: rideReq?.pickup?.address || '',
// //             dropAddress:   rideReq?.drop?.address   || '',
// //             fare:          String(rideReq?.fare      || 0),
// //             distance:      String(rideReq?.distance  || 0),
// //             otp:           res.data?.data?.otp       || '',
// //           },
// //         });
// //       }
// //     } catch (e: any) { Alert.alert('Error', e?.response?.data?.message || 'Accept nahi hua'); }
// //     setRideReq(null);
// //   };

// //   const rejectRide = async () => {
// //     clearInterval(timerRef.current); setModal(false);
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       await axios.post(`${API_BASE_URL}/ride/reject`,
// //         { rideId: rideReq?.rideId || rideReq?._id },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //     } catch (e) {}
// //     setRideReq(null);
// //   };

// //   const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
// //   const vehicleType = driver?.vehicle?.type || '';
// //   const vehicleNum  = driver?.vehicle?.number || '';
// //   const rating      = driver?.rating?.average || 0;
// //   const name        = user?.name || 'Driver';

// //   return (
// //     <ScrollView style={styles.container}
// //       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefresh(true); fetchStats(); }} colors={['#F5A623']} />}
// //       contentContainerStyle={{ paddingBottom: 30 }}>
// //       <StatusBar style="light" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={{ flex: 1 }}>
// //           <Text style={styles.greeting}>Namaste, {name}! 👋</Text>
// //           <Text style={styles.vehicle}>
// //             {VEMOJI[vehicleType] || '🚗'} {vehicleType.toUpperCase()}{vehicleNum ? ` • ${vehicleNum}` : ''}
// //           </Text>
// //         </View>
// //         <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
// //           <View style={styles.avatar}>
// //             <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
// //           </View>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Online/Offline Toggle */}
// //       <View style={styles.toggleCard}>
// //         <Animated.View style={[
// //           styles.statusCircle,
// //           isOnline ? styles.circleOn : styles.circleOff,
// //           { transform: [{ scale: pulseAnim }] }
// //         ]}>
// //           <View style={[styles.statusDot, { backgroundColor: isOnline ? '#27ae60' : '#e74c3c' }]} />
// //           <Text style={[styles.statusLabel, { color: isOnline ? '#27ae60' : '#e74c3c' }]}>
// //             {isOnline ? 'ONLINE' : 'OFFLINE'}
// //           </Text>
// //         </Animated.View>

// //         <Text style={styles.statusDesc}>
// //           {isOnline ? '✅ Aap ride requests receive kar rahe hain' : 'Online ho kar rides receive karo'}
// //         </Text>

// //         <TouchableOpacity
// //           style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]}
// //           onPress={isOnline ? goOffline : goOnline}>
// //           <View style={[styles.toggleDot, { backgroundColor: isOnline ? '#e74c3c' : '#27ae60' }]} />
// //           <Text style={styles.toggleBtnTxt}>{isOnline ? 'Offline Ho Jao' : 'Online Ho Jao'}</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Today Stats */}
// //       <View style={styles.statsRow}>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statEmoji}>💰</Text>
// //           <Text style={styles.statVal}>₹{stats.earnings}</Text>
// //           <Text style={styles.statLbl}>Aaj Ki Kamai</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statEmoji}>🚗</Text>
// //           <Text style={styles.statVal}>{stats.rides}</Text>
// //           <Text style={styles.statLbl}>Aaj Ki Rides</Text>
// //         </View>
// //         <View style={styles.statCard}>
// //           <Text style={styles.statEmoji}>⭐</Text>
// //           <Text style={styles.statVal}>{rating > 0 ? rating.toFixed(1) : '—'}</Text>
// //           <Text style={styles.statLbl}>Rating</Text>
// //         </View>
// //       </View>

// //       {/* Online tip */}
// //       {!isOnline && (
// //         <View style={styles.tipCard}>
// //           <Text style={styles.tipTitle}>💡 Zyada Kamai Ke Tips</Text>
// //           <Text style={styles.tipTxt}>• Subah 8-10 aur Shaam 5-8 baje online raho</Text>
// //           <Text style={styles.tipTxt}>• Rides accept karte raho — acceptance rate badhao</Text>
// //           <Text style={styles.tipTxt}>• Gaadi saaf rakho — 5 ⭐ rating pao</Text>
// //         </View>
// //       )}

// //       {isOnline && (
// //         <View style={styles.waitCard}>
// //           <Text style={styles.waitEmoji}>📡</Text>
// //           <Text style={styles.waitTitle}>Ride Request Ka Intezaar...</Text>
// //           <Text style={styles.waitSub}>Jaise hi koi book kare, aapko request milegi</Text>
// //         </View>
// //       )}

// //       {/* ── RIDE REQUEST MODAL ── */}
// //       <Modal visible={modalVisible} transparent animationType="slide">
// //         <View style={styles.overlay}>
// //           <View style={styles.modal}>
// //             {/* Timer bar */}
// //             <View style={styles.timerBarBg}>
// //               <Animated.View style={[styles.timerBarFill, {
// //                 width: `${(reqTimer / 30) * 100}%`,
// //                 backgroundColor: reqTimer <= 10 ? '#e74c3c' : '#F5A623'
// //               }]} />
// //             </View>

// //             <View style={styles.modalHeader}>
// //               <View>
// //                 <Text style={styles.modalTitle}>🔔 Naya Ride Request!</Text>
// //                 <Text style={styles.modalSub}>{rideReq?.customerName || 'Customer'}</Text>
// //               </View>
// //               <View style={[styles.timerBadge, reqTimer <= 10 && { backgroundColor: '#e74c3c' }]}>
// //                 <Text style={styles.timerTxt}>{reqTimer}s</Text>
// //               </View>
// //             </View>

// //             {/* Route */}
// //             <View style={styles.routeBox}>
// //               <View style={styles.routeRow}>
// //                 <View style={[styles.routeDot, { backgroundColor: '#27ae60' }]} />
// //                 <View style={{ flex: 1 }}>
// //                   <Text style={styles.routeTag}>PICKUP</Text>
// //                   <Text style={styles.routeAddr} numberOfLines={2}>{rideReq?.pickup?.address || '—'}</Text>
// //                 </View>
// //               </View>
// //               <View style={styles.routeLineV} />
// //               <View style={styles.routeRow}>
// //                 <View style={[styles.routeDot, { backgroundColor: '#e74c3c' }]} />
// //                 <View style={{ flex: 1 }}>
// //                   <Text style={styles.routeTag}>DROP</Text>
// //                   <Text style={styles.routeAddr} numberOfLines={2}>{rideReq?.drop?.address || '—'}</Text>
// //                 </View>
// //               </View>
// //             </View>

// //             {/* Fare info */}
// //             <View style={styles.fareRow}>
// //               <View style={styles.fareItem}>
// //                 <Text style={styles.fareEmoji}>📍</Text>
// //                 <Text style={styles.fareVal}>{Number(rideReq?.distance || 0).toFixed(1)} km</Text>
// //               </View>
// //               <View style={[styles.fareItem, styles.fareHighlight]}>
// //                 <Text style={styles.fareEmoji}>💰</Text>
// //                 <Text style={[styles.fareVal, { color: '#F5A623', fontSize: 22 }]}>₹{rideReq?.fare || 0}</Text>
// //               </View>
// //               <View style={styles.fareItem}>
// //                 <Text style={styles.fareEmoji}>💳</Text>
// //                 <Text style={styles.fareVal}>{rideReq?.paymentMethod === 'online' ? 'Online' : 'Cash'}</Text>
// //               </View>
// //             </View>

// //             {/* Buttons */}
// //             <View style={styles.modalBtns}>
// //               <TouchableOpacity style={styles.rejectBtn} onPress={rejectRide}>
// //                 <Ionicons name="close-circle" size={22} color="#e74c3c" />
// //                 <Text style={styles.rejectTxt}>Reject</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity style={styles.acceptBtn} onPress={acceptRide}>
// //                 <Ionicons name="checkmark-circle" size={22} color="#fff" />
// //                 <Text style={styles.acceptTxt}>Accept</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f0f4f8' },
// //   header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
// //   greeting: { fontSize: 18, fontWeight: '800', color: '#fff' },
// //   vehicle: { fontSize: 13, color: '#adc6e0', marginTop: 3 },
// //   avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
// //   avatarTxt: { color: '#fff', fontWeight: '900', fontSize: 20 },

// //   toggleCard: { backgroundColor: '#fff', margin: 16, borderRadius: 24, padding: 24, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10 },
// //   statusCircle: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
// //   circleOn:  { backgroundColor: '#eafaf1', borderWidth: 3, borderColor: '#27ae60' },
// //   circleOff: { backgroundColor: '#fef9e7', borderWidth: 3, borderColor: '#e74c3c' },
// //   statusDot: { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
// //   statusLabel: { fontSize: 14, fontWeight: '900', letterSpacing: 1 },
// //   statusDesc: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 18, lineHeight: 20 },
// //   toggleBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 36, gap: 10, elevation: 2 },
// //   onBtn: { backgroundColor: '#27ae60' },
// //   offBtn: { backgroundColor: '#e74c3c' },
// //   toggleDot: { width: 10, height: 10, borderRadius: 5 },
// //   toggleBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },

// //   statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
// //   statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, alignItems: 'center', elevation: 2 },
// //   statEmoji: { fontSize: 26, marginBottom: 6 },
// //   statVal: { fontSize: 20, fontWeight: '900', color: '#1a1a2e' },
// //   statLbl: { fontSize: 10, color: '#aaa', marginTop: 3, textAlign: 'center' },

// //   tipCard: { backgroundColor: '#fff8ee', marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#ffe0a0' },
// //   tipTitle: { fontSize: 14, fontWeight: '800', color: '#F5A623', marginBottom: 10 },
// //   tipTxt: { fontSize: 13, color: '#666', marginBottom: 5, lineHeight: 20 },

// //   waitCard: { backgroundColor: '#eef6ff', marginHorizontal: 16, borderRadius: 18, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#c5deff' },
// //   waitEmoji: { fontSize: 48, marginBottom: 12 },
// //   waitTitle: { fontSize: 16, fontWeight: '800', color: '#1a3a5c', marginBottom: 6 },
// //   waitSub: { fontSize: 13, color: '#7a9bc4', textAlign: 'center' },

// //   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
// //   modal: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 36, overflow: 'hidden' },
// //   timerBarBg: { height: 5, backgroundColor: '#f0f0f0' },
// //   timerBarFill: { height: 5, borderRadius: 3 },
// //   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
// //   modalTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a2e' },
// //   modalSub: { fontSize: 13, color: '#888', marginTop: 3 },
// //   timerBadge: { backgroundColor: '#F5A623', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
// //   timerTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },
// //   routeBox: { backgroundColor: '#f8fafc', marginHorizontal: 16, borderRadius: 16, padding: 14, marginBottom: 14 },
// //   routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5 },
// //   routeDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 3 },
// //   routeTag: { fontSize: 10, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 2 },
// //   routeAddr: { fontSize: 14, color: '#1a1a2e', fontWeight: '600', lineHeight: 20 },
// //   routeLineV: { width: 1.5, height: 16, backgroundColor: '#ddd', marginLeft: 5, marginVertical: 2 },
// //   fareRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, gap: 8 },
// //   fareItem: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, padding: 12, alignItems: 'center' },
// //   fareHighlight: { backgroundColor: '#fff8ee', borderWidth: 1.5, borderColor: '#F5A623' },
// //   fareEmoji: { fontSize: 20, marginBottom: 4 },
// //   fareVal: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
// //   modalBtns: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
// //   rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, padding: 16, borderWidth: 2, borderColor: '#e74c3c' },
// //   rejectTxt: { color: '#e74c3c', fontWeight: '800', fontSize: 16 },
// //   acceptBtn: { flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, padding: 16, backgroundColor: '#27ae60', elevation: 3 },
// //   acceptTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
// // });


// import { API_BASE_URL, SOCKET_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import * as Haptics from 'expo-haptics';
// import * as Notifications from 'expo-notifications';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert, Animated, Modal, RefreshControl,
//   ScrollView, StyleSheet, Text, TouchableOpacity, View,
// } from 'react-native';
// import { io } from 'socket.io-client';

// // Notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge:  true,
//   }),
// });

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
//   const soundRef   = useRef<any>(null);
//   const ringInterval = useRef<any>(null);

//   useEffect(() => {
//     loadData();
//     setupNotifications();
//     return () => {
//       socketRef.current?.disconnect();
//       clearInterval(timerRef.current);
//       clearInterval(ringInterval.current);
//       stopRing();
//       pulseLoop.current?.stop?.();
//     };
//   }, []);

//   const setupNotifications = async () => {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status !== 'granted') return;
//   };

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
//       const h = { Authorization: `Bearer ${token}` };
//       const [t, w] = await Promise.all([
//         fetch(`${API_BASE_URL}/provider/earnings/today`,  { headers: h }).then(r => r.json()),
//         fetch(`${API_BASE_URL}/provider/earnings/weekly`, { headers: h }).then(r => r.json()),
//       ]);
//       setStats({ earnings: t?.data?.totalEarnings || 0, rides: t?.data?.totalRides || 0 });
//     } catch {
//       try {
//         const token = await AsyncStorage.getItem('driverToken');
//         const res = await fetch(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } });
//         const data = await res.json();
//         const done = (data?.data || []).filter((r: any) =>
//           r.status === 'completed' && new Date(r.createdAt).toDateString() === new Date().toDateString()
//         );
//         setStats({ earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0), rides: done.length });
//       } catch {}
//     } finally { setRefresh(false); }
//   };

//   // ── RING on ride request ────────────────────────────────────────
//   const startRing = async () => {
//     try {
//       // Vibration pattern — Rapido style
//       await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

//       // Continuous vibration every 800ms
//       ringInterval.current = setInterval(async () => {
//         await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
//       }, 800);

//       // Sound
//       const { sound } = await Audio.Sound.createAsync(
//         { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' },
//         { shouldPlay: true, isLooping: true, volume: 1.0 }
//       );
//       soundRef.current = sound;
//     } catch (e) {
//       // Sound fail hone pe sirf vibrate karo
//       ringInterval.current = setInterval(async () => {
//         await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
//       }, 600);
//     }
//   };

//   const stopRing = async () => {
//     clearInterval(ringInterval.current);
//     try {
//       if (soundRef.current) {
//         await soundRef.current.stopAsync();
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }
//     } catch {}
//   };

//   // ── PULSE animation ─────────────────────────────────────────────
//   const startPulse = () => {
//     pulseLoop.current = Animated.loop(Animated.sequence([
//       Animated.timing(pulseAnim, { toValue: 1.2,  duration: 600, useNativeDriver: true }),
//       Animated.timing(pulseAnim, { toValue: 1.0,  duration: 600, useNativeDriver: true }),
//     ]));
//     pulseLoop.current.start();
//   };
//   const stopPulse = () => { pulseLoop.current?.stop(); pulseAnim.setValue(1); };

//   // ── ONLINE / OFFLINE ────────────────────────────────────────────
//   const goOnline = async () => {
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const u     = JSON.parse((await AsyncStorage.getItem('driverUser')) || '{}');

//       await fetch(`${API_BASE_URL}/provider/status`, {
//         method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isOnline: true, status: 'available' }),
//       });

//       const socket = io(SOCKET_URL, { transports: ['websocket'], query: { userId: u.id, role: 'driver' } });
//       socket.on('connect',    () => socket.emit('driverOnline', { driverId: u.id }));
//       socket.on('newRideRequest', onNewRide);
//       socketRef.current = socket;
//       setIsOnline(true);
//       startPulse();
//     } catch (e: any) {
//       Alert.alert('Error', e?.message || 'Online nahi ho sake');
//     }
//   };

//   const goOffline = async () => {
//     const token = await AsyncStorage.getItem('driverToken');
//     try {
//       await fetch(`${API_BASE_URL}/provider/status`, {
//         method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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

//   // ── NEW RIDE REQUEST ─────────────────────────────────────────────
//   const onNewRide = async (req: any) => {
//     console.log('🔔 New ride:', req);
//     setRideReq(req);
//     setReqTimer(30);
//     setModal(true);
//     startRing();

//     // Push notification (even if app is background)
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: '🔔 Naya Ride Request!',
//         body:  `₹${req?.fare || 0} • ${req?.pickup?.address?.slice(0, 40) || ''}...`,
//         sound: true,
//         data:  { rideId: req?.rideId || req?._id },
//       },
//       trigger: null,
//     });

//     // Countdown timer
//     clearInterval(timerRef.current);
//     let t = 30;
//     timerRef.current = setInterval(() => {
//       t -= 1; setReqTimer(t);
//       if (t <= 0) {
//         clearInterval(timerRef.current);
//         setModal(false);
//         setRideReq(null);
//         stopRing();
//       }
//     }, 1000);
//   };

//   // ── ACCEPT ──────────────────────────────────────────────────────
//   const acceptRide = async () => {
//     clearInterval(timerRef.current);
//     setModal(false);
//     stopRing();
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const rideId = rideReq?.rideId || rideReq?._id;
//       const res = await fetch(`${API_BASE_URL}/ride/accept`, {
//         method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ rideId }),
//       });
//       const data = await res.json();
//       if (data?.success) {
//         await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         router.push({
//           pathname: '/(ride)/active-ride',
//           params: {
//             rideId,
//             customerName:  rideReq?.customerName  || 'Customer',
//             customerPhone: rideReq?.customerPhone  || '',
//             pickupAddress: rideReq?.pickup?.address || '',
//             dropAddress:   rideReq?.drop?.address   || '',
//             fare:          String(rideReq?.fare      || 0),
//             distance:      String(rideReq?.distance  || 0),
//             otp:           data?.data?.otp           || '',
//           },
//         });
//       }
//     } catch (e: any) { Alert.alert('Error', 'Accept nahi hua'); }
//     setRideReq(null);
//   };

//   // ── REJECT ──────────────────────────────────────────────────────
//   const rejectRide = async () => {
//     clearInterval(timerRef.current);
//     setModal(false);
//     stopRing();
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       await fetch(`${API_BASE_URL}/ride/reject`, {
//         method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ rideId: rideReq?.rideId || rideReq?._id }),
//       });
//     } catch {}
//     setRideReq(null);
//   };

//   const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
//   const vType = driver?.vehicle?.type  || '';
//   const vNum  = driver?.vehicle?.number|| '';
//   const name  = user?.name || 'Driver';

//   return (
//     <ScrollView style={styles.container}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefresh(true); fetchStats(); }} colors={['#F5A623']} />}
//       contentContainerStyle={{ paddingBottom: 30 }}>
//       <StatusBar style="light" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.greeting}>Namaste, {name}! 👋</Text>
//           <Text style={styles.vehicle}>{VEMOJI[vType] || '🚗'} {vType.toUpperCase()}{vNum ? ` • ${vNum}` : ''}</Text>
//         </View>
//         <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
//           <View style={styles.avatar}><Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text></View>
//         </TouchableOpacity>
//       </View>

//       {/* Toggle Card */}
//       <View style={styles.toggleCard}>
//         <Animated.View style={[styles.statusCircle, isOnline ? styles.circleOn : styles.circleOff, { transform: [{ scale: pulseAnim }] }]}>
//           <View style={[styles.statusDot, { backgroundColor: isOnline ? '#27ae60' : '#e74c3c' }]} />
//           <Text style={[styles.statusLbl, { color: isOnline ? '#27ae60' : '#e74c3c' }]}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
//         </Animated.View>
//         <Text style={styles.statusDesc}>{isOnline ? '✅ Ride requests aa sakti hain' : 'Online ho kar rides receive karo'}</Text>
//         <TouchableOpacity style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]} onPress={isOnline ? goOffline : goOnline}>
//           <View style={[styles.toggleDot, { backgroundColor: isOnline ? '#e74c3c' : '#27ae60' }]} />
//           <Text style={styles.toggleBtnTxt}>{isOnline ? 'Offline Ho Jao' : 'Online Ho Jao'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Stats */}
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
//           <Text style={styles.waitSub}>Jaise hi koi book kare, ring bajegi 🔔</Text>
//         </View>
//       )}

//       {/* ── RIDE REQUEST MODAL ── */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.overlay}>
//           <View style={styles.modal}>
//             {/* Timer bar */}
//             <View style={styles.timerBg}>
//               <View style={[styles.timerFill, {
//                 width: `${(reqTimer / 30) * 100}%`,
//                 backgroundColor: reqTimer <= 10 ? '#e74c3c' : '#F5A623',
//               }]} />
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

//             {/* Route */}
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

//             {/* Fare */}
//             <View style={styles.fareRow}>
//               <View style={styles.fareItem}><Text style={styles.fareEmoji}>📍</Text><Text style={styles.fareVal}>{Number(rideReq?.distance || 0).toFixed(1)} km</Text></View>
//               <View style={[styles.fareItem, styles.fareHL]}><Text style={styles.fareEmoji}>💰</Text><Text style={[styles.fareVal, { color: '#F5A623', fontSize: 22, fontWeight: '900' }]}>₹{rideReq?.fare || 0}</Text></View>
//               <View style={styles.fareItem}><Text style={styles.fareEmoji}>💳</Text><Text style={styles.fareVal}>{rideReq?.paymentMethod === 'online' ? 'Online' : 'Cash'}</Text></View>
//             </View>

//             {/* Buttons */}
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
//   toggleBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 36, gap: 10 },
//   onBtn: { backgroundColor: '#27ae60' },
//   offBtn: { backgroundColor: '#e74c3c' },
//   toggleDot: { width: 10, height: 10, borderRadius: 5 },
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


import { API_BASE_URL, SOCKET_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Modal, RefreshControl,
  ScrollView, StyleSheet, Text, TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { io } from 'socket.io-client';

export default function DriverHomeScreen() {
  const [user, setUser]         = useState<any>(null);
  const [driver, setDriver]     = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [rideReq, setRideReq]   = useState<any>(null);
  const [modalVisible, setModal]= useState(false);
  const [stats, setStats]       = useState({ earnings: 0, rides: 0 });
  const [reqTimer, setReqTimer] = useState(30);
  const [refreshing, setRefresh]= useState(false);

  const socketRef  = useRef<any>(null);
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const timerRef   = useRef<any>(null);
  const pulseLoop  = useRef<any>(null);
  const vibInterval = useRef<any>(null);

  useEffect(() => {
    loadData();
    return () => {
      socketRef.current?.disconnect();
      clearInterval(timerRef.current);
      stopRing();
      pulseLoop.current?.stop?.();
    };
  }, []);

  const loadData = async () => {
    const u = await AsyncStorage.getItem('driverUser');
    const d = await AsyncStorage.getItem('driverData');
    if (u) setUser(JSON.parse(u));
    if (d) setDriver(JSON.parse(d));
    fetchStats();
  };

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const h = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_BASE_URL}/ride/history/driver`, { headers: h });
      const data = await res.json();
      const done = (data?.data || []).filter((r: any) =>
        r.status === 'completed' &&
        new Date(r.createdAt).toDateString() === new Date().toDateString()
      );
      setStats({
        earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0),
        rides: done.length,
      });
    } catch {} finally { setRefresh(false); }
  };

  // ── RING — Vibration only (Expo Go compatible) ─────────────────
  const startRing = () => {
    // Pattern: vibrate 500ms, pause 300ms — repeat
    Vibration.vibrate([500, 300, 500, 300, 500, 300, 500, 300, 500, 300], true);
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
  };

  const stopRing = () => {
    Vibration.cancel();
    clearInterval(vibInterval.current);
  };

  // ── PULSE ───────────────────────────────────────────────────────
  const startPulse = () => {
    pulseLoop.current = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2,  duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1.0,  duration: 600, useNativeDriver: true }),
    ]));
    pulseLoop.current.start();
  };
  const stopPulse = () => { pulseLoop.current?.stop(); pulseAnim.setValue(1); };

  // ── ONLINE / OFFLINE ────────────────────────────────────────────
  const goOnline = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const u = JSON.parse((await AsyncStorage.getItem('driverUser')) || '{}');

      await fetch(`${API_BASE_URL}/provider/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: true, status: 'available' }),
      });

      const socket = io(SOCKET_URL, {
        transports: ['websocket'],
        query: { userId: u.id, role: 'driver' },
      });
      socket.on('connect',        () => socket.emit('driverOnline', { driverId: u.id }));
      socket.on('newRideRequest', onNewRide);
      socketRef.current = socket;
      setIsOnline(true);
      startPulse();
    } catch (e: any) {
      Alert.alert('Error', 'Online nahi ho sake — internet check karo');
    }
  };

  const goOffline = async () => {
    const token = await AsyncStorage.getItem('driverToken');
    try {
      await fetch(`${API_BASE_URL}/provider/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: false, status: 'offline' }),
      });
    } catch {}
    socketRef.current?.emit('driverOffline');
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsOnline(false);
    stopPulse();
    clearInterval(timerRef.current);
  };

  // ── NEW RIDE ─────────────────────────────────────────────────────
  const onNewRide = (req: any) => {
    console.log('🔔 New ride request:', req);
    setRideReq(req);
    setReqTimer(30);
    setModal(true);
    startRing();

    clearInterval(timerRef.current);
    let t = 30;
    timerRef.current = setInterval(() => {
      t -= 1;
      setReqTimer(t);
      if (t <= 0) {
        clearInterval(timerRef.current);
        setModal(false);
        setRideReq(null);
        stopRing();
      }
    }, 1000);
  };

  // ── ACCEPT ──────────────────────────────────────────────────────
  const acceptRide = async () => {
    clearInterval(timerRef.current);
    setModal(false);
    stopRing();
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const rideId = rideReq?.rideId || rideReq?._id;
      const res = await fetch(`${API_BASE_URL}/ride/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (data?.success) {
        try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
        router.push({
          pathname: '/(ride)/active-ride',
          params: {
            rideId,
            customerName:  rideReq?.customerName   || 'Customer',
            customerPhone: rideReq?.customerPhone   || '',
            pickupAddress: rideReq?.pickup?.address || '',
            dropAddress:   rideReq?.drop?.address   || '',
            fare:          String(rideReq?.fare      || 0),
            distance:      String(rideReq?.distance  || 0),
            otp:           data?.data?.otp           || '',
          },
        });
      } else {
        Alert.alert('Error', data?.message || 'Accept nahi hua');
      }
    } catch { Alert.alert('Error', 'Accept nahi hua'); }
    setRideReq(null);
  };

  // ── REJECT ──────────────────────────────────────────────────────
  const rejectRide = async () => {
    clearInterval(timerRef.current);
    setModal(false);
    stopRing();
    try {
      const token = await AsyncStorage.getItem('driverToken');
      await fetch(`${API_BASE_URL}/ride/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: rideReq?.rideId || rideReq?._id }),
      });
    } catch {}
    setRideReq(null);
  };

  const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
  const vType = driver?.vehicle?.type   || '';
  const vNum  = driver?.vehicle?.number || '';
  const name  = user?.name || 'Driver';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefresh(true); fetchStats(); }} colors={['#F5A623']} />}
      contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Namaste, {name}! 👋</Text>
          <Text style={styles.vehicle}>
            {VEMOJI[vType] || '🚗'} {vType.toUpperCase()}{vNum ? ` • ${vNum}` : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Online/Offline Card */}
      <View style={styles.toggleCard}>
        <Animated.View style={[
          styles.statusCircle,
          isOnline ? styles.circleOn : styles.circleOff,
          { transform: [{ scale: pulseAnim }] },
        ]}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#27ae60' : '#e74c3c' }]} />
          <Text style={[styles.statusLbl, { color: isOnline ? '#27ae60' : '#e74c3c' }]}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </Animated.View>
        <Text style={styles.statusDesc}>
          {isOnline ? '✅ Ride requests aa sakti hain' : 'Online ho kar rides receive karo'}
        </Text>
        <TouchableOpacity
          style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]}
          onPress={isOnline ? goOffline : goOnline}>
          <View style={[styles.toggleDot, { backgroundColor: isOnline ? '#fff' : '#fff' }]} />
          <Text style={styles.toggleBtnTxt}>{isOnline ? 'Offline Ho Jao' : 'Online Ho Jao'}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { emoji: '💰', val: `₹${stats.earnings}`, lbl: 'Aaj Ki Kamai' },
          { emoji: '🚗', val: `${stats.rides}`,      lbl: 'Aaj Ki Rides' },
          { emoji: '⭐', val: driver?.rating?.average > 0 ? driver.rating.average.toFixed(1) : '—', lbl: 'Rating' },
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
          <Text style={styles.tipTxt}>• Subah 8-10 aur Shaam 5-8 baje online raho</Text>
          <Text style={styles.tipTxt}>• Rides accept karte raho — acceptance rate badhao</Text>
          <Text style={styles.tipTxt}>• Gaadi saaf rakho — 5 ⭐ rating pao</Text>
        </View>
      ) : (
        <View style={styles.waitCard}>
          <Text style={styles.waitEmoji}>📡</Text>
          <Text style={styles.waitTitle}>Ride Request Ka Intezaar...</Text>
          <Text style={styles.waitSub}>Jaise hi koi book kare, phone vibrate karega 📳</Text>
        </View>
      )}

      {/* RIDE REQUEST MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Timer bar */}
            <View style={styles.timerBg}>
              <View style={[styles.timerFill, {
                width: `${(reqTimer / 30) * 100}%`,
                backgroundColor: reqTimer <= 10 ? '#e74c3c' : '#F5A623',
              }]} />
            </View>

            <View style={styles.modalTop}>
              <View>
                <Text style={styles.modalTitle}>🔔 Naya Ride Request!</Text>
                <Text style={styles.modalCus}>{rideReq?.customerName || 'Customer'}</Text>
              </View>
              <View style={[styles.timerBadge, reqTimer <= 10 && { backgroundColor: '#e74c3c' }]}>
                <Text style={styles.timerTxt}>{reqTimer}s</Text>
              </View>
            </View>

            {/* Route */}
            <View style={styles.routeBox}>
              <View style={styles.routeRow}>
                <View style={[styles.rDot, { backgroundColor: '#27ae60' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rTag}>PICKUP</Text>
                  <Text style={styles.rAddr} numberOfLines={2}>{rideReq?.pickup?.address || '—'}</Text>
                </View>
              </View>
              <View style={styles.rLine} />
              <View style={styles.routeRow}>
                <View style={[styles.rDot, { backgroundColor: '#e74c3c' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rTag}>DROP</Text>
                  <Text style={styles.rAddr} numberOfLines={2}>{rideReq?.drop?.address || '—'}</Text>
                </View>
              </View>
            </View>

            {/* Fare info */}
            <View style={styles.fareRow}>
              <View style={styles.fareItem}>
                <Text style={styles.fareEmoji}>📍</Text>
                <Text style={styles.fareVal}>{Number(rideReq?.distance || 0).toFixed(1)} km</Text>
              </View>
              <View style={[styles.fareItem, styles.fareHL]}>
                <Text style={styles.fareEmoji}>💰</Text>
                <Text style={[styles.fareVal, { color: '#F5A623', fontSize: 22, fontWeight: '900' }]}>₹{rideReq?.fare || 0}</Text>
              </View>
              <View style={styles.fareItem}>
                <Text style={styles.fareEmoji}>💳</Text>
                <Text style={styles.fareVal}>{rideReq?.paymentMethod === 'online' ? 'Online' : 'Cash'}</Text>
              </View>
            </View>

            {/* Buttons */}
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
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 18, fontWeight: '800', color: '#fff' },
  vehicle: { fontSize: 13, color: '#adc6e0', marginTop: 3 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  avatarTxt: { color: '#fff', fontWeight: '900', fontSize: 20 },
  toggleCard: { backgroundColor: '#fff', margin: 16, borderRadius: 24, padding: 24, alignItems: 'center', elevation: 3 },
  statusCircle: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  circleOn:  { backgroundColor: '#eafaf1', borderWidth: 3, borderColor: '#27ae60' },
  circleOff: { backgroundColor: '#fef9e7', borderWidth: 3, borderColor: '#e74c3c' },
  statusDot: { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
  statusLbl: { fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  statusDesc: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 18, lineHeight: 20 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 36, gap: 10 },
  onBtn: { backgroundColor: '#27ae60' },
  offBtn: { backgroundColor: '#e74c3c' },
  toggleDot: { width: 10, height: 10, borderRadius: 5 },
  toggleBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, alignItems: 'center', elevation: 2 },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statVal: { fontSize: 20, fontWeight: '900', color: '#1a1a2e' },
  statLbl: { fontSize: 10, color: '#aaa', marginTop: 3, textAlign: 'center' },
  tipCard: { backgroundColor: '#fff8ee', marginHorizontal: 16, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#ffe0a0' },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#F5A623', marginBottom: 10 },
  tipTxt: { fontSize: 13, color: '#666', marginBottom: 5, lineHeight: 20 },
  waitCard: { backgroundColor: '#eef6ff', marginHorizontal: 16, borderRadius: 18, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#c5deff' },
  waitEmoji: { fontSize: 48, marginBottom: 12 },
  waitTitle: { fontSize: 16, fontWeight: '800', color: '#1a3a5c', marginBottom: 6 },
  waitSub: { fontSize: 13, color: '#7a9bc4', textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 36, overflow: 'hidden' },
  timerBg: { height: 6, backgroundColor: '#f0f0f0' },
  timerFill: { height: 6 },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1a1a2e' },
  modalCus: { fontSize: 13, color: '#888', marginTop: 3 },
  timerBadge: { backgroundColor: '#F5A623', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  timerTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },
  routeBox: { backgroundColor: '#f8fafc', marginHorizontal: 16, borderRadius: 16, padding: 14, marginBottom: 14 },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5 },
  rDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12, marginTop: 3 },
  rTag: { fontSize: 10, fontWeight: '800', color: '#aaa', letterSpacing: 1, marginBottom: 2 },
  rAddr: { fontSize: 14, color: '#1a1a2e', fontWeight: '600', lineHeight: 20 },
  rLine: { width: 1.5, height: 16, backgroundColor: '#ddd', marginLeft: 5, marginVertical: 2 },
  fareRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, gap: 8 },
  fareItem: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, padding: 12, alignItems: 'center' },
  fareHL: { backgroundColor: '#fff8ee', borderWidth: 1.5, borderColor: '#F5A623' },
  fareEmoji: { fontSize: 20, marginBottom: 4 },
  fareVal: { fontSize: 15, fontWeight: '800', color: '#1a1a2e' },
  modalBtns: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, padding: 16, borderWidth: 2, borderColor: '#e74c3c' },
  rejectTxt: { color: '#e74c3c', fontWeight: '800', fontSize: 16 },
  acceptBtn: { flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, padding: 16, backgroundColor: '#27ae60', elevation: 3 },
  acceptTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
