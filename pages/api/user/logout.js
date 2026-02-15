import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // مسح authToken cookie من الخادم
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0, // انتهاء فوري
        path: "/",
      };

      // مسح authToken cookie
      const authCookie = serialize("authToken", "", cookieOptions);
      
      // مسح أي cookies أخرى قد تكون موجودة
      const clearCookie = serialize("next-auth.session-token", "", {
        ...cookieOptions,
        maxAge: 0,
      });
      
      // تعيين جميع cookies للـ clear في نفس الوقت
      res.setHeader("Set-Cookie", [authCookie, clearCookie]);

      return res.status(200).json({
        success: true,
        message: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      console.error("❌ Error in logout:", error);
      return res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء تسجيل الخروج",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
