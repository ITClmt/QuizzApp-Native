import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useAlert } from "@/src/contexts/AlertContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProfile } from "@/src/hooks/useProfile";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import {
  getAvatarsRequest,
  updateUserRequest,
} from "@/src/services/users/users.api";
import type { AvatarCatalogEntry, UserProfile } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AvatarPickerScreen() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const profile = useProfile();
  const queryClient = useQueryClient();
  const { t } = useTranslation("profile");

  const currentSlug = profile?.avatarSlug ?? user?.avatarSlug;

  const {
    data: avatars,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAvatarsRequest,
    refetchOnWindowFocus: false,
  });

  // On reste sur l'écran après un choix : la sélection est appliquée localement
  // tout de suite (cache ["profile"], donc la Navbar suit aussi), puis confirmée
  // par le serveur. En cas d'échec on remet l'avatar précédent.
  const { mutate: selectAvatar, isPending } = useMutation({
    mutationFn: (slug: string) =>
      updateUserRequest(user?.sub as string, { avatarSlug: slug }),
    onMutate: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      const previous = queryClient.getQueryData<UserProfile>(["profile"]);

      queryClient.setQueryData<UserProfile>(["profile"], (old) =>
        old ? { ...old, avatarSlug: slug } : old,
      );

      return { previous };
    },
    onError: (error, _slug, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["profile"], context.previous);
      }

      showAlert(
        t("avatars.updateErrorTitle"),
        error instanceof ApiError
          ? getErrorMessage(error)
          : t("avatars.updateError"),
      );
    },
    // Le JWT porte encore l'ancien slug : c'est /auth/profile qui fait foi
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

 
  const freeAvatars = (avatars ?? []).filter((a) => a.unlockLevel === 0);
  const unlockableAvatars = [...(avatars ?? [])]
    .filter((a) => a.unlockLevel > 0)
    .sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      return a.unlockLevel - b.unlockLevel;
    });

  const handlePress = (avatar: AvatarCatalogEntry) => {
    if (isPending || avatar.slug === currentSlug) return;
    selectAvatar(avatar.slug);
  };

  const renderAvatarCard = (avatar: AvatarCatalogEntry) => {
    const selected = avatar.slug === currentSlug;

    if (!avatar.unlocked) {
      return (
        <View
          key={avatar.slug}
          style={[styles.card, styles.cardLocked]}
          accessible
          accessibilityLabel={t("avatars.lockedLabel", {
            level: avatar.unlockLevel,
          })}
        >
          <Image
            source={getAvatarImage(avatar.slug)}
            style={[styles.avatar, styles.avatarLocked]}
          />
          <View style={styles.lockRow}>
            <MaterialIcons name="lock" size={12} color={Colors.outline} />
            <Text style={styles.unlockLevel}>
              {t("avatars.unlockAtLevel", { level: avatar.unlockLevel })}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Pressable
        key={avatar.slug}
        onPress={() => handlePress(avatar)}
        disabled={isPending}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: isPending }}
        style={[styles.card, selected && styles.cardSelected]}
      >
        <Image source={getAvatarImage(avatar.slug)} style={styles.avatar} />
        {selected && (
          <View style={styles.checkBadge}>
            <MaterialIcons name="check" size={12} color={Colors.onPrimary} />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>{t("avatars.title")}</Text>
          <Text style={styles.subtitle}>{t("avatars.subtitle")}</Text>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{t("avatars.loadError")}</Text>
            </View>
          ) : (
            <>
              {freeAvatars.length > 0 && (
                <View>
                  <Text style={styles.sectionLabel}>
                    {t("avatars.freeSection")}
                  </Text>
                  <View style={styles.sectionRule} />
                  <View style={styles.grid}>
                    {freeAvatars.map(renderAvatarCard)}
                  </View>
                </View>
              )}

              {unlockableAvatars.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>
                    {t("avatars.unlockableSection")}
                  </Text>
                  <View style={styles.sectionRule} />
                  <View style={styles.grid}>
                    {unlockableAvatars.map(renderAvatarCard)}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            variant="primary"
            title={t("avatars.done")}
            onPress={() => router.navigate("/(app)/profile")}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing["5xl"] + Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    textAlign: "center",
  },
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  section: {
    marginTop: Spacing["2xl"],
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  sectionRule: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: Spacing.sm,
  },
  card: {
    width: "31%",
    minHeight: 112,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    paddingVertical: Spacing.sm,
    ...Shadows.card,
  },
  cardSelected: {
    borderColor: Colors.primary,
  },
  cardLocked: {
    backgroundColor: Colors.surfaceVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
  },
  avatarLocked: {
    opacity: 0.35,
  },
  checkBadge: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  unlockLevel: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelMd,
    color: Colors.outline,
  },
  centered: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.error,
  },
});
