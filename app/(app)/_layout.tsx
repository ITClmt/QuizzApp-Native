import { Colors, Radius, Shadows } from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Navbar } from "@/src/components/Navbar";
import { useAuth } from "@/src/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function TabIcon({
  name,
  focused,
}: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  focused: boolean;
}) {
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}>
      <MaterialIcons
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
      <GradientBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </GradientBackground>
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
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="sports-esports" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="leaderboard" focused={focused} />
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
      <Tabs.Screen name="avatars" options={{ title: "Avatars", href: null }} />
      <Tabs.Screen
        name="history/[id]"
        options={{ title: "History", href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    height: 80,
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    ...Shadows.nav,
  },
  tabBarItem: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarIcon: {
    marginTop: "auto",
    marginBottom: "auto",
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
