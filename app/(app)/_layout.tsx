import { Colors, Radius, Shadows } from "@/constants/theme";
import { Navbar } from "@/src/components/Navbar";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function TabIcon({
  name,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  focused: boolean;
}) {
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
      <Ionicons
        name={name}
        color={focused ? Colors.onPrimary : Colors.outline}
        size={22}
      />
    </View>
  );
}

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: () => <Navbar />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.outline,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="game-controller" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="podium" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    ...Shadows.nav,
  },
  tabBarItem: {
    height: 64,
    justifyContent: "center",
  },
  tabIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapperActive: {
    backgroundColor: Colors.primary,
  },
});
