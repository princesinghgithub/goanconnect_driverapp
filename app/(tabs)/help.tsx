import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAQS = [
  { q: 'Ride request nahi aa raha?', a: 'Online ho jao aur internet connection check karo. Ride request radius mein ho toh milega.' },
  { q: 'Payment kaise milegi?', a: 'Cash rides — seedha customer se lo. Online rides — wallet mein aayega, phir bank mein transfer.' },
  { q: 'Rating kaise badhaye?', a: 'Samay pe pahuncho, gaadi saaf rakho, customer se achhe se baat karo.' },
  { q: 'Ride cancel kaise kare?', a: 'Active ride screen pe Cancel button hai. Zyada cancel karne se acceptance rate girta hai.' },
  { q: 'Account approve nahi hua?', a: 'Documents sahi se upload karo. 24-48 ghante mein admin review karta hai.' },
  { q: 'OTP nahi mila?', a: 'Email check karo. Dev mode mein OTP screen pe hi dikhta hai.' },
];

export default function HelpScreen() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backTxt}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>🆘 Help & Support</Text>
        <Text style={styles.headerSub}>Hum aapki madad ke liye hain</Text>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Humse Sampark Karo</Text>
        {[
          { icon: 'call',          label: 'Call Support',    sub: '10am - 6pm',    color: '#27ae60', onPress: () => Linking.openURL('tel:+9162601332613') },
          { icon: 'logo-whatsapp', label: 'WhatsApp',        sub: 'Quick reply',   color: '#25D366', onPress: () => Linking.openURL('https://wa.me/916260132613') },
          { icon: 'mail',          label: 'Email Support',   sub: 'support@gaonconnect.in', color: '#3498db', onPress: () => Linking.openURL('mailto:support@gaonconnect.in') },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.contactCard} onPress={item.onPress}>
            <View style={[styles.contactIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{item.label}</Text>
              <Text style={styles.contactSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Aksar Puche Jane Wale Sawaal</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity key={i} style={styles.faqCard} onPress={() => setOpenIdx(openIdx === i ? null : i)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Ionicons name={openIdx === i ? 'chevron-up' : 'chevron-down'} size={18} color="#aaa" />
            </View>
            {openIdx === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#1a3a5c', paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20 },
  back: { marginBottom: 12 },
  backTxt: { color: '#adc6e0', fontSize: 14 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  headerSub: { fontSize: 13, color: '#adc6e0', marginTop: 4 },
  section: { margin: 16, marginBottom: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1a3a5c', marginBottom: 12 },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, elevation: 1, gap: 14 },
  contactIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  contactSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
  faqCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 8, elevation: 1 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1a1a2e', paddingRight: 8 },
  faqA: { fontSize: 13, color: '#666', marginTop: 10, lineHeight: 20 },
});
