import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VehicleScreen() {
  const [driver, setDriver]     = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [model, setModel]       = useState('');
  const [color, setColor]       = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const res = await window.fetch(`${API_BASE_URL}/provider/profile/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const v = data?.data?.vehicle || {};
      setDriver(data?.data);
      setModel(v.model || '');
      setColor(v.color || '');
    } catch (e) {} finally { setLoading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const res = await window.fetch(`${API_BASE_URL}/provider/profile/update`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleModel: model, vehicleColor: color }),
      });
      const data = await res.json();
      if (data?.success) { Alert.alert('✅ Saved!', 'Vehicle details update ho gayi'); router.back(); }
      else Alert.alert('Error', data?.message);
    } catch (e) { Alert.alert('Error', 'Save nahi hua'); }
    finally { setSaving(false); }
  };

  const VEMOJI: any = { bike: '🏍️', auto: '🛺', car: '🚗', tractor: '🚜', tempo: '🚐', truck: '🚛', jcb: '🚧' };
  const v = driver?.vehicle || {};

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#F5A623" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backTxt}>← Back</Text></TouchableOpacity>
        <Text style={styles.heroEmoji}>{VEMOJI[v.type] || '🚗'}</Text>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
      </View>

      <View style={{ padding: 16 }}>
        {/* Read only fields */}
        {[
          { label: 'Vehicle Type', value: v.type?.toUpperCase() || 'N/A' },
          { label: 'Vehicle Number', value: v.number || 'N/A' },
        ].map((item, i) => (
          <View key={i} style={styles.readCard}>
            <Text style={styles.readLabel}>{item.label}</Text>
            <Text style={styles.readValue}>{item.value}</Text>
            <Text style={styles.readNote}>🔒 Yeh change nahi ho sakta</Text>
          </View>
        ))}

        {/* Editable fields */}
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>✏️ Edit Karo</Text>
          <Text style={styles.label}>Vehicle Model</Text>
          <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="e.g. Honda Activa, Bajaj Auto" placeholderTextColor="#bbb" />
          <Text style={styles.label}>Vehicle Color</Text>
          <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="e.g. Red, Black, White" placeholderTextColor="#bbb" />
          <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={save} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>💾 Save Karo</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20, alignItems: 'center' },
  back: { alignSelf: 'flex-start', marginBottom: 12 },
  backTxt: { color: '#adc6e0', fontSize: 14 },
  heroEmoji: { fontSize: 64, marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  readCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, elevation: 1 },
  readLabel: { fontSize: 12, color: '#aaa', fontWeight: '700', marginBottom: 4 },
  readValue: { fontSize: 20, fontWeight: '900', color: '#1a1a2e', marginBottom: 4 },
  readNote: { fontSize: 11, color: '#bbb' },
  editCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, elevation: 1 },
  editTitle: { fontSize: 14, fontWeight: '800', color: '#1a3a5c', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, fontSize: 15, color: '#1a1a2e', borderWidth: 1.5, borderColor: '#eee', marginBottom: 16 },
  saveBtn: { backgroundColor: '#F5A623', borderRadius: 14, padding: 16, alignItems: 'center' },
  saveTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
