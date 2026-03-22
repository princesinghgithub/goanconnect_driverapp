import { API_BASE_URL } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const VEMOJI: any = {
  bike: "🏍️",
  auto: "🛺",
  car: "🚗",
  tractor: "🚜",
  jcb: "🚧",
  tempo: "🚐",
  truck: "🚛",
};

export default function UpcomingRidesScreen() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefresh] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("driverToken");
      const res = await fetch(`${API_BASE_URL}/ride/scheduled/driver`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRides(data?.data || []);
    } catch (e) {
      console.log("Fetch error:", e);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  // Time format — readable
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const timeStr = d.toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr2 = d.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "short",
    });

    // Kitne time mein hai
    let timeLeft = "";
    if (diff < 0) {
      timeLeft = "Time nikal gaya";
    } else if (hours < 1) {
      timeLeft = `${mins} minute mein`;
    } else if (hours < 24) {
      timeLeft = `${hours} ghante mein`;
    } else {
      const days = Math.floor(hours / 24);
      timeLeft = `${days} din mein`;
    }

    return {
      timeStr,
      dateStr: dateStr2,
      timeLeft,
      isUrgent: diff < 60 * 60 * 1000,
    };
  };

  const handleReadyForRide = (ride: any) => {
    const t = formatTime(ride.scheduledAt);
    Alert.alert(
      "🚜 Ride Ke Liye Taiyar Ho?",
      `${t.dateStr} ko ${t.timeStr} baje ke liye booking hai.\n\n${t.timeLeft} mein request aayegi.\n\nOnline raho — request automatically aayegi!`,
      [
        { text: "Theek Hai", style: "cancel" },
        {
          text: "Online Ho Jao →",
          onPress: () => router.push("/(tabs)/home"),
        },
      ],
    );
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Upcoming Bookings</Text>
        <Text style={styles.headerSub}>Aane wali scheduled rides</Text>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#1a3a5c" />
        <Text style={styles.infoTxt}>
          Request milne se 15 minute pehle{" "}
          <Text style={{ fontWeight: "800" }}>Online raho</Text> — request
          automatic aayegi!
        </Text>
      </View>

      <FlatList
        data={rides}
        keyExtractor={(i) => i._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefresh(true);
              fetchRides();
            }}
            colors={["#F5A623"]}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Koi Upcoming Booking Nahi</Text>
            <Text style={styles.emptySub}>
              Jab bhi koi aapki gaadi book karega{"\n"}yahan dikhegi
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const t = formatTime(item.scheduledAt);
          return (
            <View style={[styles.card, t.isUrgent && styles.cardUrgent]}>
              {/* Urgent badge */}
              {t.isUrgent && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentTxt}>
                    ⚡ 1 ghante mein — Online raho!
                  </Text>
                </View>
              )}

              {/* Top row */}
              <View style={styles.cardTop}>
                <Text style={styles.vEmoji}>
                  {VEMOJI[item.vehicleType] || "🚗"}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vType}>
                    {item.vehicleType?.toUpperCase()}
                  </Text>
                  <Text style={styles.customerName}>
                    👤 {item.customer?.name || "Customer"}
                  </Text>
                </View>
                <View style={styles.fareBox}>
                  <Text style={styles.fareAmt}>₹{item.fare}</Text>
                  <Text style={styles.fareLbl}>Fare</Text>
                </View>
              </View>

              {/* Time */}
              <View
                style={[styles.timeBadge, t.isUrgent && styles.timeBadgeUrgent]}
              >
                <Ionicons
                  name="time"
                  size={16}
                  color={t.isUrgent ? "#e74c3c" : "#1a3a5c"}
                />
                <Text
                  style={[styles.timeMain, t.isUrgent && { color: "#e74c3c" }]}
                >
                  {t.dateStr} — {t.timeStr} baje
                </Text>
                <Text
                  style={[styles.timeLeft, t.isUrgent && { color: "#e74c3c" }]}
                >
                  ({t.timeLeft})
                </Text>
              </View>

              {/* Route */}
              <View style={styles.routeBox}>
                <View style={styles.routeRow}>
                  <View style={[styles.dot, { backgroundColor: "#27ae60" }]} />
                  <Text style={styles.routeTxt} numberOfLines={1}>
                    {item.pickup?.address || "—"}
                  </Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routeRow}>
                  <View style={[styles.dot, { backgroundColor: "#e74c3c" }]} />
                  <Text style={styles.routeTxt} numberOfLines={1}>
                    {item.drop?.address || "—"}
                  </Text>
                </View>
              </View>

              {/* Note */}
              {item.scheduledNote ? (
                <View style={styles.noteBox}>
                  <Text style={styles.noteTxt}>📝 {item.scheduledNote}</Text>
                </View>
              ) : null}

              {/* Distance + Button */}
              <View style={styles.cardBottom}>
                <Text style={styles.distTxt}>
                  📍 {item.distance?.toFixed(1)} km
                </Text>
                <TouchableOpacity
                  style={styles.readyBtn}
                  onPress={() => handleReadyForRide(item)}
                >
                  <Text style={styles.readyBtnTxt}>Taiyari Karo →</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#1a3a5c",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#fff" },
  headerSub: { fontSize: 13, color: "#adc6e0", marginTop: 4 },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#e8f0fe",
    margin: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#b3cdf8",
  },
  infoTxt: { flex: 1, fontSize: 13, color: "#1a3a5c", lineHeight: 20 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "#eee",
  },
  cardUrgent: { borderColor: "#e74c3c", backgroundColor: "#fff9f9" },
  urgentBadge: {
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  urgentTxt: {
    fontSize: 13,
    color: "#e74c3c",
    fontWeight: "800",
    textAlign: "center",
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  vEmoji: { fontSize: 32, marginRight: 12 },
  vType: { fontSize: 15, fontWeight: "900", color: "#1a1a2e" },
  customerName: { fontSize: 13, color: "#666", marginTop: 2 },
  fareBox: { alignItems: "flex-end" },
  fareAmt: { fontSize: 22, fontWeight: "900", color: "#F5A623" },
  fareLbl: { fontSize: 11, color: "#aaa" },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  timeBadgeUrgent: { backgroundColor: "#fff0f0" },
  timeMain: { fontSize: 14, fontWeight: "800", color: "#1a3a5c" },
  timeLeft: { fontSize: 12, color: "#7a9bc4", marginLeft: 4 },
  routeBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  routeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  routeTxt: { flex: 1, fontSize: 13, color: "#444", fontWeight: "500" },
  routeLine: {
    width: 1,
    height: 10,
    backgroundColor: "#ddd",
    marginLeft: 3,
    marginVertical: 1,
  },
  noteBox: {
    backgroundColor: "#fffbea",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffe082",
  },
  noteTxt: { fontSize: 13, color: "#795548" },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  distTxt: { fontSize: 13, color: "#888" },
  readyBtn: {
    backgroundColor: "#1a3a5c",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  readyBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
