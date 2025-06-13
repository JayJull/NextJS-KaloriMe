// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { LoginPresenter } from "@/presenters/LoginPresenter";

export const authOptions = {
  providers: [
    // Credentials Provider untuk login biasa
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const forwarded = req?.headers?.["x-forwarded-for"];
          const ipAddress = forwarded
            ? forwarded.split(",")[0].trim()
            : req?.headers?.["x-real-ip"] || null;

          const userAgent = req?.headers?.["user-agent"] || null;

          const result = await LoginPresenter.handleLogin(
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              ipAddress,
              userAgent,
            }
          );

          if (result.success && result.user) {
            return {
              id: result.user.id_users.toString(),
              name: result.user.nama,
              email: result.user.email,
              image: null,
              userData: result.user,
              loginInfo: result.loginInfo,
            };
          }

          return null;
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Handle OAuth sign in (Google & Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Format data OAuth
          const oauthData = LoginPresenter.formatOAuthData(
            profile,
            account.provider
          );

          // Handle OAuth login dengan request info
          const result = await LoginPresenter.handleOAuthLogin(oauthData);

          if (result.success && result.user) {
            // Update user object dengan data dari database
            user.id = result.user.id_users.toString();
            user.name = result.user.nama;
            user.email = result.user.email;
            user.userData = result.user;
            user.isNewUser = result.isNewUser;
            user.loginInfo = result.loginInfo;

            return true;
          }

          console.error("OAuth login failed:", result.message);
          return false;
        } catch (error) {
          console.error("OAuth sign in error:", error);
          return false;
        }
      }

      // Untuk credentials provider
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Simpan data user ke token saat pertama kali login
      if (user?.userData) {
        token.userData = user.userData;
        token.isNewUser = user.isNewUser;
        token.loginInfo = user.loginInfo;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.userData = { ...token.userData, ...session.userData };
      }

      return token;
    },

    async session({ session, token }) {
      // Kirim data user ke client
      if (token?.userData) {
        session.user = {
          id: token.userData.id_users,
          name: token.userData.nama,
          email: token.userData.email,
          image: session.user.image,
          userData: token.userData,
          isNewUser: token.isNewUser,
          loginInfo: token.loginInfo,
          // Format session info untuk display
          sessionInfo: LoginPresenter.formatSessionInfo(token.loginInfo),
        };
      }

      return session;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("Sign in event:", {
        user: user.email,
        provider: account?.provider,
        isNewUser,
        loginInfo: user.loginInfo,
      });
    },

    async signOut({ session, token }) {
      console.log("Sign out event:", {
        user: session?.user?.email || token?.userData?.email,
      });

      // Optional: Deactivate session di database
      // Implementasi tergantung kebutuhan
    },
  },

  pages: {
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};

// Handler untuk App Router NextJS 15
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
