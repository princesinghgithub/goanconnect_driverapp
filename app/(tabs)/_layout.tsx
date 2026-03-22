// import { Ionicons } from '@expo/vector-icons';
// import { Tabs } from 'expo-router';

// export default function TabLayout() {
//   return (
//     <Tabs screenOptions={{
//       headerShown: false,
//       tabBarActiveTintColor: '#F5A623',
//       tabBarInactiveTintColor: '#aaa',
//       tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 8, paddingTop: 6 },
//       tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
//     }}>
//       <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
//       <Tabs.Screen name="earnings" options={{ title: 'Kamai', tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} /> }} />
//       <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
//     </Tabs>
//   );
// }

// import { Ionicons } from '@expo/vector-icons';
// import { Tabs } from 'expo-router';

// export default function TabLayout() {
//   return (
//     <Tabs screenOptions={{
//       headerShown: false,
//       tabBarActiveTintColor: '#F5A623',
//       tabBarInactiveTintColor: '#aaa',
//       tabBarStyle: {
//         backgroundColor: '#fff',
//         borderTopWidth: 1,
//         borderTopColor: '#f0f0f0',
//         height: 62,
//         paddingBottom: 8,
//         paddingTop: 6,
//         elevation: 12,
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 12,
//       },
//       tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
//     }}>
//       <Tabs.Screen name="home" options={{
//         title: 'Home',
//         tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
//       }} />
//       <Tabs.Screen name="earnings" options={{
//         title: 'Kamai',
//         tabBarIcon: ({ color, size }) => <Ionicons name="wallet" size={size} color={color} />,
//       }} />
//       <Tabs.Screen name="profile" options={{
//         title: 'Profile',
//         tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
//       }} />
//     </Tabs>
//   );
// }

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F5A623",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingBottom: 8,
          paddingTop: 6,
          height: 62,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {/* ✅ NAYA TAB — Upcoming Rides */}
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Kamai",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden tabs — tab bar mein nahi dikhenge */}
      <Tabs.Screen name="ratings" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="vehicle" options={{ href: null }} />
      <Tabs.Screen name="help" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
    </Tabs>
  );
}
