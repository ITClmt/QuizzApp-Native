import type { FriendSearchResult } from "@/src/types";
import { useTranslation } from "react-i18next";
import { FriendRow, RowAction, RowTag } from "./FriendRow";

interface SearchResultRowProps {
  result: FriendSearchResult;
  disabled: boolean;
  onAdd: (userId: string) => void;
  onAccept: (requestId: string) => void;
}

/** L'action proposée dépend de la relation actuelle avec ce joueur */
export function SearchResultRow({
  result,
  disabled,
  onAdd,
  onAccept,
}: SearchResultRowProps) {
  const { t } = useTranslation("friends");
  const { user, relation, requestId } = result;

  return (
    <FriendRow user={user}>
      {relation === "none" && (
        <RowAction
          icon="person-add"
          tone="primary"
          label={t("actions.add", { username: user.username })}
          onPress={() => onAdd(user.id)}
          disabled={disabled}
        />
      )}
      {relation === "received" && requestId && (
        <RowAction
          icon="check"
          tone="primary"
          label={t("actions.accept", { username: user.username })}
          onPress={() => onAccept(requestId)}
          disabled={disabled}
        />
      )}
      {relation === "sent" && <RowTag label={t("search.sent")} />}
      {relation === "friends" && <RowTag label={t("search.alreadyFriend")} />}
    </FriendRow>
  );
}
