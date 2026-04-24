import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#6366f1" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Quiz",
          tabBarIcon: ({ color }) => (
            <Ionicons name="game-controller" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
