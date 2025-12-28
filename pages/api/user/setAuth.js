import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import axiosInstance from "@/lib/axiosInstance";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user, UserToken } = req.body;

    try {
      if (!UserToken) {
        return res.status(400).json({
          success: false,
          error: "بيانات المستخدم أو التوكن غير موجودة",
        });
      }

      let userData = user;
      if (!userData || Object.keys(userData).length === 0) {
        const response = await axiosInstance.get("/user", {
          headers: {
            Authorization: `Bearer ${UserToken}`,
          },
        });
        userData = response.data.data || response.data;
      }

      // تحديد onboarding_completed بناءً على account_type
      // إذا كان account_type == "employee"، يكون onboarding_completed = true دائماً
      const accountType = userData.account_type || userData.user?.account_type;
      const isEmployee = accountType === "employee";
      const onboardingCompleted = isEmployee 
        ? true 
        : (userData.onboarding_completed === true);

      const token1 = jwt.sign(
        {
          email: userData.email,
          token: UserToken,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          onboarding_completed: onboardingCompleted,
        },
        process.env.SECRET_KEY,
        { expiresIn: "30d" },
      );

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // تغيير من strict إلى lax لضمان العمل في جميع الحالات
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      };

      const authCookie = serialize("authToken", token1, cookieOptions);
      res.setHeader("Set-Cookie", authCookie);
      console.log("🍪 Cookie set successfully:", authCookie);

      return res.status(200).json({
        success: true,
        user: {
          email: userData.email,
          token: UserToken,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          onboarding_completed: onboardingCompleted,
        },
      });
    } catch (error) {
      console.error("Error in setAuth:", error.message);
      return res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء تعيين التوكن",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
