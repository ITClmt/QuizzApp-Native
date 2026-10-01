import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Navbar } from "@/src/components/Navbar";
import { useAuth } from "@/src/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabIcon({
  name,
  focused,
}: {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  focused: boolean;
}) {
  return (
    <View
      style={[styles.tabIconWrapper, focused && styles.tabIconWrapperActive]}
    >
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
  const { t } = useTranslation("common");
  const insets = useSafeAreaInsets();

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

  // La barre n'est PAS en position absolue : les écrans s'arrêtent au-dessus
  // d'elle d'eux-mêmes, sans paddingBottom à recalculer écran par écran.
  // Sa marge laisse voir ce conteneur, d'où le fond = bas du dégradé.
  return (
    <View style={styles.tabsRoot}>
      <Tabs
        // L'inset bas (home indicator) passe dans la marge sous la pilule au
        // lieu d'être ajouté en padding dans ses 60px, ce qui écrasait les icônes.
        safeAreaInsets={{ bottom: 0 }}
        screenOptions={{
          header: () => <Navbar />,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.outline,
          tabBarStyle: [
            styles.tabBar,
            { marginBottom: Spacing.lg + insets.bottom },
          ],
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("pageTitles.home"),
            tabBarIcon: ({ focused }) => (
              <TabIcon name="sports-esports" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: t("pageTitles.leaderboard"),
            tabBarIcon: ({ focused }) => (
              <TabIcon name="leaderboard" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("pageTitles.profile"),
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t("pageTitles.settings"),
            tabBarIcon: ({ focused }) => (
              <TabIcon name="settings" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="avatars"
          options={{ title: t("pageTitles.avatars"), href: null }}
        />
        <Tabs.Screen
          name="history/[id]"
          options={{ title: t("pageTitles.history"), href: null }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsRoot: {
    flex: 1,
    backgroundColor: Colors.skyGradient[Colors.skyGradient.length - 1],
  },
  tabBar: {
    marginHorizontal: Spacing.lg,
    height: 60,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    borderRadius: Radius.xl,
    ...Shadows.nav,
  },
  tabBarItem: {
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
