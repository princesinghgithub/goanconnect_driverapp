// import { API_BASE_URL, SOCKET_URL } from "@/constants/config";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import * as Location from "expo-location";
// import { router, useLocalSearchParams } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Linking,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { io } from "socket.io-client";

// type Step = "pickup" | "otp" | "riding" | "done";

// export default function ActiveRideScreen() {
//   const p = useLocalSearchParams<{
//     rideId: string;
//     customerName: string;
//     customerPhone: string;
//     pickupAddress: string;
//     dropAddress: string;
//     fare: string;
//     distance: string;
//     otp: string;
//   }>();

//   const [step, setStep] = useState<Step>("pickup");
//   const [otpInput, setOtpInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const socketRef = useRef<any>(null);
//   const locationRef = useRef<any>(null);

//   const token = async () => (await AsyncStorage.getItem("driverToken")) || "";

//   useEffect(() => {
//     connectSocket();
//     return () => {
//       socketRef.current?.disconnect();
//       if (locationRef.current) locationRef.current.remove();
//     };
//   }, []);

//   // ── Socket connect ───────────────────────────────────────────────
//   const connectSocket = async () => {
//     const driverData = await AsyncStorage.getItem("driverData");
//     const d = driverData ? JSON.parse(driverData) : null;
//     const providerId = d?._id || d?.id;

//     const socket = io(SOCKET_URL, { transports: ["websocket"] });
//     socket.on("connect", () => {
//       console.log("Active ride socket connected");
//       if (providerId) socket.emit("driverOnline", { driverId: providerId });
//     });
//     socketRef.current = socket;
//   };

//   // ── Start sending location ───────────────────────────────────────
//   const startLocationTracking = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") return;

//     locationRef.current = await Location.watchPositionAsync(
//       {
//         accuracy: Location.Accuracy.High,
//         timeInterval: 3000,
//         distanceInterval: 10,
//       },
//       (loc) => {
//         const { latitude, longitude } = loc.coords;
//         socketRef.current?.emit("driverLocation", {
//           bookingId: p.rideId,
//           driverId: p.rideId,
//           lat: latitude,
//           lng: longitude,
//           rideId: p.rideId,
//         });
//       },
//     );
//   };

//   const stopLocationTracking = () => {
//     if (locationRef.current) {
//       locationRef.current.remove();
//       locationRef.current = null;
//     }
//   };

//   // ── Status update ────────────────────────────────────────────────
//   const updateStatus = async (status: string, nextStep: Step) => {
//     setLoading(true);
//     try {
//       await axios.put(
//         `${API_BASE_URL}/ride/status`,
//         { rideId: p.rideId, status },
//         { headers: { Authorization: `Bearer ${await token()}` } },
//       );
//       setStep(nextStep);
//       if (status === "started") startLocationTracking();
//       if (status === "completed") stopLocationTracking();
//     } catch (e: any) {
//       Alert.alert("Error", e?.response?.data?.message || "Update nahi hua");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── OTP verify ──────────────────────────────────────────────────
//   const verifyOtp = async () => {
//     if (otpInput.length < 4) {
//       Alert.alert("OTP Daalo", "Customer ka OTP enter karo");
//       return;
//     }
//     setLoading(true);
//     try {
//       await axios.post(
//         `${API_BASE_URL}/ride/verify-otp`,
//         { rideId: p.rideId, otp: otpInput },
//         { headers: { Authorization: `Bearer ${await token()}` } },
//       );
//       setStep("riding");
//       startLocationTracking(); // ← location tracking shuru
//     } catch (e: any) {
//       Alert.alert("Galat OTP", e?.response?.data?.message || "OTP sahi nahi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Complete ride ────────────────────────────────────────────────
//   const completeRide = async () => {
//     Alert.alert("Ride Complete?", "Kya aap destination pe pahunch gaye?", [
//       { text: "Nahi", style: "cancel" },
//       {
//         text: "Haan, Complete Karo",
//         onPress: async () => {
//           setLoading(true);
//           try {
//             await axios.put(
//               `${API_BASE_URL}/ride/status`,
//               { rideId: p.rideId, status: "completed" },
//               { headers: { Authorization: `Bearer ${await token()}` } },
//             );
//             stopLocationTracking();
//             setStep("done");
//             setTimeout(() => router.replace("/(tabs)/home"), 3000);
//           } catch (e: any) {
//             Alert.alert(
//               "Error",
//               e?.response?.data?.message || "Complete nahi hua",
//             );
//           } finally {
//             setLoading(false);
//           }
//         },
//       },
//     ]);
//   };

//   const STEPS = ["pickup", "otp", "riding", "done"];
//   const stepIdx = STEPS.indexOf(step);
//   const STEP_LABELS = [
//     "Pickup Pe Jao",
//     "OTP Verify",
//     "Ride Chal Rahi",
//     "Complete!",
//   ];
//   const STEP_COLORS: any = {
//     pickup: "#9b59b6",
//     otp: "#3498db",
//     riding: "#F5A623",
//     done: "#27ae60",
//   };

//   if (step === "done") {
//     return (
//       <View style={styles.doneScreen}>
//         <StatusBar style="light" />
//         <Text style={styles.doneEmoji}>🎉</Text>
//         <Text style={styles.doneTitle}>Ride Complete!</Text>
//         <Text style={styles.doneFare}>₹{p.fare}</Text>
//         <Text style={styles.doneSub}>
//           Kamai ho gayi! Home pe ja rahe hain...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
//       <View style={[styles.header, { backgroundColor: STEP_COLORS[step] }]}>
//         <Text style={styles.headerTitle}>{STEP_LABELS[stepIdx]}</Text>
//         <View style={styles.progressBar}>
//           {STEPS.slice(0, -1).map((_, i) => (
//             <View
//               key={i}
//               style={[
//                 styles.progressSeg,
//                 {
//                   backgroundColor:
//                     i < stepIdx ? "#fff" : "rgba(255,255,255,0.3)",
//                 },
//               ]}
//             />
//           ))}
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
//         {/* Customer Card */}
//         <View style={styles.card}>
//           <View style={styles.customerRow}>
//             <View style={styles.cusAvatar}>
//               <Text style={styles.cusAvatarTxt}>
//                 {(p.customerName || "C").charAt(0).toUpperCase()}
//               </Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.cusName}>{p.customerName || "Customer"}</Text>
//               <Text style={styles.cusPhone}>{p.customerPhone || "N/A"}</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.callBtn}
//               onPress={() =>
//                 p.customerPhone && Linking.openURL(`tel:${p.customerPhone}`)
//               }
//             >
//               <Ionicons name="call" size={20} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.callBtn,
//                 { backgroundColor: "#25D366", marginLeft: 8 },
//               ]}
//               onPress={() =>
//                 p.customerPhone &&
//                 Linking.openURL(`https://wa.me/91${p.customerPhone}`)
//               }
//             >
//               <Ionicons name="logo-whatsapp" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Route Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardHead}>🗺️ ROUTE</Text>
//           <View style={styles.routeItem}>
//             <View style={[styles.routeDot, { backgroundColor: "#27ae60" }]} />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.routeTag}>PICKUP</Text>
//               <Text style={styles.routeAddr}>{p.pickupAddress || "—"}</Text>
//             </View>
//           </View>
//           <View style={styles.routeLine} />
//           <View style={styles.routeItem}>
//             <View style={[styles.routeDot, { backgroundColor: "#e74c3c" }]} />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.routeTag}>DROP</Text>
//               <Text style={styles.routeAddr}>{p.dropAddress || "—"}</Text>
//             </View>
//           </View>
//           <View style={styles.rideMetaRow}>
//             <View style={styles.rideMeta}>
//               <Text style={styles.rideMetaVal}>
//                 📍 {parseFloat(p.distance || "0").toFixed(1)} km
//               </Text>
//             </View>
//             <View style={[styles.rideMeta, { borderColor: "#F5A623" }]}>
//               <Text
//                 style={[
//                   styles.rideMetaVal,
//                   { color: "#F5A623", fontSize: 22, fontWeight: "900" },
//                 ]}
//               >
//                 ₹{p.fare}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Status Card */}
//         <View
//           style={[
//             styles.card,
//             {
//               backgroundColor: STEP_COLORS[step] + "15",
//               borderWidth: 1.5,
//               borderColor: STEP_COLORS[step],
//             },
//           ]}
//         >
//           <Text style={[styles.statusTxt, { color: STEP_COLORS[step] }]}>
//             {step === "pickup" &&
//               "📍 Pickup location pe jao aur customer ko pickup karo"}
//             {step === "otp" && "🔐 Customer se OTP lo aur verify karo"}
//             {step === "riding" &&
//               "🚗 Ride chal rahi hai — destination pe pahuncho"}
//           </Text>
//         </View>

//         {/* OTP Card */}
//         {step === "otp" && (
//           <View style={styles.card}>
//             <Text style={styles.cardHead}>🔐 OTP VERIFY KARO</Text>
//             <Text style={styles.otpHint}>Customer se 4-6 digit OTP lo</Text>
//             <View style={styles.otpRow}>
//               <TextInput
//                 style={styles.otpInput}
//                 placeholder="OTP daalo"
//                 placeholderTextColor="#bbb"
//                 value={otpInput}
//                 onChangeText={setOtpInput}
//                 keyboardType="number-pad"
//                 maxLength={6}
//               />
//               <TouchableOpacity
//                 style={[styles.otpBtn, loading && { opacity: 0.6 }]}
//                 onPress={verifyOtp}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.otpBtnTxt}>Verify</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       {/* Bottom Action */}
//       <View style={styles.bottomBar}>
//         {step === "pickup" && (
//           <TouchableOpacity
//             style={[
//               styles.actionBtn,
//               { backgroundColor: "#9b59b6" },
//               loading && { opacity: 0.6 },
//             ]}
//             onPress={() => updateStatus("arrived", "otp")}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="location" size={22} color="#fff" />
//                 <Text style={styles.actionBtnTxt}>Pickup Pe Pahunch Gaya</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//         {step === "otp" && (
//           <View style={styles.otpHintBar}>
//             <Ionicons name="lock-closed" size={18} color="#3498db" />
//             <Text style={styles.otpHintBarTxt}>
//               Upar OTP enter karke verify karo
//             </Text>
//           </View>
//         )}
//         {step === "riding" && (
//           <TouchableOpacity
//             style={[
//               styles.actionBtn,
//               { backgroundColor: "#27ae60" },
//               loading && { opacity: 0.6 },
//             ]}
//             onPress={completeRide}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="flag" size={22} color="#fff" />
//                 <Text style={styles.actionBtnTxt}>Ride Complete Karo</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f0f4f8" },
//   header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "900",
//     color: "#fff",
//     marginBottom: 14,
//   },
//   progressBar: { flexDirection: "row", gap: 6 },
//   progressSeg: { flex: 1, height: 4, borderRadius: 2 },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 2,
//   },
//   cardHead: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: "#aaa",
//     letterSpacing: 1,
//     marginBottom: 14,
//   },
//   customerRow: { flexDirection: "row", alignItems: "center" },
//   cusAvatar: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: "#1a3a5c",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },
//   cusAvatarTxt: { color: "#fff", fontWeight: "900", fontSize: 22 },
//   cusName: { fontSize: 17, fontWeight: "800", color: "#1a1a2e" },
//   cusPhone: { fontSize: 13, color: "#888", marginTop: 3 },
//   callBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "#27ae60",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   routeItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     paddingVertical: 5,
//   },
//   routeDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 12,
//     marginTop: 4,
//   },
//   routeTag: {
//     fontSize: 10,
//     fontWeight: "800",
//     color: "#aaa",
//     letterSpacing: 1,
//   },
//   routeAddr: {
//     fontSize: 14,
//     color: "#1a1a2e",
//     fontWeight: "600",
//     marginTop: 2,
//     lineHeight: 20,
//   },
//   routeLine: {
//     width: 1.5,
//     height: 18,
//     backgroundColor: "#eee",
//     marginLeft: 5,
//     marginVertical: 2,
//   },
//   rideMetaRow: { flexDirection: "row", gap: 10, marginTop: 14 },
//   rideMeta: {
//     flex: 1,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: "#eee",
//     padding: 12,
//     alignItems: "center",
//   },
//   rideMetaVal: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
//   statusTxt: {
//     fontSize: 14,
//     fontWeight: "700",
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   otpHint: { fontSize: 13, color: "#888", marginBottom: 14 },
//   otpRow: { flexDirection: "row", gap: 10 },
//   otpInput: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 14,
//     padding: 16,
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#1a1a2e",
//     textAlign: "center",
//     letterSpacing: 8,
//     borderWidth: 1.5,
//     borderColor: "#eee",
//   },
//   otpBtn: {
//     backgroundColor: "#3498db",
//     borderRadius: 14,
//     paddingHorizontal: 22,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   otpBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
//   bottomBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     elevation: 10,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 12,
//     borderRadius: 18,
//     padding: 18,
//     elevation: 4,
//   },
//   actionBtnTxt: { color: "#fff", fontWeight: "900", fontSize: 17 },
//   otpHintBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     padding: 16,
//     backgroundColor: "#eef6ff",
//     borderRadius: 14,
//   },
//   otpHintBarTxt: { color: "#3498db", fontWeight: "700", fontSize: 14 },
//   doneScreen: {
//     flex: 1,
//     backgroundColor: "#27ae60",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   doneEmoji: { fontSize: 100, marginBottom: 16 },
//   doneTitle: {
//     fontSize: 32,
//     fontWeight: "900",
//     color: "#fff",
//     marginBottom: 8,
//   },
//   doneFare: { fontSize: 56, fontWeight: "900", color: "#fff", marginBottom: 8 },
//   doneSub: { fontSize: 15, color: "rgba(255,255,255,0.8)" },
// });

import { API_BASE_URL, SOCKET_URL } from "@/constants/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";

type Step = "pickup" | "otp" | "riding" | "done";

export default function ActiveRideScreen() {
  const p = useLocalSearchParams<{
    rideId: string;
    customerName: string;
    customerPhone: string;
    pickupAddress: string;
    dropAddress: string;
    fare: string;
    distance: string;
    otp: string;
  }>();

  const [step, setStep] = useState<Step>("pickup");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<any>(null);
  const locationRef = useRef<any>(null);

  const token = async () => (await AsyncStorage.getItem("driverToken")) || "";

  useEffect(() => {
    connectSocket();
    return () => {
      socketRef.current?.disconnect();
      if (locationRef.current) locationRef.current.remove();
    };
  }, []);

  const connectSocket = async () => {
    const driverData = await AsyncStorage.getItem("driverData");
    const d = driverData ? JSON.parse(driverData) : null;
    const providerId = d?._id || d?.id;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.on("connect", () => {
      console.log("Active ride socket connected");
      if (providerId) socket.emit("driverOnline", { driverId: providerId });
    });
    socketRef.current = socket;
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    locationRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 10,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        socketRef.current?.emit("driverLocation", {
          bookingId: p.rideId,
          driverId: p.rideId,
          lat: latitude,
          lng: longitude,
          rideId: p.rideId,
        });
      },
    );
  };

  const stopLocationTracking = () => {
    if (locationRef.current) {
      locationRef.current.remove();
      locationRef.current = null;
    }
  };

  // ✅ Ride complete hone ke baad driver ONLINE rahe — status available karo
  const resetDriverToAvailable = async () => {
    try {
      const t = await token();
      await axios.put(
        `${API_BASE_URL}/provider/status`,
        { isOnline: true, status: "available" },
        { headers: { Authorization: `Bearer ${t}` } },
      );
      console.log("✅ Driver status: available (online)");
    } catch (e) {
      console.log("Driver status reset error:", e);
    }
  };

  const updateStatus = async (status: string, nextStep: Step) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/ride/status`,
        { rideId: p.rideId, status },
        { headers: { Authorization: `Bearer ${await token()}` } },
      );
      setStep(nextStep);
      if (status === "started") startLocationTracking();
      if (status === "completed") stopLocationTracking();
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Update nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otpInput.length < 4) {
      Alert.alert("OTP Daalo", "Customer ka OTP enter karo");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/ride/verify-otp`,
        { rideId: p.rideId, otp: otpInput },
        { headers: { Authorization: `Bearer ${await token()}` } },
      );
      setStep("riding");
      startLocationTracking();
    } catch (e: any) {
      Alert.alert("Galat OTP", e?.response?.data?.message || "OTP sahi nahi");
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async () => {
    Alert.alert("Ride Complete?", "Kya aap destination pe pahunch gaye?", [
      { text: "Nahi", style: "cancel" },
      {
        text: "Haan, Complete Karo",
        onPress: async () => {
          setLoading(true);
          try {
            // 1. Ride complete karo
            await axios.put(
              `${API_BASE_URL}/ride/status`,
              { rideId: p.rideId, status: "completed" },
              { headers: { Authorization: `Bearer ${await token()}` } },
            );

            // 2. Location tracking band karo
            stopLocationTracking();

            // ✅ 3. Driver ko ONLINE rakho — available status set karo
            await resetDriverToAvailable();

            // 4. Done screen dikhao
            setStep("done");

            // 5. 3 second baad home pe jao — driver online rahega
            setTimeout(() => router.replace("/(tabs)/home"), 3000);
          } catch (e: any) {
            Alert.alert(
              "Error",
              e?.response?.data?.message || "Complete nahi hua",
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const STEPS = ["pickup", "otp", "riding", "done"];
  const stepIdx = STEPS.indexOf(step);
  const STEP_LABELS = [
    "Pickup Pe Jao",
    "OTP Verify",
    "Ride Chal Rahi",
    "Complete!",
  ];
  const STEP_COLORS: any = {
    pickup: "#9b59b6",
    otp: "#3498db",
    riding: "#F5A623",
    done: "#27ae60",
  };

  if (step === "done") {
    return (
      <View style={styles.doneScreen}>
        <StatusBar style="light" />
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>Ride Complete!</Text>
        <Text style={styles.doneFare}>₹{p.fare}</Text>
        <Text style={styles.doneSub}>
          Kamai ho gayi! Aap online hain — agli ride ka intezaar karo 🚗
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { backgroundColor: STEP_COLORS[step] }]}>
        <Text style={styles.headerTitle}>{STEP_LABELS[stepIdx]}</Text>
        <View style={styles.progressBar}>
          {STEPS.slice(0, -1).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSeg,
                {
                  backgroundColor:
                    i < stepIdx ? "#fff" : "rgba(255,255,255,0.3)",
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Customer Card */}
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.cusAvatar}>
              <Text style={styles.cusAvatarTxt}>
                {(p.customerName || "C").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cusName}>{p.customerName || "Customer"}</Text>
              <Text style={styles.cusPhone}>{p.customerPhone || "N/A"}</Text>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() =>
                p.customerPhone && Linking.openURL(`tel:${p.customerPhone}`)
              }
            >
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.callBtn,
                { backgroundColor: "#25D366", marginLeft: 8 },
              ]}
              onPress={() =>
                p.customerPhone &&
                Linking.openURL(`https://wa.me/91${p.customerPhone}`)
              }
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Card */}
        <View style={styles.card}>
          <Text style={styles.cardHead}>🗺️ ROUTE</Text>
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, { backgroundColor: "#27ae60" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTag}>PICKUP</Text>
              <Text style={styles.routeAddr}>{p.pickupAddress || "—"}</Text>
            </View>
          </View>

          {/* Google Maps Button */}
          <TouchableOpacity
            style={styles.mapsBtn}
            onPress={() => {
              const url =
                step === "pickup"
                  ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.pickupAddress || "")}`
                  : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.dropAddress || "")}`;
              Linking.openURL(url);
            }}
          >
            <Ionicons name="navigate" size={16} color="#fff" />
            <Text style={styles.mapsBtnTxt}>
              {step === "pickup"
                ? "Pickup Navigate Karo"
                : "Drop Navigate Karo"}
            </Text>
          </TouchableOpacity>

          <View style={styles.routeLine} />
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, { backgroundColor: "#e74c3c" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeTag}>DROP</Text>
              <Text style={styles.routeAddr}>{p.dropAddress || "—"}</Text>
            </View>
          </View>
          <View style={styles.rideMetaRow}>
            <View style={styles.rideMeta}>
              <Text style={styles.rideMetaVal}>
                📍 {parseFloat(p.distance || "0").toFixed(1)} km
              </Text>
            </View>
            <View style={[styles.rideMeta, { borderColor: "#F5A623" }]}>
              <Text
                style={[
                  styles.rideMetaVal,
                  { color: "#F5A623", fontSize: 22, fontWeight: "900" },
                ]}
              >
                ₹{p.fare}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: STEP_COLORS[step] + "15",
              borderWidth: 1.5,
              borderColor: STEP_COLORS[step],
            },
          ]}
        >
          <Text style={[styles.statusTxt, { color: STEP_COLORS[step] }]}>
            {step === "pickup" &&
              "📍 Pickup location pe jao aur customer ko pickup karo"}
            {step === "otp" && "🔐 Customer se OTP lo aur verify karo"}
            {step === "riding" &&
              "🚗 Ride chal rahi hai — destination pe pahuncho"}
          </Text>
        </View>

        {/* OTP Card */}
        {step === "otp" && (
          <View style={styles.card}>
            <Text style={styles.cardHead}>🔐 OTP VERIFY KARO</Text>
            <Text style={styles.otpHint}>Customer se 4-6 digit OTP lo</Text>
            <View style={styles.otpRow}>
              <TextInput
                style={styles.otpInput}
                placeholder="OTP daalo"
                placeholderTextColor="#bbb"
                value={otpInput}
                onChangeText={setOtpInput}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.otpBtn, loading && { opacity: 0.6 }]}
                onPress={verifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.otpBtnTxt}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        {step === "pickup" && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: "#9b59b6" },
              loading && { opacity: 0.6 },
            ]}
            onPress={() => updateStatus("arrived", "otp")}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="location" size={22} color="#fff" />
                <Text style={styles.actionBtnTxt}>Pickup Pe Pahunch Gaya</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        {step === "otp" && (
          <View style={styles.otpHintBar}>
            <Ionicons name="lock-closed" size={18} color="#3498db" />
            <Text style={styles.otpHintBarTxt}>
              Upar OTP enter karke verify karo
            </Text>
          </View>
        )}
        {step === "riding" && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: "#27ae60" },
              loading && { opacity: 0.6 },
            ]}
            onPress={completeRide}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="flag" size={22} color="#fff" />
                <Text style={styles.actionBtnTxt}>Ride Complete Karo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 14,
  },
  progressBar: { flexDirection: "row", gap: 6 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHead: {
    fontSize: 11,
    fontWeight: "800",
    color: "#aaa",
    letterSpacing: 1,
    marginBottom: 14,
  },
  customerRow: { flexDirection: "row", alignItems: "center" },
  cusAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1a3a5c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cusAvatarTxt: { color: "#fff", fontWeight: "900", fontSize: 22 },
  cusName: { fontSize: 17, fontWeight: "800", color: "#1a1a2e" },
  cusPhone: { fontSize: 13, color: "#888", marginTop: 3 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
  },
  mapsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a3a5c",
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    justifyContent: "center",
  },
  mapsBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },
  routeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  routeTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#aaa",
    letterSpacing: 1,
  },
  routeAddr: {
    fontSize: 14,
    color: "#1a1a2e",
    fontWeight: "600",
    marginTop: 2,
    lineHeight: 20,
  },
  routeLine: {
    width: 1.5,
    height: 18,
    backgroundColor: "#eee",
    marginLeft: 5,
    marginVertical: 2,
  },
  rideMetaRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  rideMeta: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#eee",
    padding: 12,
    alignItems: "center",
  },
  rideMetaVal: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
  statusTxt: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 22,
  },
  otpHint: { fontSize: 13, color: "#888", marginBottom: 14 },
  otpRow: { flexDirection: "row", gap: 10 },
  otpInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 16,
    fontSize: 22,
    fontWeight: "900",
    color: "#1a1a2e",
    textAlign: "center",
    letterSpacing: 8,
    borderWidth: 1.5,
    borderColor: "#eee",
  },
  otpBtn: {
    backgroundColor: "#3498db",
    borderRadius: 14,
    paddingHorizontal: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  otpBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },
  actionBtnTxt: { color: "#fff", fontWeight: "900", fontSize: 17 },
  otpHintBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    backgroundColor: "#eef6ff",
    borderRadius: 14,
  },
  otpHintBarTxt: { color: "#3498db", fontWeight: "700", fontSize: 14 },
  doneScreen: {
    flex: 1,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  doneEmoji: { fontSize: 100, marginBottom: 16 },
  doneTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  doneFare: { fontSize: 56, fontWeight: "900", color: "#fff", marginBottom: 8 },
  doneSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
});
