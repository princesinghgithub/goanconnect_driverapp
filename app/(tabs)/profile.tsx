// // // // // // app/(tabs)/profile.tsx
// // // // // import { API_BASE_URL } from '@/constants/config';
// // // // // import { Ionicons } from '@expo/vector-icons';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import axios from 'axios';
// // // // // import { router } from 'expo-router';
// // // // // import { StatusBar } from 'expo-status-bar';
// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// // // // // export default function DriverProfileScreen() {
// // // // //   const [driver, setDriver] = useState<any>(null);
// // // // //   const [stats, setStats]   = useState({ rides: 0, earnings: 0, rating: 5.0 });

// // // // //   useEffect(() => { loadData(); }, []);

// // // // //   const loadData = async () => {
// // // // //     const data = await AsyncStorage.getItem('driverData');
// // // // //     if (data) setDriver(JSON.parse(data));
// // // // //     try {
// // // // //       const token = await AsyncStorage.getItem('driverToken');
// // // // //       const res = await axios.get(`${API_BASE_URL}/ride/history/driver`, {
// // // // //         headers: { Authorization: `Bearer ${token}` },
// // // // //       });
// // // // //       const rides = res.data?.data || [];
// // // // //       const completed = rides.filter((r: any) => r.status === 'completed');
// // // // //       setStats({
// // // // //         rides:    completed.length,
// // // // //         earnings: completed.reduce((s: number, r: any) => s + (r.fare || 0), 0),
// // // // //         rating:   driver?.rating || 5.0,
// // // // //       });
// // // // //     } catch (e) {}
// // // // //   };

// // // // //   const handleLogout = () => {
// // // // //     Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
// // // // //       { text: 'Nahi', style: 'cancel' },
// // // // //       {
// // // // //         text: 'Haan', style: 'destructive',
// // // // //         onPress: async () => {
// // // // //           await AsyncStorage.clear();
// // // // //           router.replace('/(auth)/login');
// // // // //         },
// // // // //       },
// // // // //     ]);
// // // // //   };

// // // // //   const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜' };

// // // // //   const MENU = [
// // // // //     { icon: 'car-outline',        label: 'Meri Rides',       onPress: () => {} },
// // // // //     { icon: 'wallet-outline',     label: 'Earnings History',  onPress: () => router.push('/(tabs)/earnings') },
// // // // //     { icon: 'document-outline',   label: 'Documents',        onPress: () => {} },
// // // // //     { icon: 'help-circle-outline', label: 'Help & Support',  onPress: () => {} },
// // // // //   ];

// // // // //   return (
// // // // //     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
// // // // //       <StatusBar style="light" />

// // // // //       <View style={styles.header}>
// // // // //         <View style={styles.avatar}>
// // // // //           <Text style={styles.avatarText}>
// // // // //             {(driver?.user?.name || 'D').charAt(0).toUpperCase()}
// // // // //           </Text>
// // // // //         </View>
// // // // //         <Text style={styles.name}>{driver?.user?.name || 'Driver'}</Text>
// // // // //         <Text style={styles.email}>{driver?.user?.email || ''}</Text>
// // // // //         <View style={styles.vehicleBadge}>
// // // // //           <Text style={styles.vehicleBadgeText}>
// // // // //             {VEHICLE_EMOJI[driver?.vehicleType]} {driver?.vehicleType?.toUpperCase()} • {driver?.vehicleNumber || 'N/A'}
// // // // //           </Text>
// // // // //         </View>

// // // // //         {/* Stats */}
// // // // //         <View style={styles.statsRow}>
// // // // //           <View style={styles.statItem}>
// // // // //             <Text style={styles.statVal}>{stats.rides}</Text>
// // // // //             <Text style={styles.statLabel}>Rides</Text>
// // // // //           </View>
// // // // //           <View style={styles.statDiv} />
// // // // //           <View style={styles.statItem}>
// // // // //             <Text style={styles.statVal}>₹{stats.earnings}</Text>
// // // // //             <Text style={styles.statLabel}>Total Kamai</Text>
// // // // //           </View>
// // // // //           <View style={styles.statDiv} />
// // // // //           <View style={styles.statItem}>
// // // // //             <Text style={styles.statVal}>{stats.rating.toFixed(1)} ⭐</Text>
// // // // //             <Text style={styles.statLabel}>Rating</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>

// // // // //       {/* Menu */}
// // // // //       <View style={styles.section}>
// // // // //         {MENU.map((item, i) => (
// // // // //           <TouchableOpacity
// // // // //             key={i}
// // // // //             style={[styles.menuItem, i === MENU.length - 1 && { borderBottomWidth: 0 }]}
// // // // //             onPress={item.onPress}
// // // // //           >
// // // // //             <View style={styles.menuIcon}>
// // // // //               <Ionicons name={item.icon as any} size={20} color="#1a3a5c" />
// // // // //             </View>
// // // // //             <Text style={styles.menuText}>{item.label}</Text>
// // // // //             <Ionicons name="chevron-forward" size={18} color="#ccc" />
// // // // //           </TouchableOpacity>
// // // // //         ))}
// // // // //       </View>

// // // // //       <Text style={styles.version}>GaonConnect Driver v1.0.0</Text>

// // // // //       <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
// // // // //         <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
// // // // //         <Text style={styles.logoutText}>Logout</Text>
// // // // //       </TouchableOpacity>
// // // // //     </ScrollView>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // // // //   header: {
// // // // //     backgroundColor: '#1a3a5c', paddingTop: 60,
// // // // //     paddingBottom: 24, alignItems: 'center', paddingHorizontal: 20,
// // // // //   },
// // // // //   avatar: {
// // // // //     width: 84, height: 84, borderRadius: 42,
// // // // //     backgroundColor: '#F5A623', justifyContent: 'center',
// // // // //     alignItems: 'center', marginBottom: 12,
// // // // //     borderWidth: 3, borderColor: '#fff',
// // // // //   },
// // // // //   avatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
// // // // //   name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
// // // // //   email: { fontSize: 13, color: '#adc6e0', marginBottom: 10 },
// // // // //   vehicleBadge: {
// // // // //     backgroundColor: 'rgba(245,166,35,0.2)', borderRadius: 20,
// // // // //     paddingHorizontal: 16, paddingVertical: 6, marginBottom: 20,
// // // // //     borderWidth: 1, borderColor: '#F5A623',
// // // // //   },
// // // // //   vehicleBadgeText: { color: '#F5A623', fontWeight: '700', fontSize: 13 },
// // // // //   statsRow: {
// // // // //     flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)',
// // // // //     borderRadius: 16, padding: 16, width: '100%',
// // // // //   },
// // // // //   statItem: { flex: 1, alignItems: 'center' },
// // // // //   statVal: { fontSize: 18, fontWeight: '900', color: '#F5A623' },
// // // // //   statLabel: { fontSize: 11, color: '#adc6e0', marginTop: 4 },
// // // // //   statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
// // // // //   section: {
// // // // //     backgroundColor: '#fff', margin: 16, borderRadius: 16,
// // // // //     borderWidth: 1, borderColor: '#eee', overflow: 'hidden',
// // // // //   },
// // // // //   menuItem: {
// // // // //     flexDirection: 'row', alignItems: 'center',
// // // // //     padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
// // // // //   },
// // // // //   menuIcon: {
// // // // //     width: 36, height: 36, borderRadius: 10,
// // // // //     backgroundColor: '#eef2f7', justifyContent: 'center',
// // // // //     alignItems: 'center', marginRight: 14,
// // // // //   },
// // // // //   menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
// // // // //   version: { textAlign: 'center', color: '#ccc', fontSize: 12, marginBottom: 12 },
// // // // //   logoutBtn: {
// // // // //     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
// // // // //     margin: 16, marginTop: 0, backgroundColor: '#fff',
// // // // //     borderRadius: 16, padding: 16, gap: 8,
// // // // //     borderWidth: 2, borderColor: '#e74c3c',
// // // // //   },
// // // // //   logoutText: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
// // // // // });


// // // // import { API_BASE_URL } from '@/constants/config';
// // // // import { Ionicons } from '@expo/vector-icons';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import axios from 'axios';
// // // // import { router } from 'expo-router';
// // // // import { StatusBar } from 'expo-status-bar';
// // // // import React, { useEffect, useState } from 'react';
// // // // import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// // // // export default function ProfileScreen() {
// // // //   const [driver, setDriver] = useState<any>(null);
// // // //   const [stats, setStats]   = useState({ rides: 0, earnings: 0 });

// // // //   useEffect(() => { load(); }, []);

// // // //   const load = async () => {
// // // //     const d = await AsyncStorage.getItem('driverData');
// // // //     if (d) setDriver(JSON.parse(d));
// // // //     try {
// // // //       const token = await AsyncStorage.getItem('driverToken');
// // // //       const res = await axios.get(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } });
// // // //       const done = (res.data?.data || []).filter((r: any) => r.status === 'completed');
// // // //       setStats({ rides: done.length, earnings: done.reduce((s: number, r: any) => s + (r.fare || 0), 0) });
// // // //     } catch (e) {}
// // // //   };

// // // //   const logout = () => Alert.alert('Logout', 'Kya logout karna hai?', [
// // // //     { text: 'Nahi', style: 'cancel' },
// // // //     { text: 'Haan', style: 'destructive', onPress: async () => { await AsyncStorage.clear(); router.replace('/(auth)/login'); } },
// // // //   ]);

// // // //   const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜' };
// // // //   const MENU = [
// // // //     { icon: 'wallet-outline',      label: 'Earnings History',  onPress: () => router.push('/(tabs)/earnings') },
// // // //     { icon: 'document-text-outline', label: 'My Documents',    onPress: () => {} },
// // // //     { icon: 'star-outline',         label: 'My Ratings',       onPress: () => {} },
// // // //     { icon: 'help-circle-outline',  label: 'Help & Support',   onPress: () => {} },
// // // //   ];

// // // //   return (
// // // //     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
// // // //       <StatusBar style="light" />
// // // //       <View style={styles.header}>
// // // //         <View style={styles.avatar}><Text style={styles.avatarText}>{(driver?.user?.name||'D').charAt(0).toUpperCase()}</Text></View>
// // // //         <Text style={styles.name}>{driver?.user?.name || 'Driver'}</Text>
// // // //         <Text style={styles.email}>{driver?.user?.email || ''}</Text>
// // // //         <View style={styles.badge}>
// // // //           <Text style={styles.badgeText}>{VEHICLE_EMOJI[driver?.vehicleType]} {driver?.vehicleType?.toUpperCase()} • {driver?.vehicleNumber || 'N/A'}</Text>
// // // //         </View>
// // // //         <View style={styles.statsRow}>
// // // //           <View style={styles.statItem}><Text style={styles.statVal}>{stats.rides}</Text><Text style={styles.statLbl}>Rides</Text></View>
// // // //           <View style={styles.statDiv} />
// // // //           <View style={styles.statItem}><Text style={styles.statVal}>₹{stats.earnings}</Text><Text style={styles.statLbl}>Total Kamai</Text></View>
// // // //           <View style={styles.statDiv} />
// // // //           <View style={styles.statItem}><Text style={styles.statVal}>{driver?.rating?.toFixed(1)||'5.0'} ⭐</Text><Text style={styles.statLbl}>Rating</Text></View>
// // // //         </View>
// // // //       </View>

// // // //       <View style={styles.section}>
// // // //         {MENU.map((item, i) => (
// // // //           <TouchableOpacity key={i} style={[styles.menuItem, i===MENU.length-1&&{borderBottomWidth:0}]} onPress={item.onPress}>
// // // //             <View style={styles.menuIcon}><Ionicons name={item.icon as any} size={20} color="#1a3a5c" /></View>
// // // //             <Text style={styles.menuText}>{item.label}</Text>
// // // //             <Ionicons name="chevron-forward" size={18} color="#ccc" />
// // // //           </TouchableOpacity>
// // // //         ))}
// // // //       </View>

// // // //       <Text style={styles.version}>GaonConnect Driver v1.0.0</Text>
// // // //       <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
// // // //         <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
// // // //         <Text style={styles.logoutText}>Logout</Text>
// // // //       </TouchableOpacity>
// // // //     </ScrollView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // // //   header: { backgroundColor: '#1a3a5c', paddingTop: 60, paddingBottom: 24, alignItems: 'center', paddingHorizontal: 20 },
// // // //   avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff' },
// // // //   avatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
// // // //   name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
// // // //   email: { fontSize: 13, color: '#adc6e0', marginBottom: 10 },
// // // //   badge: { backgroundColor: 'rgba(245,166,35,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 20, borderWidth: 1, borderColor: '#F5A623' },
// // // //   badgeText: { color: '#F5A623', fontWeight: '700', fontSize: 13 },
// // // //   statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, width: '100%' },
// // // //   statItem: { flex: 1, alignItems: 'center' },
// // // //   statVal: { fontSize: 18, fontWeight: '900', color: '#F5A623' },
// // // //   statLbl: { fontSize: 11, color: '#adc6e0', marginTop: 4 },
// // // //   statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
// // // //   section: { backgroundColor: '#fff', margin: 16, borderRadius: 16, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
// // // //   menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
// // // //   menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef2f7', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
// // // //   menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
// // // //   version: { textAlign: 'center', color: '#ccc', fontSize: 12, marginBottom: 12 },
// // // //   logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, marginTop: 0, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, borderWidth: 2, borderColor: '#e74c3c' },
// // // //   logoutText: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
// // // // });


// // // // app/(tabs)/home.tsx
// // // import { API_BASE_URL, SOCKET_URL } from '@/constants/config';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import axios from 'axios';
// // // import { router } from 'expo-router';
// // // import { StatusBar } from 'expo-status-bar';
// // // import React, { useEffect, useRef, useState } from 'react';
// // // import { Alert, Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// // // import { io } from 'socket.io-client';

// // // export default function DriverHomeScreen() {
// // //   const [driver, setDriver]         = useState<any>(null);
// // //   const [isOnline, setIsOnline]     = useState(false);
// // //   const [rideRequest, setRideRequest] = useState<any>(null);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [todayEarnings, setTodayEarnings] = useState(0);
// // //   const [todayRides, setTodayRides]   = useState(0);
// // //   const [reqTimer, setReqTimer]     = useState(30);
// // //   const socketRef  = useRef<any>(null);
// // //   const pulseAnim  = useRef(new Animated.Value(1)).current;
// // //   const timerRef   = useRef<any>(null);

// // //   useEffect(() => { loadDriver(); return () => { socketRef.current?.disconnect(); clearInterval(timerRef.current); }; }, []);

// // //   const loadDriver = async () => {
// // //     const data = await AsyncStorage.getItem('driverData');
// // //     if (data) setDriver(JSON.parse(data));
// // //     fetchStats();
// // //   };

// // //   const fetchStats = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem('driverToken');
// // //       const res = await axios.get(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } });
// // //       const rides = res.data?.data || [];
// // //       const today = new Date().toDateString();
// // //       const done  = rides.filter((r: any) => r.status === 'completed' && new Date(r.createdAt).toDateString() === today);
// // //       setTodayRides(done.length);
// // //       setTodayEarnings(done.reduce((s: number, r: any) => s + (r.fare || 0), 0));
// // //     } catch (e) {}
// // //   };

// // //   const pulse = (start: boolean) => {
// // //     if (start) {
// // //       Animated.loop(Animated.sequence([
// // //         Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
// // //         Animated.timing(pulseAnim, { toValue: 1.0,  duration: 800, useNativeDriver: true }),
// // //       ])).start();
// // //     } else { pulseAnim.stopAnimation(); pulseAnim.setValue(1); }
// // //   };

// // //   const goOnline = async () => {
// // //     const data = await AsyncStorage.getItem('driverData');
// // //     if (!data) return;
// // //     const d = JSON.parse(data);
// // //     const socket = io(SOCKET_URL, { transports: ['websocket'], query: { userId: d._id, role: 'driver' } });
// // //     socket.on('connect', () => socket.emit('driverOnline', { driverId: d._id }));
// // //     socket.on('newRideRequest', (req: any) => {
// // //       setRideRequest(req);
// // //       setReqTimer(30);
// // //       setModalVisible(true);
// // //       startReqTimer();
// // //     });
// // //     socketRef.current = socket;
// // //     setIsOnline(true);
// // //     pulse(true);
// // //   };

// // //   const goOffline = () => {
// // //     socketRef.current?.emit('driverOffline');
// // //     socketRef.current?.disconnect();
// // //     socketRef.current = null;
// // //     setIsOnline(false);
// // //     pulse(false);
// // //     clearInterval(timerRef.current);
// // //   };

// // //   const startReqTimer = () => {
// // //     clearInterval(timerRef.current);
// // //     let t = 30;
// // //     timerRef.current = setInterval(() => {
// // //       t -= 1; setReqTimer(t);
// // //       if (t <= 0) { clearInterval(timerRef.current); setModalVisible(false); setRideRequest(null); }
// // //     }, 1000);
// // //   };

// // //   const handleAccept = async () => {
// // //     clearInterval(timerRef.current); setModalVisible(false);
// // //     try {
// // //       const token = await AsyncStorage.getItem('driverToken');
// // //       const res = await axios.post(`${API_BASE_URL}/ride/accept`,
// // //         { rideId: rideRequest?.rideId || rideRequest?._id },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data?.success) {
// // //         router.push({
// // //           pathname: '/(ride)/active-ride',
// // //           params: {
// // //             rideId:        rideRequest?.rideId || rideRequest?._id,
// // //             customerName:  rideRequest?.customerName  || 'Customer',
// // //             customerPhone: rideRequest?.customerPhone || '',
// // //             pickupAddress: rideRequest?.pickup?.address || '',
// // //             dropAddress:   rideRequest?.drop?.address  || '',
// // //             fare:          String(rideRequest?.fare     || 0),
// // //             distance:      String(rideRequest?.distance || 0),
// // //             otp:           res.data?.data?.otp || '',
// // //           },
// // //         });
// // //       }
// // //     } catch (e: any) { Alert.alert('Error', e?.response?.data?.message || 'Accept nahi hua'); }
// // //     setRideRequest(null);
// // //   };

// // //   const handleReject = async () => {
// // //     clearInterval(timerRef.current); setModalVisible(false);
// // //     try {
// // //       const token = await AsyncStorage.getItem('driverToken');
// // //       await axios.post(`${API_BASE_URL}/ride/reject`,
// // //         { rideId: rideRequest?.rideId || rideRequest?._id },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //     } catch (e) {}
// // //     setRideRequest(null);
// // //   };

// // //   const VEHICLE_EMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜' };

// // //   return (
// // //     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
// // //       <StatusBar style="light" />
// // //       <View style={styles.header}>
// // //         <View>
// // //           <Text style={styles.greeting}>Namaste, {driver?.user?.name || 'Driver'}! 👋</Text>
// // //           <Text style={styles.vehicle}>
// // //             {VEHICLE_EMOJI[driver?.vehicleType] || '🚗'} {driver?.vehicleType?.toUpperCase()} {driver?.vehicleNumber ? `• ${driver.vehicleNumber}` : ''}
// // //           </Text>
// // //         </View>
// // //         <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
// // //           <View style={styles.avatar}>
// // //             <Text style={styles.avatarText}>{(driver?.user?.name || 'D').charAt(0).toUpperCase()}</Text>
// // //           </View>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Online/Offline Card */}
// // //       <View style={styles.toggleCard}>
// // //         <Animated.View style={[styles.statusCircle, { transform: [{ scale: pulseAnim }] }, isOnline ? styles.online : styles.offline]}>
// // //           <Text style={styles.statusEmoji}>{isOnline ? '🟢' : '🔴'}</Text>
// // //           <Text style={styles.statusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
// // //         </Animated.View>
// // //         <Text style={styles.statusDesc}>
// // //           {isOnline ? '✅ Ride requests aa sakti hain' : 'Online ho kar rides receive karo'}
// // //         </Text>
// // //         <TouchableOpacity style={[styles.toggleBtn, isOnline ? styles.offBtn : styles.onBtn]} onPress={isOnline ? goOffline : goOnline}>
// // //           <Text style={styles.toggleBtnText}>{isOnline ? '🔴 Offline Ho Jao' : '🟢 Online Ho Jao'}</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Stats */}
// // //       <View style={styles.statsRow}>
// // //         <View style={styles.statCard}>
// // //           <Text style={styles.statEmoji}>💰</Text>
// // //           <Text style={styles.statVal}>₹{todayEarnings}</Text>
// // //           <Text style={styles.statLbl}>Aaj Ki Kamai</Text>
// // //         </View>
// // //         <View style={styles.statCard}>
// // //           <Text style={styles.statEmoji}>🚗</Text>
// // //           <Text style={styles.statVal}>{todayRides}</Text>
// // //           <Text style={styles.statLbl}>Aaj Ki Rides</Text>
// // //         </View>
// // //         <View style={styles.statCard}>
// // //           <Text style={styles.statEmoji}>⭐</Text>
// // //           <Text style={styles.statVal}>{driver?.rating?.average?.toFixed(1) || '5.0'}</Text>
// // //           <Text style={styles.statLbl}>Rating</Text>
// // //         </View>
// // //       </View>

// // //       {/* Tips */}
// // //       <View style={styles.tips}>
// // //         <Text style={styles.tipsTitle}>💡 Aaj Ka Tip</Text>
// // //         <Text style={styles.tipText}>• Peak hours: Subah 8-10, Shaam 5-8 baje</Text>
// // //         <Text style={styles.tipText}>• Online raho — zyada rides milenge</Text>
// // //         <Text style={styles.tipText}>• 5 ⭐ rating ke liye saaf gaadi rakho</Text>
// // //       </View>

// // //       {/* Ride Request Modal */}
// // //       <Modal visible={modalVisible} transparent animationType="slide">
// // //         <View style={styles.overlay}>
// // //           <View style={styles.modal}>
// // //             <View style={styles.modalHeader}>
// // //               <Text style={styles.modalTitle}>🔔 Naya Ride!</Text>
// // //               <View style={[styles.timerBadge, reqTimer <= 10 && { backgroundColor: '#e74c3c' }]}>
// // //                 <Text style={styles.timerText}>{reqTimer}s</Text>
// // //               </View>
// // //             </View>
// // //             <View style={styles.routeBox}>
// // //               <View style={styles.routeRow}><View style={[styles.dot, { backgroundColor: '#27ae60' }]} /><Text style={styles.routeText} numberOfLines={2}>{rideRequest?.pickup?.address}</Text></View>
// // //               <View style={styles.routeLineV} />
// // //               <View style={styles.routeRow}><View style={[styles.dot, { backgroundColor: '#e74c3c' }]} /><Text style={styles.routeText} numberOfLines={2}>{rideRequest?.drop?.address}</Text></View>
// // //             </View>
// // //             <View style={styles.rideStats}>
// // //               <View style={styles.rideStat}><Text style={styles.rideStatEmoji}>📍</Text><Text style={styles.rideStatVal}>{rideRequest?.distance?.toFixed(1)} km</Text></View>
// // //               <View style={styles.rideStat}><Text style={styles.rideStatEmoji}>💰</Text><Text style={styles.rideStatVal}>₹{rideRequest?.fare}</Text></View>
// // //               <View style={styles.rideStat}><Text style={styles.rideStatEmoji}>💳</Text><Text style={styles.rideStatVal}>{rideRequest?.paymentMethod || 'Cash'}</Text></View>
// // //             </View>
// // //             <View style={styles.modalBtns}>
// // //               <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}><Text style={styles.rejectText}>❌ Reject</Text></TouchableOpacity>
// // //               <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}><Text style={styles.acceptText}>✅ Accept</Text></TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </ScrollView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // //   header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
// // //   greeting: { fontSize: 18, fontWeight: '800', color: '#fff' },
// // //   vehicle: { fontSize: 13, color: '#adc6e0', marginTop: 4 },
// // //   avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center' },
// // //   avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
// // //   toggleCard: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 2 },
// // //   statusCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
// // //   online: { backgroundColor: '#e8f8f5' },
// // //   offline: { backgroundColor: '#fef9e7' },
// // //   statusEmoji: { fontSize: 36 },
// // //   statusText: { fontSize: 13, fontWeight: '900', marginTop: 4 },
// // //   statusDesc: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 16 },
// // //   toggleBtn: { borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32 },
// // //   onBtn: { backgroundColor: '#27ae60' },
// // //   offBtn: { backgroundColor: '#e74c3c' },
// // //   toggleBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
// // //   statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
// // //   statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 1 },
// // //   statEmoji: { fontSize: 24, marginBottom: 6 },
// // //   statVal: { fontSize: 20, fontWeight: '900', color: '#1a1a2e' },
// // //   statLbl: { fontSize: 10, color: '#aaa', marginTop: 4, textAlign: 'center' },
// // //   tips: { backgroundColor: '#fff8ee', margin: 16, marginTop: 4, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#ffe0a0' },
// // //   tipsTitle: { fontSize: 14, fontWeight: '800', color: '#F5A623', marginBottom: 10 },
// // //   tipText: { fontSize: 13, color: '#555', marginBottom: 6 },
// // //   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
// // //   modal: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
// // //   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
// // //   modalTitle: { fontSize: 20, fontWeight: '900', color: '#1a1a2e' },
// // //   timerBadge: { backgroundColor: '#F5A623', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
// // //   timerText: { color: '#fff', fontWeight: '900', fontSize: 15 },
// // //   routeBox: { backgroundColor: '#f8f9fa', borderRadius: 14, padding: 14, marginBottom: 14 },
// // //   routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
// // //   dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10, marginTop: 3 },
// // //   routeLineV: { width: 1, height: 14, backgroundColor: '#ddd', marginLeft: 4, marginVertical: 2 },
// // //   routeText: { flex: 1, fontSize: 14, color: '#1a1a2e', fontWeight: '500' },
// // //   rideStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
// // //   rideStat: { alignItems: 'center' },
// // //   rideStatEmoji: { fontSize: 22, marginBottom: 4 },
// // //   rideStatVal: { fontSize: 15, fontWeight: '800', color: '#1a1a2e' },
// // //   modalBtns: { flexDirection: 'row', gap: 12 },
// // //   rejectBtn: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: '#e74c3c' },
// // //   rejectText: { color: '#e74c3c', fontWeight: '800', fontSize: 15 },
// // //   acceptBtn: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', backgroundColor: '#27ae60' },
// // //   acceptText: { color: '#fff', fontWeight: '800', fontSize: 15 },
// // // });


// // import { API_BASE_URL } from '@/constants/config';
// // import { Ionicons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { router } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useState } from 'react';
// // import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// // export default function ProfileScreen() {
// //   const [user, setUser]     = useState<any>(null);
// //   const [driver, setDriver] = useState<any>(null);
// //   const [stats, setStats]   = useState({ rides: 0, earnings: 0, rating: 0 });

// //   useEffect(() => { load(); }, []);

// //   const load = async () => {
// //     const u = await AsyncStorage.getItem('driverUser');
// //     const d = await AsyncStorage.getItem('driverData');
// //     if (u) setUser(JSON.parse(u));
// //     if (d) setDriver(JSON.parse(d));
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       const [statsRes, histRes] = await Promise.all([
// //         axios.get(`${API_BASE_URL}/provider/stats/me`, { headers: { Authorization: `Bearer ${token}` } }),
// //         axios.get(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } }),
// //       ]);
// //       const done = (histRes.data?.data || []).filter((r: any) => r.status === 'completed');
// //       const provStats = statsRes.data?.data?.stats;
// //       setStats({
// //         rides:    provStats?.completedTrips || done.length,
// //         earnings: provStats?.totalEarnings  || done.reduce((s: number, r: any) => s + (r.fare || 0), 0),
// //         rating:   statsRes.data?.data?.rating?.average || 0,
// //       });
// //     } catch (e) {}
// //   };

// //   const logout = () => Alert.alert('Logout', 'Pakka logout karna hai?', [
// //     { text: 'Nahi', style: 'cancel' },
// //     { text: 'Haan', style: 'destructive', onPress: async () => { await AsyncStorage.clear(); router.replace('/(auth)/login'); } },
// //   ]);

// //   const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
// //   const vType = driver?.vehicle?.type || '';
// //   const vNum  = driver?.vehicle?.number || 'N/A';
// //   const vModel = driver?.vehicle?.model || '';
// //   const name  = user?.name || 'Driver';
// //   const email = user?.email || '';
// //   const phone = user?.phone || '';

// //   const MENU = [
// //     { icon: 'wallet-outline',        label: 'Earnings History',     badge: null, onPress: () => router.push('/(tabs)/earnings') },
// //     { icon: 'star-outline',          label: 'Meri Ratings',         badge: null, onPress: () => {} },
// //     { icon: 'document-text-outline', label: 'Mere Documents',       badge: null, onPress: () => {} },
// //     { icon: 'car-outline',           label: 'Vehicle Details',      badge: null, onPress: () => {} },
// //     { icon: 'help-circle-outline',   label: 'Help & Support',       badge: null, onPress: () => {} },
// //     { icon: 'shield-checkmark-outline', label: 'Privacy Policy',    badge: null, onPress: () => {} },
// //   ];

// //   return (
// //     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
// //       <StatusBar style="light" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={styles.avatar}>
// //           <Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text>
// //         </View>
// //         <Text style={styles.name}>{name}</Text>
// //         <Text style={styles.email}>{email}</Text>
// //         {phone ? <Text style={styles.phone}>📞 {phone}</Text> : null}

// //         <View style={styles.vehicleBadge}>
// //           <Text style={styles.vehicleBadgeTxt}>
// //             {VEMOJI[vType]} {vType.toUpperCase()}{vNum !== 'N/A' ? ` • ${vNum}` : ''}{vModel ? ` • ${vModel}` : ''}
// //           </Text>
// //         </View>

// //         {/* Stats */}
// //         <View style={styles.statsBox}>
// //           <View style={styles.statItem}>
// //             <Text style={styles.statVal}>{stats.rides}</Text>
// //             <Text style={styles.statLbl}>Total Rides</Text>
// //           </View>
// //           <View style={styles.statDiv} />
// //           <View style={styles.statItem}>
// //             <Text style={styles.statVal}>₹{stats.earnings.toLocaleString()}</Text>
// //             <Text style={styles.statLbl}>Total Kamai</Text>
// //           </View>
// //           <View style={styles.statDiv} />
// //           <View style={styles.statItem}>
// //             <Text style={styles.statVal}>{stats.rating > 0 ? stats.rating.toFixed(1) : '—'} ⭐</Text>
// //             <Text style={styles.statLbl}>Rating</Text>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Menu */}
// //       <View style={styles.menuCard}>
// //         {MENU.map((item, i) => (
// //           <TouchableOpacity key={i} style={[styles.menuItem, i === MENU.length - 1 && { borderBottomWidth: 0 }]}
// //             onPress={item.onPress}>
// //             <View style={styles.menuIcon}>
// //               <Ionicons name={item.icon as any} size={20} color="#1a3a5c" />
// //             </View>
// //             <Text style={styles.menuTxt}>{item.label}</Text>
// //             <Ionicons name="chevron-forward" size={16} color="#ccc" />
// //           </TouchableOpacity>
// //         ))}
// //       </View>

// //       <Text style={styles.version}>GaonConnect Driver v1.0.0</Text>

// //       <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
// //         <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
// //         <Text style={styles.logoutTxt}>Logout</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f0f4f8' },
// //   header: { backgroundColor: '#1a3a5c', paddingTop: 60, paddingBottom: 24, alignItems: 'center', paddingHorizontal: 20 },
// //   avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff' },
// //   avatarTxt: { fontSize: 38, fontWeight: '900', color: '#fff' },
// //   name: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
// //   email: { fontSize: 13, color: '#adc6e0', marginBottom: 3 },
// //   phone: { fontSize: 13, color: '#adc6e0', marginBottom: 12 },
// //   vehicleBadge: { backgroundColor: 'rgba(245,166,35,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 20, borderWidth: 1, borderColor: '#F5A623' },
// //   vehicleBadgeTxt: { color: '#F5A623', fontWeight: '700', fontSize: 13 },
// //   statsBox: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 16, width: '100%' },
// //   statItem: { flex: 1, alignItems: 'center' },
// //   statVal: { fontSize: 16, fontWeight: '900', color: '#F5A623' },
// //   statLbl: { fontSize: 10, color: '#adc6e0', marginTop: 4, textAlign: 'center' },
// //   statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
// //   menuCard: { backgroundColor: '#fff', margin: 16, borderRadius: 18, overflow: 'hidden', elevation: 2 },
// //   menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
// //   menuIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#eef2f7', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
// //   menuTxt: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
// //   version: { textAlign: 'center', color: '#bbb', fontSize: 12, marginBottom: 12 },
// //   logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, borderWidth: 2, borderColor: '#e74c3c' },
// //   logoutTxt: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
// // });


// import { API_BASE_URL } from '@/constants/config';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useState } from 'react';
// import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function ProfileScreen() {
//   const [user, setUser]     = useState<any>(null);
//   const [driver, setDriver] = useState<any>(null);
//   const [stats, setStats]   = useState({ rides: 0, earnings: 0, rating: 0 });

//   useEffect(() => { load(); }, []);

//   const load = async () => {
//     const u = await AsyncStorage.getItem('driverUser');
//     const d = await AsyncStorage.getItem('driverData');
//     if (u) setUser(JSON.parse(u));
//     if (d) setDriver(JSON.parse(d));
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const res = await window.fetch(`${API_BASE_URL}/provider/stats/me`, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       const s = data?.data?.stats;
//       const r = data?.data?.rating;
//       setStats({
//         rides:    s?.completedTrips || 0,
//         earnings: s?.totalEarnings  || 0,
//         rating:   r?.average        || 0,
//       });
//     } catch (e) {}
//   };

//   const logout = () => Alert.alert('Logout', 'Pakka logout karna hai?', [
//     { text: 'Nahi', style: 'cancel' },
//     { text: 'Haan', style: 'destructive', onPress: async () => { await AsyncStorage.clear(); router.replace('/(auth)/login'); } },
//   ]);

//   const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
//   const vType  = driver?.vehicle?.type   || '';
//   const vNum   = driver?.vehicle?.number || 'N/A';
//   const vModel = driver?.vehicle?.model  || '';
//   const name   = user?.name  || 'Driver';
//   const email  = user?.email || '';
//   const phone  = user?.phone || '';

//   const MENU = [
//     { icon: 'wallet-outline',           label: 'Earnings History',  sub: 'Apni kamai dekho',        onPress: () => router.push('/(tabs)/earnings') },
//     { icon: 'star-outline',             label: 'Meri Ratings',      sub: 'Customer reviews',        onPress: () => router.push('/(tabs)/ratings') },
//     { icon: 'document-text-outline',    label: 'Mere Documents',    sub: 'License, RC, Aadhaar',    onPress: () => router.push('/(tabs)/documents') },
//     { icon: 'car-outline',              label: 'Vehicle Details',   sub: 'Model, color update karo',onPress: () => router.push('/(tabs)/vehicle') },
//     { icon: 'help-circle-outline',      label: 'Help & Support',    sub: 'FAQs aur contact',        onPress: () => router.push('/(tabs)/help') },
//     { icon: 'shield-checkmark-outline', label: 'Privacy Policy',    sub: 'Data privacy',            onPress: () => {} },
//   ];

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       <StatusBar style="light" />
//       <View style={styles.header}>
//         <View style={styles.avatar}><Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text></View>
//         <Text style={styles.name}>{name}</Text>
//         <Text style={styles.email}>{email}</Text>
//         {phone ? <Text style={styles.phone}>📞 {phone}</Text> : null}
//         <View style={styles.vehicleBadge}>
//           <Text style={styles.vehicleTxt}>
//             {VEMOJI[vType] || '🚗'} {vType.toUpperCase()}{vNum !== 'N/A' ? ` • ${vNum}` : ''}{vModel ? ` • ${vModel}` : ''}
//           </Text>
//         </View>
//         <View style={styles.statsBox}>
//           <View style={styles.statItem}><Text style={styles.statVal}>{stats.rides}</Text><Text style={styles.statLbl}>Total Rides</Text></View>
//           <View style={styles.statDiv} />
//           <View style={styles.statItem}><Text style={styles.statVal}>₹{stats.earnings.toLocaleString()}</Text><Text style={styles.statLbl}>Total Kamai</Text></View>
//           <View style={styles.statDiv} />
//           <View style={styles.statItem}><Text style={styles.statVal}>{stats.rating > 0 ? stats.rating.toFixed(1) + ' ⭐' : '—'}</Text><Text style={styles.statLbl}>Rating</Text></View>
//         </View>
//       </View>

//       <View style={styles.menuCard}>
//         {MENU.map((item, i) => (
//           <TouchableOpacity key={i} style={[styles.menuItem, i === MENU.length - 1 && { borderBottomWidth: 0 }]} onPress={item.onPress}>
//             <View style={styles.menuIcon}><Ionicons name={item.icon as any} size={20} color="#1a3a5c" /></View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.menuTxt}>{item.label}</Text>
//               <Text style={styles.menuSub}>{item.sub}</Text>
//             </View>
//             <Ionicons name="chevron-forward" size={16} color="#ccc" />
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Text style={styles.version}>GaonConnect Driver v1.0.0</Text>
//       <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
//         <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
//         <Text style={styles.logoutTxt}>Logout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f0f4f8' },
//   header: { backgroundColor: '#1a3a5c', paddingTop: 60, paddingBottom: 24, alignItems: 'center', paddingHorizontal: 20 },
//   avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff' },
//   avatarTxt: { fontSize: 38, fontWeight: '900', color: '#fff' },
//   name: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
//   email: { fontSize: 13, color: '#adc6e0', marginBottom: 3 },
//   phone: { fontSize: 13, color: '#adc6e0', marginBottom: 12 },
//   vehicleBadge: { backgroundColor: 'rgba(245,166,35,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 20, borderWidth: 1, borderColor: '#F5A623' },
//   vehicleTxt: { color: '#F5A623', fontWeight: '700', fontSize: 13 },
//   statsBox: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 16, width: '100%' },
//   statItem: { flex: 1, alignItems: 'center' },
//   statVal: { fontSize: 16, fontWeight: '900', color: '#F5A623' },
//   statLbl: { fontSize: 10, color: '#adc6e0', marginTop: 4, textAlign: 'center' },
//   statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
//   menuCard: { backgroundColor: '#fff', margin: 16, borderRadius: 18, overflow: 'hidden', elevation: 2 },
//   menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
//   menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2f7', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
//   menuTxt: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
//   menuSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
//   version: { textAlign: 'center', color: '#bbb', fontSize: 12, marginBottom: 12 },
//   logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, borderWidth: 2, borderColor: '#e74c3c' },
//   logoutTxt: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
// });



import { API_BASE_URL } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser]     = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [stats, setStats]   = useState({ rides: 0, earnings: 0, rating: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const u = await AsyncStorage.getItem('driverUser');
    const d = await AsyncStorage.getItem('driverData');
    if (u) setUser(JSON.parse(u));
    if (d) setDriver(JSON.parse(d));
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const res = await window.fetch(`${API_BASE_URL}/provider/stats/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const s = data?.data?.stats;
      const r = data?.data?.rating;
      setStats({
        rides:    s?.completedTrips || 0,
        earnings: s?.totalEarnings  || 0,
        rating:   r?.average        || 0,
      });
    } catch (e) {}
  };

  const logout = () => Alert.alert('Logout', 'Pakka logout karna hai?', [
    { text: 'Nahi', style: 'cancel' },
    { text: 'Haan', style: 'destructive', onPress: async () => { await AsyncStorage.clear(); router.replace('/(auth)/login'); } },
  ]);

  const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
  const vType  = driver?.vehicle?.type   || '';
  const vNum   = driver?.vehicle?.number || 'N/A';
  const vModel = driver?.vehicle?.model  || '';
  const name   = user?.name  || 'Driver';
  const email  = user?.email || '';
  const phone  = user?.phone || '';

  const MENU = [
    { icon: 'wallet-outline',           label: 'Earnings History',  sub: 'Apni kamai dekho',        onPress: () => router.push('/(tabs)/earnings') },
    { icon: 'star-outline',             label: 'Meri Ratings',      sub: 'Customer reviews',        onPress: () => router.push('/(tabs)/ratings') },
    { icon: 'document-text-outline',    label: 'Mere Documents',    sub: 'License, RC, Aadhaar',    onPress: () => router.push('/(tabs)/documents') },
    { icon: 'car-outline',              label: 'Vehicle Details',   sub: 'Model, color update karo',onPress: () => router.push('/(tabs)/vehicle') },
    { icon: 'help-circle-outline',      label: 'Help & Support',    sub: 'FAQs aur contact',        onPress: () => router.push('/(tabs)/help') },
    { icon: 'shield-checkmark-outline', label: 'Privacy Policy',    sub: 'Data privacy',            onPress: () => router.push('/(tabs)/privacy') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>{name.charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        {phone ? <Text style={styles.phone}>📞 {phone}</Text> : null}
        <View style={styles.vehicleBadge}>
          <Text style={styles.vehicleTxt}>
            {VEMOJI[vType] || '🚗'} {vType.toUpperCase()}{vNum !== 'N/A' ? ` • ${vNum}` : ''}{vModel ? ` • ${vModel}` : ''}
          </Text>
        </View>
        <View style={styles.statsBox}>
          <View style={styles.statItem}><Text style={styles.statVal}>{stats.rides}</Text><Text style={styles.statLbl}>Total Rides</Text></View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}><Text style={styles.statVal}>₹{stats.earnings.toLocaleString()}</Text><Text style={styles.statLbl}>Total Kamai</Text></View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}><Text style={styles.statVal}>{stats.rating > 0 ? stats.rating.toFixed(1) + ' ⭐' : '—'}</Text><Text style={styles.statLbl}>Rating</Text></View>
        </View>
      </View>

      <View style={styles.menuCard}>
        {MENU.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.menuItem, i === MENU.length - 1 && { borderBottomWidth: 0 }]} onPress={item.onPress}>
            <View style={styles.menuIcon}><Ionicons name={item.icon as any} size={20} color="#1a3a5c" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTxt}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>GaonConnect Driver v1.0.0</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 60, paddingBottom: 24, alignItems: 'center', paddingHorizontal: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5A623', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#fff' },
  avatarTxt: { fontSize: 38, fontWeight: '900', color: '#fff' },
  name: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  email: { fontSize: 13, color: '#adc6e0', marginBottom: 3 },
  phone: { fontSize: 13, color: '#adc6e0', marginBottom: 12 },
  vehicleBadge: { backgroundColor: 'rgba(245,166,35,0.15)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 20, borderWidth: 1, borderColor: '#F5A623' },
  vehicleTxt: { color: '#F5A623', fontWeight: '700', fontSize: 13 },
  statsBox: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 16, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: '900', color: '#F5A623' },
  statLbl: { fontSize: 10, color: '#adc6e0', marginTop: 4, textAlign: 'center' },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  menuCard: { backgroundColor: '#fff', margin: 16, borderRadius: 18, overflow: 'hidden', elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2f7', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuTxt: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  menuSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
  version: { textAlign: 'center', color: '#bbb', fontSize: 12, marginBottom: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, borderWidth: 2, borderColor: '#e74c3c' },
  logoutTxt: { fontSize: 16, fontWeight: '800', color: '#e74c3c' },
});
