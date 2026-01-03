"use client";
import { useState, useEffect } from "react";
import useTenantStore from "@/context/tenantStore";
import Navbar from "@/components/landing/homepage/components/Navbar";
import Footer from "@/components/landing/homepage/components/Footer";

interface PrivacyPageWrapperProps {
  tenantId: string | null;
  domainType: "subdomain" | "custom" | null;
}

export default function PrivacyPageWrapper({
  tenantId,
  domainType,
}: PrivacyPageWrapperProps) {
  const { fetchTenantData, tenantData } = useTenantStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTenantData = async () => {
      try {
        if (tenantId) {
          await fetchTenantData(tenantId);
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenantData();
  }, [tenantId, fetchTenantData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-[8rem]">
      <Navbar />
      <main className="py-12 flex-1">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              سياسة الخصوصية وسرية المعلومات
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نحرص في منصة تعاريف على حماية خصوصية مستخدمينا وضمان سرية
              معلوماتهم وفقاً لأعلى المعايير
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-center">
                يرحّب بكم فريق عمل منصة تعاريف، ونفيدكم بأنه حرصاً منّا على
                حماية المستخدمين، فإن منصة تعاريف تسعى للحفاظ على المعلومات
                الخاصة بالتجار والممارسين والمستهلكين وفقاً لآلية سياسة الخصوصية
                وسرية المعلومات المعمول بها في منصة تعاريف. وعليه فإن منصة
                تعاريف تنوّه بأن هذه الوثيقة تحيطكم علماً بسياسة الخصوصية وسرية
                المعلومات المعمول بها في منصة تعاريف، فقد أنشأت منصة تعاريف هذه
                السياسة "سياسة الخصوصية وسرية المعلومات" لتوضيح وتحديد آلية
                السرية والخصوصية المعمول بها في منصة تعاريف، لذا يرجى الإطلاع
                عليها حيث باستخدامكم لمنصة تعاريف فإن جميع معلوماتكم تخضع لهذه
                السياسة.
              </p>
            </div>
          </div>

          {/* Definitions */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                التعريفات
              </h2>

              <div className="grid gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-black">
                  <div className="definition-term text-lg font-semibold text-black mb-2">
                    منصة تعاريف
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    يقصَد بهذه العبارة المنصة المملوكة لمؤسسة عبدالله الجربوع
                    لتقنية المعلومات، ويشمل هذا التعريف كافة أشكال منصة تعاريف
                    في فضاء الانترنت، سواء كان تطبيق أو موقع إلكتروني وذلك بكافة
                    أشكالها في فضاء الانترنت.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-black">
                  <div className="definition-term text-lg font-semibold text-black mb-2">
                    التاجر
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    يقصَد بهذه العبارة كل تاجر يسجّل في منصة تعاريف لإنشاء متجره
                    الإلكتروني، سواءً كان شخص طبيعي أو معنوي، ويشمل هذا التعريف
                    كافة أوجه الموقع طالما أنه يقوم بتجارته عن طريق منصة تعاريف،
                    ويشمل ذلك الموقع الالكتروني للمتجر أو التطبيق.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-black">
                  <div className="definition-term text-lg font-semibold text-black mb-2">
                    الممارس
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    يقصَد بهذه العبارة كل ممارس للتجارة الإلكترونية يسجّل في
                    منصة تعاريف لإنشاء موقع الكتروني، ويشمل هذا التعريف كافة
                    أوجه الموقع طالما أنه يمارس تجارته عن طريق منصة تعاريف،
                    ويشمل ذلك الموقع الالكتروني للمتجر أو التطبيق.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-black">
                  <div className="definition-term text-lg font-semibold text-black mb-2">
                    الموقع الإلكتروني
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    يقصَد بهذه العبارة الموقع المستخدَم من قبل التاجر أو الممارس
                    في منصة تعاريف الالكترونية، ويشمل ذلك موقع المتجر الإلكتروني
                    أو التطبيق.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-black">
                  <div className="definition-term text-lg font-semibold text-black mb-2">
                    المستهلك
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    يقصَد بهذه العبارة كل مستهلك يقوم بشراء منتج أو خدمة من
                    الموقع أو المتاجر الإلكترونية المسجلة في منصة تعاريف.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-black">
                  <div className="definition-term text-lg font-semibold text-black mb-2">
                    المستخدم
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    تُستخدم هذه العبارة للإشارة إلى أي شخص يستخدم منصة تعاريف،
                    سواء كان تاجرًا أو ممارساً أو مستهلكًا.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Collection */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                المعلومات التي تحصل عليها منصة تعاريف وتحتفظ بها في أنظمتها
                الإلكترونية
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
                <li>
                  المعلومات الشخصية الخاصة بالمستهلك: كالإسم، البريد الالكتروني،
                  ورقم الهوية الوطنية أو رقم الإقامة.
                </li>
                <li>
                  المعلومات الشخصية الخاصة بالتاجر أو الممارس: كالإسم، والبريد
                  الالكتروني، ورقم الهوية الوطنية أو رقم الإقامة وعنوان مقر
                  الإقامة.
                </li>
                <li>
                  المعلومات الخاصة بالمتجر وكيانه القانوني: كرقم السجل التجاري
                  وصورة من السجل التجاري، أو رقم وثيقة العمل الحر وصورة من
                  الوثيقة وشهادة الحساب البنكي "الآيبان".
                </li>
                <li>
                  معلومات الدخول الخاصة بالموقع الالكتروني: كإسم المستخدم وكلمة
                  السر والبريد الالكتروني، والسؤال الخاص باسترجاع كلمة المرور
                  وإجابته.
                </li>
                <li>
                  تستخدم منصة تعاريف ملفات تعريف الارتباط (Cookies) لتحسين تجربة
                  المستخدم وتقديم خدمات مخصصة.
                </li>
                <li>
                  في حال عدم توفير المستخدم للمعلومات المطلوبة منه فإن منصة
                  تعاريف قدّ تحاول الحصول عليها عبر مصادر أخرى.
                </li>
              </ol>
            </div>
          </div>

          {/* Consumer Information */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                معلومات مستهلكي المتاجر أو عملاء التجار
              </h2>
              <p className="text-gray-700 leading-relaxed text-center">
                حيث إن منصة تعاريف تسعى إلى تحسين تجربة المتاجر، وتحسين جودة
                أعمالهم، فإنها تطلع باستمرار على عدد مستهلكين المتاجر وعملياتهم
                الشرائية.
              </p>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                مشاركة المعلومات
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
                <li>
                  بطبيعة الحال فإن منصة تعاريف تسعى بالاحتفاظ بهذه المعلومات بما
                  يحفظ خصوصية المستخدم، ومنصة تعاريف لا تحتفظ بهذه المعلومات إلا
                  بهدف تحسين جودة المنصة وجودة عمل المواقع وتسهيلاً وتيسيراً
                  للخدمات.
                </li>
                <li>
                  كقاعدة عامة فإن جميع هذه المعلومات لا يطلع عليها إلا بعض
                  القائمين على منصة تعاريف وذلك بعد حصولهم على تصريح للاطلاع
                  عليها من قِبل إدارة منصة تعاريف – عادة ما يكون التصريح محدد
                  ومقيّد ويخضع لرقابة قانونية وإدارية من قِبل منصة تعاريف.
                </li>
                <li>
                  حيث أن منصة تعاريف تسعى للحفاظ على بيئة آمنة لممارسة التجارة
                  الإلكترونية، لذا فإنه – في حال ملاحظة منصة تعاريف لأي نشاط غير
                  نظامي أو غير شرعي يقوم به المستخدم – فإن منصة تعاريف تطبيقاً
                  لمواد وبنود وأحكام اتفاقية الاستخدام وسياسة الخصوصية وسرية
                  المعلومات، فإنها قد تشارك أيٍ من هذه المعلومات مع الجهات
                  المختصة لاتخاذ اللازم حيال المستخدم المخالف، وذلك التزاماً من
                  منصة تعاريف بضوابط وأحكام الأنظمة السارية في المملكة العربية
                  السعودية، ومنها على سبيل المثال لا الحصر نظام التجارة
                  الإلكترونية ونظام حماية البيانات الشخصية ونظام الجرائم
                  المعلوماتية.
                </li>
                <li>
                  ان التاجر أو الممارس الذي يبادر بتسجيل موقعه لدى منصة تعاريف
                  بواسطة شركاء النجاح فإنه بذلك يمنح شريك النجاح الذي قام
                  بالتسجيل بواسطته الحق في الاطلاع على كافة المعلومات الخاصة
                  بالموقع.
                </li>
                <li>
                  تنوه منصة تعاريف بأنه ينتج عن الممارسات غير النظامية لأي من
                  المستخدمين مشاركة بياناتهم مع الجهات الرسمية او بعض الجهات
                  الخاصة مثل: البنوك.
                </li>
                <li>
                  يعلم المستخدم ويوافق على أن منصة تعاريف قد تستخدم المعلومات
                  التي زوده بها، لإرسال الرسائل التسويقية.
                </li>
              </ol>
            </div>
          </div>

          {/* Data Security */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                ما هو مدى أمان سرية المعلومات الخاصة بالمستخدمين
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-center">
                تسعى منصة تعاريف إلى الحفاظ على سرية معلومات مستخدمين المنصة،
                ولكن نظراً لعدم إمكانية ضمان ذلك 100% في (فضاء الإنترنت) فإن
                فريق عمل منصة تعاريف، ينوّه على يلي:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
                <li>
                  تسعى منصة تعاريف إلى الحفاظ على جميع المعلومات الخاصة
                  بالمستخدمين وألا يطلع عليها أي شخص بما يخالف السياسة المعمول
                  بها في منصة تعاريف.
                </li>
                <li>
                  عمل منصة تعاريف على حماية معلومات المستخدمين بموجب أنظمة حماية
                  إلكترونية وتقنية ذات جودة عالية وتُحدّث بشكل مستمر ودوري.
                </li>
                <li>
                  غير أنه نظراً لأن شبكة الانترنت لا يمكن ضمانها 100% لما قد
                  يطرأ من اختراق أو فيروسات على أنظمة الحماية الالكترونية وعلى
                  جدران الحماية المعمول بها في منصة تعاريف فإن منصة تعاريف تنصح
                  المستخدمين بالحفاظ على معلوماتهم بسرية تامة، وعدم إفشاء أي
                  معلومات يراها المستخدم هامة جداً له، وهذا حرصاً من منصة تعاريف
                  على حماية وتوجيه وإرشاد المستخدمين.
                </li>
                <li>
                  تسعى منصة تعاريف بحماية البيانات الشخصية لمستخدميها وفقًا
                  لأعلى المعايير، وفي حال حدوث أي خرق أمني يؤدي إلى الوصول غير
                  المصرح به أو التلاعب بالبيانات الشخصية، تلتزم المنصة بإبلاغ
                  الجهات المختصة فوراً، وكذلك إخطار المستخدمين المتأثرين بتفاصيل
                  الخرق، كما ستقوم المنصة باتخاذ جميع التدابير اللازمة لمعالجة
                  الخرق.
                </li>
              </ol>
            </div>
          </div>

          {/* Third Party Services */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                الخدمات الإستراتيجية واللوجستية (خدمات الطرف الثالث)
              </h2>
              <p className="text-gray-700 leading-relaxed text-center">
                يُقر المستخدم بعلمه التام والنافي للجهالة بأنه في حال قام
                بالشراء من أحد المواقع أو المتاجر الإلكترونية أو تقدّم لطلب
                الاشتراك في خدمة مُقدّمة عن طريق طرف ثالث، بأنه يمنح تصريح إلى
                منصة تعاريف بتزويد مُقدّم الخدمة ببياناته مثل: اسم المستخدم –
                الهاتف الشخصي – البريد الإلكتروني – رقم السجل التجاري أو وثيقة
                العمل الحر – عنوان المنزل – أو عنوان مقر المتجر، وغير ذلك من
                المعلومات التي يحتاجها مقدّم الخدمة (الطرف الثالث). وذلك حتى
                يتمكّن مقدم الخدمة (الطرف الثالث) من تقديم الخدمة المطلوبة والتي
                اشترك بها المستخدم.
              </p>
            </div>
          </div>

          {/* User Rights */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 text-center">
                حقوق المستخدمين فيما يتعلق بالبيانات الشخصية
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-center">
                تحرص منصة تعاريف على حماية خصوصية مستخدميها وتوفير آليات واضحة
                لممارسة حقوقهم المتعلقة بالبيانات الشخصية، ومن ذلك ممارسة الحقوق
                التالية:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
                <li>
                  <strong>الحق في الوصول:</strong> يحق للمستخدم الاطلاع على
                  البيانات الشخصية المخزنة لديه من قبل منصة تعاريف.
                </li>
                <li>
                  <strong>الحق في الحصول على نسخة:</strong> يمكن للمستخدم الحصول
                  على نسخة من بياناته الشخصية التي تم جمعها ومعالجتها من قبل
                  منصة تعاريف.
                </li>
                <li>
                  <strong>الحق في التصحيح:</strong> يحق للمستخدم تعديل أو تحديث
                  بياناته الشخصية لضمان دقتها واكتمالها.
                </li>
                <li>
                  <strong>الحق في الإتلاف:</strong> يحق للمستخدم طلب حذف أو
                  إتلاف بياناته الشخصية إذا لم تعد هناك حاجة لمعالجتها.
                </li>
                <li>
                  <strong>الحق في الرجوع عن الموافقة:</strong> يحق للمستخدم سحب
                  موافقته على معالجة بياناته الشخصية في أي وقت.
                </li>
              </ol>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">آخر تحديث: يناير 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
