import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SECTIONS = [
  {
    icon: '📋',
    title: 'Kaunsi Information Collect Hoti Hai',
    content: `Hum yeh information collect karte hain:

• Aapka naam, email, phone number
• Vehicle details (type, number, model)
• Documents (license, RC, Aadhaar, insurance)
• GPS location — sirf tab jab aap online hote hain
• Ride history aur earnings data
• Device ID aur app version`
  },
  {
    icon: '🎯',
    title: 'Information Ka Use Kaise Hota Hai',
    content: `Aapki information ka use in kamon ke liye hota hai:

• Ride requests match karne ke liye
• Payment process karne ke liye
• Account verify karne ke liye
• Support provide karne ke liye
• App improve karne ke liye
• Fraud se bachane ke liye`
  },
  {
    icon: '📍',
    title: 'Location Data',
    content: `Location ke baare mein:

• Aapki GPS location sirf tab collect hoti hai jab aap ONLINE hote hain
• Offline hone ke baad location tracking band ho jaati hai
• Location data customers ko ride track karne ke liye share hota hai
• Location history 30 din baad delete ho jaati hai`
  },
  {
    icon: '🔒',
    title: 'Data Security',
    content: `Hum aapka data safe rakhte hain:

• Saara data encrypted servers pe store hota hai
• Passwords kabhi plain text mein store nahi hote
• Documents sirf admin aur aap dekh sakte hain
• Regular security audits hote hain
• Koi bhi third party ko data nahi becha jaata`
  },
  {
    icon: '🤝',
    title: 'Data Sharing',
    content: `Kab data share hota hai:

• Customer ko: Aapka naam, vehicle, phone (sirf ride ke waqt)
• Admin ko: Saara account data verification ke liye
• Government: Agar legally required ho
• Kabhi bhi advertisers ko data share nahi hota
• Kabhi bhi data nahi becha jaata`
  },
  {
    icon: '🗑️',
    title: 'Data Delete Karna',
    content: `Aap apna data delete kar sakte hain:

• Account delete karne ke liye support se contact karo
• Account delete hone ke 30 din baad saara data permanently delete ho jaata hai
• Ride history 2 saal tak legal reasons ke liye rakhi jaati hai
• Email: support@gaonconnect.in pe request bhejo`
  },
  {
    icon: '👶',
    title: 'Bachon Ki Privacy',
    content: `Hum 18 saal se kam umra ke logon ka data collect nahi karte. Agar koi minor hamari service use karta hai toh please humse contact karo.`
  },
  {
    icon: '🔄',
    title: 'Policy Changes',
    content: `Agar privacy policy mein koi badlaav aata hai toh:

• Aapko email pe notification milegi
• App mein notification aayega
• Changes apply hone se 7 din pehle bataya jayega`
  },
  {
    icon: '📞',
    title: 'Contact Karo',
    content: `Koi sawaal hai toh:

• Email: privacy@gaonconnect.in
• Phone: +91 12345 67890
• Address: GaonConnect Pvt. Ltd., Rewa, MP - 486001`
  },
];

export default function PrivacyScreen() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🛡️ Privacy Policy</Text>
          <Text style={styles.headerSub}>Last updated: March 2026</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            GaonConnect mein aapka swagat hai! Hum aapki privacy ko bahut seriously lete hain.
            Yeh policy batati hai ki hum aapka data kaise collect, use aur protect karte hain.
          </Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((sec, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.section, openIdx === i && styles.sectionOpen]}
            onPress={() => setOpenIdx(openIdx === i ? null : i)}
            activeOpacity={0.8}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{sec.icon}</Text>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              <Ionicons
                name={openIdx === i ? 'chevron-up' : 'chevron-down'}
                size={18} color={openIdx === i ? '#F5A623' : '#aaa'} />
            </View>
            {openIdx === i && (
              <Text style={styles.sectionContent}>{sec.content}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 GaonConnect Pvt. Ltd.{'\n'}
            Sabhi adhikar surakshit hain.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14 },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 12, color: '#adc6e0', marginTop: 3 },
  introCard: { backgroundColor: '#1a3a5c', borderRadius: 18, padding: 18, marginBottom: 16 },
  introText: { fontSize: 14, color: '#adc6e0', lineHeight: 22 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, elevation: 1 },
  sectionOpen: { borderWidth: 1.5, borderColor: '#F5A623' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIcon: { fontSize: 22 },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: '#1a1a2e' },
  sectionContent: { fontSize: 13, color: '#555', lineHeight: 22, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  footer: { alignItems: 'center', paddingTop: 20 },
  footerText: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 20 },
});
