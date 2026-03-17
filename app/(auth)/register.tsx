// app/(auth)/register.tsx
import { API_BASE_URL } from '@/constants/config';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

const VEHICLE_TYPES = [
  { id: 'bike',    label: 'Bike',    emoji: '🏍️' },
  { id: 'auto',    label: 'Auto',    emoji: '🛺' },
  { id: 'car',     label: 'Car',     emoji: '🚗' },
  { id: 'tractor', label: 'Tractor', emoji: '🚜' },
];

const CITIES = ['Rewa', 'Mauganj', 'Hanumana', 'Sirmour', 'Teonthar', 'Mangawan', 'Naigarhi', 'Jawa'];

export default function RegisterScreen() {
  const [step, setStep]     = useState(1); // 1=Personal, 2=Vehicle, 3=Documents
  const [loading, setLoading] = useState(false);
  const [showCities, setShowCities] = useState(false);

  // Step 1 — Personal Info
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity]   = useState('');

  // Step 2 — Vehicle Info
  const [vehicleType, setVehicleType]     = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel]   = useState('');

  // Step 3 — Documents
  const [profilePhoto, setProfilePhoto]   = useState<any>(null);
  const [licensePhoto, setLicensePhoto]   = useState<any>(null);
  const [rcPhoto, setRcPhoto]             = useState<any>(null);

  const pickImage = async (setter: any) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, allowsEditing: true,
    });
    if (!res.canceled) setter(res.assets[0]);
  };

  const validateStep1 = () => {
    if (!name.trim())  { Alert.alert('Error', 'Naam daalo'); return false; }
    if (!email.trim() || !email.includes('@')) { Alert.alert('Error', 'Sahi email daalo'); return false; }
    if (!phone.trim() || phone.length < 10) { Alert.alert('Error', '10 digit phone daalo'); return false; }
    if (!city) { Alert.alert('Error', 'City chuniye'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!vehicleType)          { Alert.alert('Error', 'Vehicle type chuniye'); return false; }
    if (!vehicleNumber.trim()) { Alert.alert('Error', 'Vehicle number daalo'); return false; }
    if (!vehicleModel.trim())  { Alert.alert('Error', 'Vehicle model daalo'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!profilePhoto) { Alert.alert('Error', 'Profile photo lagao'); return; }
    if (!licensePhoto) { Alert.alert('Error', 'License photo lagao'); return; }
    if (!rcPhoto)      { Alert.alert('Error', 'RC photo lagao'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name',          name.trim());
      formData.append('email',         email.trim().toLowerCase());
      formData.append('phone',         phone.trim());
      formData.append('city',          city);
      formData.append('vehicleType',   vehicleType);
      formData.append('vehicleNumber', vehicleNumber.trim().toUpperCase());
      formData.append('vehicleModel',  vehicleModel.trim());

      // Photos append
      const appendPhoto = (field: string, photo: any) => {
        const ext = photo.uri.split('.').pop();
        formData.append(field, {
          uri:  photo.uri,
          name: `${field}.${ext}`,
          type: `image/${ext}`,
        } as any);
      };
      appendPhoto('profilePhoto', profilePhoto);
      appendPhoto('licensePhoto', licensePhoto);
      appendPhoto('rcPhoto',      rcPhoto);

      const res = await axios.post(`${API_BASE_URL}/provider/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        Alert.alert(
          'Registration Ho Gayi! 🎉',
          'Admin approve karega — phir login kar sakte ho',
          [{ text: 'Login Karo', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Registration fail hui');
    } finally { setLoading(false); }
  };

  const StepIndicator = () => (
    <View style={styles.stepRow}>
      {[1, 2, 3].map(s => (
        <View key={s} style={styles.stepItem}>
          <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
            <Text style={[styles.stepNum, step >= s && styles.stepNumActive]}>{s}</Text>
          </View>
          <Text style={[styles.stepLabel, step >= s && styles.stepLabelActive]}>
            {s === 1 ? 'Personal' : s === 2 ? 'Vehicle' : 'Documents'}
          </Text>
          {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Registration</Text>
        <Text style={styles.headerSub}>GaonConnect pe Driver bano</Text>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <StepIndicator />

        {/* ── STEP 1: Personal Info ── */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>👤 Personal Information</Text>

            <Text style={styles.label}>Poora Naam *</Text>
            <TextInput style={styles.input} placeholder="Aapka naam" placeholderTextColor="#bbb"
              value={name} onChangeText={setName} autoCapitalize="words" />

            <Text style={styles.label}>Email Address *</Text>
            <TextInput style={styles.input} placeholder="driver@email.com" placeholderTextColor="#bbb"
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.label}>Mobile Number *</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}><Text style={styles.countryText}>🇮🇳 +91</Text></View>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="9876543210"
                placeholderTextColor="#bbb" value={phone}
                onChangeText={v => setPhone(v.replace(/[^0-9]/g, '').slice(0, 10))}
                keyboardType="phone-pad" />
            </View>
            <View style={{ marginBottom: 16 }} />

            <Text style={styles.label}>Aapka Sheher *</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowCities(!showCities)}>
              <Text style={[styles.selectorText, !city && { color: '#bbb' }]}>{city || 'Sheher chuniye...'}</Text>
              <Text>{showCities ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {showCities && (
              <View style={styles.dropdown}>
                {CITIES.map(c => (
                  <TouchableOpacity key={c} style={[styles.dropItem, city === c && styles.dropItemActive]}
                    onPress={() => { setCity(c); setShowCities(false); }}>
                    <Text style={[styles.dropText, city === c && styles.dropTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={() => { if (validateStep1()) setStep(2); }}>
              <Text style={styles.nextBtnText}>Aage Jao →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLinkText}>Pehle se account hai? Login Karo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Vehicle Info ── */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>🚗 Vehicle Information</Text>

            <Text style={styles.label}>Vehicle Type *</Text>
            <View style={styles.vehicleGrid}>
              {VEHICLE_TYPES.map(v => (
                <TouchableOpacity key={v.id}
                  style={[styles.vehicleCard, vehicleType === v.id && styles.vehicleCardActive]}
                  onPress={() => setVehicleType(v.id)}>
                  <Text style={styles.vehicleEmoji}>{v.emoji}</Text>
                  <Text style={[styles.vehicleLabel, vehicleType === v.id && styles.vehicleLabelActive]}>{v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Vehicle Number *</Text>
            <TextInput style={styles.input} placeholder="MP 20 AB 1234" placeholderTextColor="#bbb"
              value={vehicleNumber} onChangeText={setVehicleNumber} autoCapitalize="characters" />

            <Text style={styles.label}>Vehicle Model *</Text>
            <TextInput style={styles.input} placeholder="e.g. Bajaj Auto, Honda Activa" placeholderTextColor="#bbb"
              value={vehicleModel} onChangeText={setVehicleModel} />

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>← Wapas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn2} onPress={() => { if (validateStep2()) setStep(3); }}>
                <Text style={styles.nextBtnText}>Aage Jao →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── STEP 3: Documents ── */}
        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>📄 Documents Upload Karo</Text>

            {[
              { label: 'Profile Photo *', state: profilePhoto, setter: setProfilePhoto, icon: '🤳' },
              { label: 'Driving License *', state: licensePhoto, setter: setLicensePhoto, icon: '📋' },
              { label: 'Vehicle RC *', state: rcPhoto, setter: setRcPhoto, icon: '📄' },
            ].map((doc, i) => (
              <View key={i} style={styles.docCard}>
                <Text style={styles.docLabel}>{doc.icon} {doc.label}</Text>
                {doc.state ? (
                  <View style={styles.docPreview}>
                    <Image source={{ uri: doc.state.uri }} style={styles.docImage} />
                    <TouchableOpacity style={styles.docChangeBtn} onPress={() => pickImage(doc.setter)}>
                      <Text style={styles.docChangeBtnText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.docUploadBtn} onPress={() => pickImage(doc.setter)}>
                    <Text style={styles.docUploadIcon}>📷</Text>
                    <Text style={styles.docUploadText}>Photo Select Karo</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                <Text style={styles.backBtnText}>← Wapas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.btnDisabled]}
                onPress={handleSubmit} disabled={loading}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.nextBtnText}>Register Karo 🚀</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  header: { paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 13, color: '#adc6e0', marginTop: 4 },
  form: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 16 },
  stepRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  stepItem: { alignItems: 'center', flexDirection: 'row' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: '#F5A623' },
  stepNum: { fontSize: 14, fontWeight: '800', color: '#aaa' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: '#aaa', marginLeft: 4, marginRight: 4 },
  stepLabelActive: { color: '#F5A623', fontWeight: '700' },
  stepLine: { width: 24, height: 2, backgroundColor: '#eee', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: '#F5A623' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a2e', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, fontSize: 15, color: '#1a1a2e', borderWidth: 1.5, borderColor: '#eee', marginBottom: 16 },
  phoneRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  countryCode: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: '#eee' },
  countryText: { fontSize: 15, fontWeight: '700' },
  selector: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  selectorText: { fontSize: 15, color: '#1a1a2e' },
  dropdown: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#eee', overflow: 'hidden', marginBottom: 16, elevation: 4 },
  dropItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  dropItemActive: { backgroundColor: '#fff8ee' },
  dropText: { fontSize: 15, color: '#1a1a2e' },
  dropTextActive: { color: '#F5A623', fontWeight: '800' },
  vehicleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  vehicleCard: { width: '47%', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 2, borderColor: '#eee', backgroundColor: '#f8f9fa' },
  vehicleCardActive: { borderColor: '#F5A623', backgroundColor: '#fff8ee' },
  vehicleEmoji: { fontSize: 32, marginBottom: 8 },
  vehicleLabel: { fontSize: 13, fontWeight: '700', color: '#555' },
  vehicleLabelActive: { color: '#F5A623' },
  nextBtn: { backgroundColor: '#F5A623', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, elevation: 3 },
  nextBtn2: { flex: 1, backgroundColor: '#F5A623', borderRadius: 14, padding: 16, alignItems: 'center', elevation: 3 },
  submitBtn: { flex: 1, backgroundColor: '#27ae60', borderRadius: 14, padding: 16, alignItems: 'center', elevation: 3 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  backBtn: { flex: 0.4, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: '#ddd' },
  backBtnText: { fontSize: 15, fontWeight: '700', color: '#888' },
  btnDisabled: { opacity: 0.6 },
  loginLink: { alignItems: 'center', padding: 16 },
  loginLinkText: { color: '#F5A623', fontWeight: '700', fontSize: 14 },
  docCard: { backgroundColor: '#f8f9fa', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#eee' },
  docLabel: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  docUploadBtn: { borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12, padding: 20, alignItems: 'center' },
  docUploadIcon: { fontSize: 32, marginBottom: 8 },
  docUploadText: { color: '#888', fontSize: 14 },
  docPreview: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docImage: { width: 70, height: 70, borderRadius: 10 },
  docChangeBtn: { backgroundColor: '#F5A623', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  docChangeBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
