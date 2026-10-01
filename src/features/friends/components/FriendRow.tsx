import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import type { FriendUser } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface FriendRowProps {
  user: FriendUser;
  /** Boutons d'action affichés à droite */
  children?: React.ReactNode;
}

export function FriendRow({ user, children }: FriendRowProps) {
  const { t } = useTranslation("common");

  return (
    <View style={styles.row}>
      <Image source={getAvatarImage(user.avatarSlug)} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username} numberOfLines={1}>
          {user.username}
        </Text>
        <Text style={styles.level}>
          {t("levelBadge", { level: user.level })}
        </Text>
      </View>
      {children && <View style={styles.actions}>{children}</View>}
    </View>
  );
}

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface RowActionProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "primary" | "neutral" | "danger";
}

/** Bouton rond d'action d'une ligne (accepter, refuser, ajouter…) */
export function RowAction({
  icon,
  label,
  onPress,
  disabled,
  tone = "neutral",
}: RowActionProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={6}
      style={({ pressed }) => [
        styles.action,
        tone === "primary" && styles.actionPrimary,
        tone === "danger" && styles.actionDanger,
        (pressed || disabled) && styles.actionDimmed,
      ]}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={
          tone === "primary"
            ? Colors.onPrimary
            : tone === "danger"
              ? Colors.error
              : Colors.onSurfaceVariant
        }
      />
    </Pressable>
  );
}

/** Étiquette non cliquable à la place d'une action (« Envoyée », « Ami ») */
export function RowTag({ label }: { label: string }) {
  return <Text style={styles.tag}>{label}</Text>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  info: {
    flex: 1,
  },
  username: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  level: {
    marginTop: 2,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelLg,
    color: Colors.onSurfaceVariant,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  action: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceVariant,
  },
  actionPrimary: {
    backgroundColor: Colors.primary,
  },
  actionDanger: {
    backgroundColor: Colors.errorContainer,
  },
  actionDimmed: {
    opacity: 0.5,
  },
  tag: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelLg,
    color: Colors.outline,
  },
});
