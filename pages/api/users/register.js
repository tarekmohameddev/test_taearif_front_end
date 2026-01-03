import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { defaultComponents } from "@/lib/defaultComponents";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  const {
    username,
    websiteName,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  } = req.body;
  try {
    // التحقق من ال username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // التحقق من ال email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 8);

    // دالة إنشاء المكونات الأولية من defaultComponents
    const createInitialComponents = () => {
      const homepageComponents = defaultComponents.homepage;
      return Object.entries(homepageComponents).map(
        ([type, componentName], index) => ({
          id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
          type: type,
          name: getComponentDisplayName(type),
          componentName: componentName,
          data: {},
          position: index,
        }),
      );
    };

    // دالة للحصول على اسم العرض للمكون
    const getComponentDisplayName = (type) => {
      const displayNames = {
        header: "Header",
        hero: "Hero",
        halfTextHalfImage: "Half Text Half Image",
        propertySlider: "Property Slider",
        ctaValuation: "CTA Valuation",
        stepsSection: "Steps Section",
        testimonials: "Testimonials",
        whyChooseUs: "Why Choose Us",
        contactMapSection: "Contact Map Section",
        footer: "Footer",
      };
      return displayNames[type] || type;
    };

    // إنشاء البيانات الافتراضية
    const pageComponents = createInitialComponents();

    // إعداد componentSettings: Map of Map of Mixed (حسب schema)
    const defaultComponentSettings = new Map();
    const homepageSettings = new Map();
    pageComponents.forEach((component) => {
      homepageSettings.set(component.id, {
        type: component.type,
        name: component.name,
        componentName: component.componentName,
        data: component.data,
        position: component.position,
      });
    });
    defaultComponentSettings.set("homepage", homepageSettings);

    const newUser = new User({
      username,
      websiteName,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      componentSettings: defaultComponentSettings,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
