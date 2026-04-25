interface User {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  username: string;
  lang: "fr" | "en";
  avatarSlug: string;
}

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};
