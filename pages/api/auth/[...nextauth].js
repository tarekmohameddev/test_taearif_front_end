// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export default NextAuth({
  providers: [
    // إضافة Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // إضافة Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        recaptcha_token: { label: "ReCAPTCHA Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          // إرسال طلب تسجيل الدخول إلى API الخارجي
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_Backend_URL}/login`,
            {
              email: credentials.email,
              password: credentials.password,
              recaptcha_token: credentials.recaptcha_token,
            },
          );

          if (response.status === 200 && response.data.user) {
            const { user, token } = response.data;

            return {
              id: user.id || user._id,
              email: user.email,
              name: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              token: token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          throw new Error(
            error.response?.data?.message || "فشل في تسجيل الدخول",
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // إذا كان تسجيل الدخول بـ Google
      if (account?.provider === "google" && profile) {
        try {
          // التحقق من وجود المستخدم أولاً
          const checkUserResponse = await axios
            .post(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/check-user`, {
              email: profile.email,
            })
            .catch(() => ({ data: { exists: false } }));

          let userData;

          if (checkUserResponse.data.exists) {
            // المستخدم موجود - تسجيل دخول
            const loginResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/login`,
              {
                email: profile.email,
                google_id: profile.sub,
                name: profile.name,
              },
            );
            userData = loginResponse.data;
          } else {
            // المستخدم غير موجود - تسجيل جديد
            const registerResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/register`,
              {
                email: profile.email,
                google_id: profile.sub,
                first_name: profile.given_name,
                last_name: profile.family_name,
                username: profile.name.replace(/\s+/g, "-").toLowerCase(),
              },
            );
            userData = registerResponse.data;
          }

          if (userData.user && userData.token) {
            token.token = userData.token;
            token.user = userData.user;
            token.email = userData.user.email;
            token.name = userData.user.username;
            token.first_name = userData.user.first_name;
            token.last_name = userData.user.last_name;
          }
        } catch (error) {
          console.error(
            "Google OAuth error:",
            error.response?.data || error.message,
          );
          throw new Error("فشل في المصادقة مع Google");
        }
      }

      // إذا كان تسجيل الدخول بالطريقة التقليدية
      if (user) {
        token.token = user.token;
        token.user = user;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
      }

      return token;
    },
    async session({ session, token }) {
      // إضافة بيانات إضافية للجلسة
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.accessToken = token.token;
      session.userData = token.user;
      return session;
    },
    async signIn({ account, profile, user }) {
      // السماح بتسجيل الدخول
      return true;
    },
    async redirect({ url, baseUrl }) {
      // التوجيه بعد تسجيل الدخول الناجح
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
