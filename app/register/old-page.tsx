import { RegisterPage } from "@/components/signin-up/register-page";
import Script from "next/script";
import WhatsAppFloatingBubble from "@/components/WhatsAppFloatingBubble";

export const metadata = {
  title: "تسجيل حساب جديد",
};

export default function Register() {
  return (
    <>
      {/* Snap Pixel Code */}
      <Script
        id="snap-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');

            snaptr('init', '12aec193-f115-47a4-a37d-deb2f0947c08', {});

            snaptr('track', 'PAGE_VIEW');
          `,
        }}
      />
      <RegisterPage />
      <WhatsAppFloatingBubble />
    </>
  );
}
