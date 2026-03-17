// import { API_BASE_URL } from '@/constants/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function DocumentsScreen() {
//   const [docs, setDocs]       = useState<any>({});
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState('');

//   useEffect(() => { loadDocs(); }, []);

//   const loadDocs = async () => {
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const res = await window.fetch(`${API_BASE_URL}/provider/profile/me`, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       setDocs(data?.data?.documents || {});
//     } catch (e) {} finally { setLoading(false); }
//   };

//   const uploadDoc = async (type: string) => {
//     const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!perm.granted) { Alert.alert('Permission', 'Gallery access do'); return; }
//     const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
//     if (res.canceled) return;

//     setUploading(type);
//     try {
//       const token = await AsyncStorage.getItem('driverToken');
//       const formData = new FormData();
//       const ext = res.assets[0].uri.split('.').pop();
//       formData.append('document', { uri: res.assets[0].uri, name: `${type}.${ext}`, type: `image/${ext}` } as any);
//       formData.append('documentType', type);

//       const upload = await window.fetch(`${API_BASE_URL}/provider/documents/upload`, {
//         method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
//       });
//       const data = await upload.json();
//       if (data?.success) { Alert.alert('✅ Upload Ho Gaya!', 'Document upload successful'); loadDocs(); }
//       else Alert.alert('Error', data?.message || 'Upload fail hua');
//     } catch (e) { Alert.alert('Error', 'Upload nahi hua'); }
//     finally { setUploading(''); }
//   };

//   const DOC_LIST = [
//     { key: 'photo',   label: 'Profile Photo',   icon: '🤳', desc: 'Driver ki clear photo' },
//     { key: 'license', label: 'Driving License',  icon: '📋', desc: 'Valid driving license' },
//     { key: 'rc',      label: 'Vehicle RC',        icon: '📄', desc: 'Registration certificate' },
//     { key: 'insurance', label: 'Insurance',       icon: '🛡️', desc: 'Vehicle insurance' },
//     { key: 'aadhaar', label: 'Aadhaar Card',      icon: '🪪', desc: 'Govt ID proof' },
//   ];

//   if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#F5A623" /></View>;

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       <StatusBar style="light" />
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>📄 Mere Documents</Text>
//         <Text style={styles.headerSub}>Sare documents update rakho</Text>
//       </View>

//       <View style={{ padding: 16 }}>
//         {DOC_LIST.map(doc => {
//           const d = doc.key === 'license' ? docs.license : doc.key === 'rc' ? docs.rc :
//                    doc.key === 'insurance' ? docs.insurance : doc.key === 'aadhaar' ? docs.aadhaar : null;
//           const photoUrl = doc.key === 'photo' ? docs.photo : d?.photo;
//           const verified = d?.verified || false;
//           const isUploading = uploading === doc.key;

//           return (
//             <View key={doc.key} style={styles.docCard}>
//               <View style={styles.docHeader}>
//                 <Text style={styles.docIcon}>{doc.icon}</Text>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.docLabel}>{doc.label}</Text>
//                   <Text style={styles.docDesc}>{doc.desc}</Text>
//                 </View>
//                 {photoUrl
//                   ? <View style={[styles.badge, verified ? styles.badgeOk : styles.badgePending]}>
//                       <Text style={styles.badgeTxt}>{verified ? '✅ Verified' : '⏳ Pending'}</Text>
//                     </View>
//                   : <View style={[styles.badge, styles.badgeMissing]}>
//                       <Text style={styles.badgeTxt}>❌ Missing</Text>
//                     </View>
//                 }
//               </View>
//               {photoUrl
//                 ? <Image source={{ uri: `http://10.117.136.210:5000/${photoUrl}` }} style={styles.docImg} />
//                 : null
//               }
//               <TouchableOpacity style={[styles.uploadBtn, isUploading && { opacity: 0.6 }]}
//                 onPress={() => uploadDoc(doc.key)} disabled={isUploading || uploading !== ''}>
//                 {isUploading
//                   ? <ActivityIndicator color="#fff" size="small" />
//                   : <Text style={styles.uploadTxt}>{photoUrl ? '🔄 Update Karo' : '📷 Upload Karo'}</Text>
//                 }
//               </TouchableOpacity>
//             </View>
//           );
//         })}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f0f4f8' },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20 },
//   headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
//   headerSub: { fontSize: 13, color: '#adc6e0', marginTop: 4 },
//   docCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, elevation: 2 },
//   docHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   docIcon: { fontSize: 32, marginRight: 12 },
//   docLabel: { fontSize: 15, fontWeight: '800', color: '#1a1a2e' },
//   docDesc: { fontSize: 12, color: '#aaa', marginTop: 2 },
//   badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
//   badgeOk: { backgroundColor: '#e8f8f5' },
//   badgePending: { backgroundColor: '#fff8ee' },
//   badgeMissing: { backgroundColor: '#fef0f0' },
//   badgeTxt: { fontSize: 11, fontWeight: '700' },
//   docImg: { width: '100%', height: 140, borderRadius: 12, marginBottom: 12, backgroundColor: '#f0f0f0' },
//   uploadBtn: { backgroundColor: '#1a3a5c', borderRadius: 12, padding: 12, alignItems: 'center' },
//   uploadTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
// });


import { API_BASE_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DocumentsScreen() {
  const [docs, setDocs]       = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState('');

  useEffect(() => { loadDocs(); }, []);

  const loadDocs = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const res = await window.fetch(`${API_BASE_URL}/provider/profile/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDocs(data?.data?.documents || {});
    } catch (e) {} finally { setLoading(false); }
  };

  const uploadDoc = async (type: string) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission', 'Gallery access do'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaType.Images, quality: 0.8, allowsEditing: true });
    if (res.canceled) return;

    setUploading(type);
    try {
      const token = await AsyncStorage.getItem('driverToken');
      const formData = new FormData();
      const ext = res.assets[0].uri.split('.').pop();
      formData.append('document', { uri: res.assets[0].uri, name: `${type}.${ext}`, type: `image/${ext}` } as any);
      formData.append('documentType', type);

      const upload = await window.fetch(`${API_BASE_URL}/provider/documents/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      const data = await upload.json();
      if (data?.success) { Alert.alert('✅ Upload Ho Gaya!', 'Document upload successful'); loadDocs(); }
      else Alert.alert('Error', data?.message || 'Upload fail hua');
    } catch (e) { Alert.alert('Error', 'Upload nahi hua'); }
    finally { setUploading(''); }
  };

  const DOC_LIST = [
    { key: 'photo',   label: 'Profile Photo',   icon: '🤳', desc: 'Driver ki clear photo' },
    { key: 'license', label: 'Driving License',  icon: '📋', desc: 'Valid driving license' },
    { key: 'rc',      label: 'Vehicle RC',        icon: '📄', desc: 'Registration certificate' },
    { key: 'insurance', label: 'Insurance',       icon: '🛡️', desc: 'Vehicle insurance' },
    { key: 'aadhaar', label: 'Aadhaar Card',      icon: '🪪', desc: 'Govt ID proof' },
  ];

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#F5A623" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📄 Mere Documents</Text>
        <Text style={styles.headerSub}>Sare documents update rakho</Text>
      </View>

      <View style={{ padding: 16 }}>
        {DOC_LIST.map(doc => {
          const d = doc.key === 'license' ? docs.license : doc.key === 'rc' ? docs.rc :
                   doc.key === 'insurance' ? docs.insurance : doc.key === 'aadhaar' ? docs.aadhaar : null;
          const photoUrl = doc.key === 'photo' ? docs.photo : d?.photo;
          const verified = d?.verified || false;
          const isUploading = uploading === doc.key;

          return (
            <View key={doc.key} style={styles.docCard}>
              <View style={styles.docHeader}>
                <Text style={styles.docIcon}>{doc.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docLabel}>{doc.label}</Text>
                  <Text style={styles.docDesc}>{doc.desc}</Text>
                </View>
                {photoUrl
                  ? <View style={[styles.badge, verified ? styles.badgeOk : styles.badgePending]}>
                      <Text style={styles.badgeTxt}>{verified ? '✅ Verified' : '⏳ Pending'}</Text>
                    </View>
                  : <View style={[styles.badge, styles.badgeMissing]}>
                      <Text style={styles.badgeTxt}>❌ Missing</Text>
                    </View>
                }
              </View>
              {photoUrl
                ? <Image source={{ uri: `http://10.117.136.210:5000/${photoUrl}` }} style={styles.docImg} />
                : null
              }
              <TouchableOpacity style={[styles.uploadBtn, isUploading && { opacity: 0.6 }]}
                onPress={() => uploadDoc(doc.key)} disabled={isUploading || uploading !== ''}>
                {isUploading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.uploadTxt}>{photoUrl ? '🔄 Update Karo' : '📷 Upload Karo'}</Text>
                }
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 13, color: '#adc6e0', marginTop: 4 },
  docCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, elevation: 2 },
  docHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  docIcon: { fontSize: 32, marginRight: 12 },
  docLabel: { fontSize: 15, fontWeight: '800', color: '#1a1a2e' },
  docDesc: { fontSize: 12, color: '#aaa', marginTop: 2 },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeOk: { backgroundColor: '#e8f8f5' },
  badgePending: { backgroundColor: '#fff8ee' },
  badgeMissing: { backgroundColor: '#fef0f0' },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  docImg: { width: '100%', height: 140, borderRadius: 12, marginBottom: 12, backgroundColor: '#f0f0f0' },
  uploadBtn: { backgroundColor: '#1a3a5c', borderRadius: 12, padding: 12, alignItems: 'center' },
  uploadTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
