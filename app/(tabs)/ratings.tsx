import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function RatingsScreen() {
  const [rides, setRides]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ avg: 0, total: 0, counts: [0,0,0,0,0] });

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const [statsRes, histRes] = await Promise.all([
        window.fetch(`${API_BASE_URL}/provider/stats/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        window.fetch(`${API_BASE_URL}/ride/history/driver`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      const rated = (histRes?.data || []).filter((r: any) => r.status === 'completed' && r.rating);
      setRides(rated);
      const rating = statsRes?.data?.rating;
      if (rating) {
        setSummary({
          avg: rating.average || 0,
          total: rating.count || 0,
          counts: [
            rating.breakdown?.[1] || 0,
            rating.breakdown?.[2] || 0,
            rating.breakdown?.[3] || 0,
            rating.breakdown?.[4] || 0,
            rating.breakdown?.[5] || 0,
          ]
        });
      }
    } catch (e) {} finally { setLoading(false); }
  };

  const stars = (n: number) => '⭐'.repeat(n) + '☆'.repeat(5 - n);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#F5A623" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⭐ Meri Ratings</Text>
        <Text style={styles.bigRating}>{summary.avg > 0 ? summary.avg.toFixed(1) : '—'}</Text>
        <Text style={styles.ratingStars}>{summary.avg > 0 ? stars(Math.round(summary.avg)) : '☆☆☆☆☆'}</Text>
        <Text style={styles.totalRatings}>{summary.total} ratings mile</Text>

        {/* Breakdown bars */}
        <View style={styles.breakdown}>
          {[5,4,3,2,1].map((star, i) => {
            const count = summary.counts[star - 1];
            const pct   = summary.total > 0 ? (count / summary.total) * 100 : 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLbl}>{star} ⭐</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: star >= 4 ? '#27ae60' : star === 3 ? '#F5A623' : '#e74c3c' }]} />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <FlatList
        data={rides}
        keyExtractor={i => i._id}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetch} colors={['#F5A623']} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={styles.emptyTxt}>Abhi tak koi rating nahi</Text>
            <Text style={styles.emptySub}>Rides complete karo, ratings milenge!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardStars}>{stars(item.rating || 5)}</Text>
              <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short' })}</Text>
            </View>
            {item.review ? <Text style={styles.review}>"{item.review}"</Text> : null}
            <Text style={styles.cardRoute} numberOfLines={1}>{item.pickup?.address} → {item.drop?.address}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontSize: 16, color: '#adc6e0', marginBottom: 8 },
  bigRating: { fontSize: 64, fontWeight: '900', color: '#F5A623' },
  ratingStars: { fontSize: 24, marginBottom: 4 },
  totalRatings: { fontSize: 13, color: '#adc6e0', marginBottom: 16 },
  breakdown: { width: '100%', gap: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLbl: { color: '#fff', fontSize: 12, width: 35 },
  barBg: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  barCount: { color: '#adc6e0', fontSize: 12, width: 24, textAlign: 'right' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTxt: { fontSize: 16, fontWeight: '700', color: '#888' },
  emptySub: { fontSize: 13, color: '#aaa', marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardStars: { fontSize: 16 },
  cardDate: { fontSize: 12, color: '#aaa' },
  review: { fontSize: 14, color: '#555', fontStyle: 'italic', marginBottom: 8 },
  cardRoute: { fontSize: 12, color: '#aaa' },
});
