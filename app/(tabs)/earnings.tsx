// // // app/(tabs)/earnings.tsx
// // import { API_BASE_URL } from '@/constants/config';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useState } from 'react';
// // import {
// //     ActivityIndicator, FlatList, RefreshControl,
// //     StyleSheet, Text, TouchableOpacity, View,
// // } from 'react-native';

// // export default function EarningsScreen() {
// //   const [rides, setRides]       = useState<any[]>([]);
// //   const [loading, setLoading]   = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [filter, setFilter]     = useState<'today' | 'week' | 'all'>('today');

// //   useEffect(() => { fetchRides(); }, []);

// //   const fetchRides = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('driverToken');
// //       const res = await axios.get(`${API_BASE_URL}/ride/history/driver`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setRides(res.data?.data || []);
// //     } catch (e) {}
// //     finally { setLoading(false); setRefreshing(false); }
// //   };

// //   const getFiltered = () => {
// //     const completed = rides.filter(r => r.status === 'completed');
// //     const now = new Date();
// //     if (filter === 'today') {
// //       return completed.filter(r => new Date(r.createdAt).toDateString() === now.toDateString());
// //     }
// //     if (filter === 'week') {
// //       const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
// //       return completed.filter(r => new Date(r.createdAt) >= weekAgo);
// //     }
// //     return completed;
// //   };

// //   const filtered  = getFiltered();
// //   const total     = filtered.reduce((s, r) => s + (r.fare || 0), 0);

// //   const formatDate = (d: string) => new Date(d).toLocaleDateString('hi-IN', {
// //     day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
// //   });

// //   if (loading) return (
// //     <View style={styles.loader}>
// //       <ActivityIndicator size="large" color="#F5A623" />
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar style="light" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>💰 Meri Kamai</Text>
// //         <Text style={styles.totalAmount}>₹{total}</Text>
// //         <Text style={styles.totalLabel}>{filtered.length} rides completed</Text>

// //         {/* Filter Tabs */}
// //         <View style={styles.filterRow}>
// //           {(['today', 'week', 'all'] as const).map(f => (
// //             <TouchableOpacity
// //               key={f}
// //               style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
// //               onPress={() => setFilter(f)}
// //             >
// //               <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
// //                 {f === 'today' ? 'Aaj' : f === 'week' ? 'Hafte' : 'Sab'}
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>

// //       <FlatList
// //         data={filtered}
// //         keyExtractor={i => i._id}
// //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRides(); }} colors={['#F5A623']} />}
// //         contentContainerStyle={{ paddingBottom: 20 }}
// //         ListEmptyComponent={
// //           <View style={styles.empty}>
// //             <Text style={styles.emptyEmoji}>💸</Text>
// //             <Text style={styles.emptyText}>Is period mein koi ride nahi</Text>
// //           </View>
// //         }
// //         renderItem={({ item }) => (
// //           <View style={styles.rideCard}>
// //             <View style={styles.rideLeft}>
// //               <Text style={styles.rideDate}>{formatDate(item.createdAt)}</Text>
// //               <Text style={styles.rideRoute} numberOfLines={1}>
// //                 {item.pickup?.address} → {item.drop?.address}
// //               </Text>
// //               <Text style={styles.rideDistance}>📍 {item.distance?.toFixed(1)} km</Text>
// //             </View>
// //             <Text style={styles.rideFare}>₹{item.fare}</Text>
// //           </View>
// //         )}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// //   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   header: {
// //     backgroundColor: '#1a3a5c', paddingTop: 55,
// //     paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center',
// //   },
// //   headerTitle: { fontSize: 18, fontWeight: '800', color: '#adc6e0', marginBottom: 8 },
// //   totalAmount: { fontSize: 48, fontWeight: '900', color: '#F5A623' },
// //   totalLabel: { fontSize: 13, color: '#adc6e0', marginBottom: 16 },
// //   filterRow: { flexDirection: 'row', gap: 10 },
// //   filterBtn: {
// //     paddingHorizontal: 20, paddingVertical: 8,
// //     borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
// //   },
// //   filterBtnActive: { backgroundColor: '#F5A623' },
// //   filterText: { color: '#adc6e0', fontWeight: '700', fontSize: 13 },
// //   filterTextActive: { color: '#fff' },
// //   empty: { alignItems: 'center', paddingTop: 80 },
// //   emptyEmoji: { fontSize: 48, marginBottom: 12 },
// //   emptyText: { fontSize: 15, color: '#aaa' },
// //   rideCard: {
// //     backgroundColor: '#fff', margin: 12, marginBottom: 4,
// //     borderRadius: 14, padding: 16, flexDirection: 'row',
// //     alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 1,
// //   },
// //   rideLeft: { flex: 1 },
// //   rideDate: { fontSize: 11, color: '#aaa', marginBottom: 4 },
// //   rideRoute: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
// //   rideDistance: { fontSize: 12, color: '#888' },
// //   rideFare: { fontSize: 22, fontWeight: '900', color: '#F5A623' },
// // });

// import { API_BASE_URL } from '@/constants/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function EarningsScreen() {
//   const [rides, setRides]     = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter]   = useState<'today'|'week'|'all'>('today');

//   useEffect(() => { fetch(); }, []);

//   const fetch = async () => {
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const res = await axios.get(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } });
//       setRides(res.data?.data || []);
//     } catch (e) {} finally { setLoading(false); setRefreshing(false); }
//   };

//   const filtered = () => {
//     const done = rides.filter(r => r.status === 'completed');
//     if (filter === 'today') return done.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString());
//     if (filter === 'week')  return done.filter(r => new Date(r.createdAt) >= new Date(Date.now() - 7*24*60*60*1000));
//     return done;
//   };

//   const list  = filtered();
//   const total = list.reduce((s, r) => s + (r.fare || 0), 0);

//   if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#F5A623" /></View>;

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
//       <View style={styles.header}>
//         <Text style={styles.headerLbl}>💰 Meri Kamai</Text>
//         <Text style={styles.total}>₹{total}</Text>
//         <Text style={styles.count}>{list.length} rides complete</Text>
//         <View style={styles.filters}>
//           {(['today','week','all'] as const).map(f => (
//             <TouchableOpacity key={f} style={[styles.filterBtn, filter===f && styles.filterActive]} onPress={() => setFilter(f)}>
//               <Text style={[styles.filterText, filter===f && styles.filterTextActive]}>{f==='today'?'Aaj':f==='week'?'Hafte':'Sab'}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//       <FlatList
//         data={list}
//         keyExtractor={i => i._id}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} colors={['#F5A623']} />}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyEmoji}>💸</Text><Text style={styles.emptyText}>Koi ride nahi is period mein</Text></View>}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString('hi-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })}</Text>
//               <Text style={styles.cardRoute} numberOfLines={1}>{item.pickup?.address} → {item.drop?.address}</Text>
//               <Text style={styles.cardDist}>📍 {item.distance?.toFixed(1)} km</Text>
//             </View>
//             <Text style={styles.cardFare}>₹{item.fare}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center' },
//   headerLbl: { fontSize: 16, color: '#adc6e0', marginBottom: 8 },
//   total: { fontSize: 48, fontWeight: '900', color: '#F5A623' },
//   count: { fontSize: 13, color: '#adc6e0', marginBottom: 16 },
//   filters: { flexDirection: 'row', gap: 10 },
//   filterBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
//   filterActive: { backgroundColor: '#F5A623' },
//   filterText: { color: '#adc6e0', fontWeight: '700', fontSize: 13 },
//   filterTextActive: { color: '#fff' },
//   empty: { alignItems: 'center', paddingTop: 80 },
//   emptyEmoji: { fontSize: 48, marginBottom: 12 },
//   emptyText: { fontSize: 15, color: '#aaa' },
//   card: { backgroundColor: '#fff', margin: 12, marginBottom: 4, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 1 },
//   cardDate: { fontSize: 11, color: '#aaa', marginBottom: 4 },
//   cardRoute: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
//   cardDist: { fontSize: 12, color: '#888' },
//   cardFare: { fontSize: 22, fontWeight: '900', color: '#F5A623' },
// });


import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Filter = 'today' | 'week' | 'all';

export default function EarningsScreen() {
  const [rides, setRides]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [filter, setFilter]     = useState<Filter>('today');
  const [summary, setSummary]   = useState({ today: 0, week: 0, total: 0, todayRides: 0 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const h = { Authorization: `Bearer ${token}` };
      const [histRes, todayRes, weekRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/ride/history/driver`, { headers: h }),
        axios.get(`${API_BASE_URL}/provider/earnings/today`,  { headers: h }),
        axios.get(`${API_BASE_URL}/provider/earnings/weekly`, { headers: h }),
      ]);
      const allRides = (histRes.data?.data || []).filter((r: any) => r.status === 'completed');
      setRides(allRides);
      setSummary({
        today:      todayRes.data?.data?.totalEarnings || 0,
        todayRides: todayRes.data?.data?.totalRides    || 0,
        week:       weekRes.data?.data?.totalEarnings  || 0,
        total:      allRides.reduce((s: number, r: any) => s + (r.fare || 0), 0),
      });
    } catch (e) {} finally { setLoading(false); setRefresh(false); }
  };

  const filtered = () => {
    if (filter === 'today') return rides.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString());
    if (filter === 'week')  return rides.filter(r => new Date(r.createdAt) >= new Date(Date.now() - 7 * 86400000));
    return rides;
  };

  const shown = filtered();
  const shownTotal = shown.reduce((s, r) => s + (r.fare || 0), 0);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'today', label: 'Aaj' },
    { key: 'week',  label: '7 Din' },
    { key: 'all',   label: 'Sab' },
  ];

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#F5A623" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLbl}>💰 Meri Kamai</Text>
        <Text style={styles.totalAmt}>₹{shownTotal.toLocaleString()}</Text>
        <Text style={styles.totalCount}>{shown.length} rides</Text>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.qs}><Text style={styles.qsVal}>₹{summary.today}</Text><Text style={styles.qsLbl}>Aaj</Text></View>
          <View style={styles.qsDivider} />
          <View style={styles.qs}><Text style={styles.qsVal}>₹{summary.week}</Text><Text style={styles.qsLbl}>Hafte</Text></View>
          <View style={styles.qsDivider} />
          <View style={styles.qs}><Text style={styles.qsVal}>₹{summary.total}</Text><Text style={styles.qsLbl}>Total</Text></View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterActive]}
              onPress={() => setFilter(f.key)}>
              <Text style={[styles.filterTxt, filter === f.key && styles.filterTxtActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={shown}
        keyExtractor={i => i._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefresh(true); fetchAll(); }} colors={['#F5A623']} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTxt}>Is period mein koi ride nahi</Text>
            <Text style={styles.emptySub}>Online ho aur rides accept karo!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.rideCard}>
            <View style={styles.rideLeft}>
              <Text style={styles.rideDate}>
                {new Date(item.createdAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short' })}
                {' • '}
                {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={styles.rideRoute}>
                <View style={[styles.rDot, { backgroundColor: '#27ae60' }]} />
                <Text style={styles.rideAddr} numberOfLines={1}>{item.pickup?.address || '—'}</Text>
              </View>
              <View style={styles.rideRoute}>
                <View style={[styles.rDot, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.rideAddr} numberOfLines={1}>{item.drop?.address || '—'}</Text>
              </View>
              <Text style={styles.rideDist}>📍 {item.distance?.toFixed(1) || '0'} km  •  {item.vehicleType || ''}</Text>
            </View>
            <View style={styles.rideRight}>
              <Text style={styles.rideFare}>₹{item.fare}</Text>
              <Text style={[styles.ridePayment, { color: item.paymentMethod === 'cash' ? '#27ae60' : '#3498db' }]}>
                {item.paymentMethod === 'cash' ? '💵 Cash' : '📱 Online'}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 0, paddingHorizontal: 20, alignItems: 'center' },
  headerLbl: { fontSize: 14, color: '#adc6e0', marginBottom: 6 },
  totalAmt: { fontSize: 52, fontWeight: '900', color: '#F5A623' },
  totalCount: { fontSize: 13, color: '#adc6e0', marginBottom: 16 },
  quickStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14, width: '100%', marginBottom: 16 },
  qs: { flex: 1, alignItems: 'center' },
  qsVal: { fontSize: 16, fontWeight: '900', color: '#fff' },
  qsLbl: { fontSize: 11, color: '#adc6e0', marginTop: 3 },
  qsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  filterRow: { flexDirection: 'row', gap: 0, width: '100%' },
  filterBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  filterActive: { borderBottomColor: '#F5A623' },
  filterTxt: { color: '#adc6e0', fontWeight: '700', fontSize: 14 },
  filterTxtActive: { color: '#F5A623' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTxt: { fontSize: 16, fontWeight: '700', color: '#888' },
  emptySub: { fontSize: 13, color: '#aaa', marginTop: 6 },
  rideCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
  rideLeft: { flex: 1, marginRight: 12 },
  rideDate: { fontSize: 11, color: '#aaa', marginBottom: 8 },
  rideRoute: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  rDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  rideAddr: { flex: 1, fontSize: 13, color: '#1a1a2e', fontWeight: '600' },
  rideDist: { fontSize: 11, color: '#aaa', marginTop: 6 },
  rideRight: { alignItems: 'flex-end', justifyContent: 'center' },
  rideFare: { fontSize: 24, fontWeight: '900', color: '#F5A623' },
  ridePayment: { fontSize: 12, fontWeight: '700', marginTop: 4 },
});
