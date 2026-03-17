// app/(auth)/pending-approval.tsx
// Rapido jaisi screen — jab tak admin approve na kare
import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, ScrollView,
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function PendingApprovalScreen() {
  const [checking, setChecking] = useState(false);
  const [email, setEmail]       = useState('');

  useEffect(() => {
    loadEmail();
  }, []);

  const loadEmail = async () => {
    const e = await AsyncStorage.getItem('pendingEmail');
    if (e) setEmail(e);
  };

  // Check karo ki approve hua ya nahi
  const checkStatus = async () => {
    if (!email) return;
    setChecking(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/provider/send-otp`, { email });
      if (res.data?.success) {
        // OTP gaya matlab approved ho gaya!
        Alert.alert('🎉 Approved!', 'Aapka account approve ho gaya! Ab login karo.', [
          { text: 'Login Karo', onPress: () => router.replace('/(auth)/login') }
        ]);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || '';
      if (msg.includes('approve nahi')) {
        Alert.alert('⏳ Abhi Tak Nahi', 'Admin ne abhi approve nahi kiya. Thoda aur intezaar karo.');
      } else {
        Alert.alert('Status', msg || 'Check karne mein error');
      }
    } finally { setChecking(false); }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>⏳</Text>
        <Text style={styles.heroTitle}>Account Review Mein Hai</Text>
        <Text style={styles.heroSub}>
          GaonConnect team aapke documents verify kar rahi hai
        </Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, styles.dotDone]} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>✅ Registration Complete</Text>
            <Text style={styles.statusDesc}>Aapki profile submit ho gayi</Text>
          </View>
        </View>

        <View style={styles.statusLine} />

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, styles.dotPending]} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>🔍 Document Verification</Text>
            <Text style={styles.statusDesc}>License, RC aur photo check ho rahi hai</Text>
          </View>
        </View>

        <View style={styles.statusLine} />

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, styles.dotWaiting]} />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>🚗 Ready to Drive</Text>
            <Text style={styles.statusDesc}>Approve hone ke baad rides milenge</Text>
          </View>
        </View>
      </View>

      {/* Time Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>⏱️ Kitna Time Lagega?</Text>
        <Text style={styles.infoText}>
          Aam taur pe <Text style={styles.infoHighlight}>24-48 ghante</Text> lagte hain.{'\n'}
          Weekdays pe jaldi hota hai.
        </Text>
      </View>

      {/* What Rapido/Uber bhi karta hai */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Yeh Normal Process Hai</Text>
        <Text style={styles.infoText}>
          Rapido, Uber, Ola — sab apps mein yahi hota hai.{'\n'}
          Passengers ki safety ke liye documents verify karna zaroori hai.
        </Text>
      </View>

      {/* Check Status Button */}
      <TouchableOpacity
        style={[styles.checkBtn, checking && { opacity: 0.6 }]}
        onPress={checkStatus}
        disabled={checking}
      >
        {checking
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.checkBtnText}>🔄 Status Check Karo</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Doosre account se login karo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1a3a5c', paddingBottom: 40 },
  hero: { alignItems: 'center', paddingTop: 80, paddingBottom: 32, paddingHorizontal: 24 },
  heroEmoji: { fontSize: 80, marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 10 },
  heroSub: { fontSize: 15, color: '#adc6e0', textAlign: 'center', lineHeight: 22 },

  statusCard: { backgroundColor: '#fff', margin: 20, borderRadius: 20, padding: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  statusDot: { width: 16, height: 16, borderRadius: 8, marginRight: 14, marginTop: 3 },
  dotDone:    { backgroundColor: '#27ae60' },
  dotPending: { backgroundColor: '#F5A623' },
  dotWaiting: { backgroundColor: '#ddd' },
  statusLine: { width: 2, height: 20, backgroundColor: '#eee', marginLeft: 7, marginVertical: 2 },
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 15, fontWeight: '800', color: '#1a1a2e', marginBottom: 3 },
  statusDesc: { fontSize: 13, color: '#888' },

  infoCard: { backgroundColor: 'rgba(255,255,255,0.08)', margin: 20, marginTop: 0, borderRadius: 16, padding: 16 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#F5A623', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#adc6e0', lineHeight: 20 },
  infoHighlight: { color: '#F5A623', fontWeight: '800' },

  checkBtn: { backgroundColor: '#F5A623', margin: 20, marginTop: 8, borderRadius: 16, padding: 18, alignItems: 'center', elevation: 4 },
  checkBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  logoutBtn: { alignItems: 'center', padding: 16 },
  logoutText: { color: '#adc6e0', fontSize: 14 },
});
