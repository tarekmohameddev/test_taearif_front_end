"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// AutoFrame Component - مستوحى من Puck مع نسخ الـ styles
interface AutoFrameProps {
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  frameRef: React.RefObject<HTMLIFrameElement | null>;
  onReady?: () => void;
  onNotReady?: () => void;
}

export default function AutoFrame({
  children,
  className,
  style,
  frameRef,
  onReady,
  onNotReady,
}: AutoFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const stylesInitializedRef = useRef(false);
  const mountTargetRef = useRef<HTMLElement | null>(null);
  const stylesLoadedRef = useRef(false);
  // ⭐ CRITICAL: Store callbacks in refs to prevent dependency changes
  const onReadyRef = useRef(onReady);
  const onNotReadyRef = useRef(onNotReady);

  // Update refs when callbacks change
  useEffect(() => {
    onReadyRef.current = onReady;
    onNotReadyRef.current = onNotReady;
  }, [onReady, onNotReady]);

  // دالة نسخ الـ styles من الـ parent window إلى الـ iframe
  const copyStylesToIframe = useCallback((iframeDoc: Document) => {
    // تجنب إعادة نسخ الـ styles إذا تم نسخها مسبقاً
    if (stylesInitializedRef.current) {
      return;
    }

    const styleElements = document.querySelectorAll(
      'style, link[rel="stylesheet"]',
    );
    const iframeHead = iframeDoc.head;

    // مسح الـ head أولاً
    iframeHead.innerHTML = "";

    // نسخ جميع الـ styles
    styleElements.forEach((styleEl) => {
      if (styleEl.tagName === "STYLE") {
        const clonedStyle = styleEl.cloneNode(true) as HTMLStyleElement;
        iframeHead.appendChild(clonedStyle);
      } else if (styleEl.tagName === "LINK") {
        const linkEl = styleEl as HTMLLinkElement;
        const clonedLink = linkEl.cloneNode(true) as HTMLLinkElement;
        iframeHead.appendChild(clonedLink);
      }
    });

    // نسخ CSS variables من الـ parent
    const parentComputedStyle = getComputedStyle(document.documentElement);

    // نسخ جميع CSS custom properties
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }

    // إضافة CSS إضافي للـ iframe
    const additionalStyles = document.createElement("style");
    additionalStyles.textContent = `
      html {
        direction: rtl !important;
        overflow-x: hidden;
        overflow-y: auto;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        direction: rtl !important;
      }
      * {
        box-sizing: border-box;
      }
      #frame-root {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        direction: rtl !important;
      }
      /* ضمان عمل الـ scroll في الـ iframe */
      iframe {
        overflow: auto !important;
      }
      /* إزالة أي قيود على الـ scroll */
      .overflow-hidden {
        overflow: auto !important;
      }
      /* فرض RTL على جميع العناصر */
      html[dir="rtl"],
      body[dir="rtl"],
      [dir="rtl"] {
        direction: rtl !important;
      }
    `;
    iframeHead.appendChild(additionalStyles);

    // نسخ الـ meta tags المهمة
    const metaTags = document.querySelectorAll(
      'meta[name="viewport"], meta[charset]',
    );
    metaTags.forEach((metaTag) => {
      const clonedMeta = metaTag.cloneNode(true) as HTMLMetaElement;
      iframeHead.appendChild(clonedMeta);
    });

    // تعيين علامة أن الـ styles تم نسخها
    stylesInitializedRef.current = true;
  }, []);

  // دالة مراقبة التغييرات في الـ styles
  const observeStyleChanges = useCallback((iframeDoc: Document) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.matches('style, link[rel="stylesheet"]')) {
                // نسخ الـ style الجديد إلى الـ iframe
                const clonedElement = element.cloneNode(true) as HTMLElement;
                iframeDoc.head.appendChild(clonedElement);
              }
            }
          });
        }
      });
    });

    observer.observe(document.head, { childList: true, subtree: true });
    return observer;
  }, []);

  // دالة تحديث CSS variables
  const updateCSSVariables = useCallback((iframeDoc: Document) => {
    const parentComputedStyle = getComputedStyle(document.documentElement);

    // نسخ جميع CSS custom properties
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }
  }, []);

  useEffect(() => {
    if (frameRef.current && loaded) {
      const doc = frameRef.current.contentDocument;
      const win = frameRef.current.contentWindow;

      if (doc && win) {
        // فرض RTL بشكل إجباري على الـ iframe
        doc.documentElement.setAttribute("dir", "rtl");
        if (doc.body) {
          doc.body.setAttribute("dir", "rtl");
        }

        // نسخ الـ styles أولاً
        copyStylesToIframe(doc);

        // ⭐ CRITICAL: Only set mount target if it changed to prevent unnecessary updates
        const newMountTarget = doc.getElementById("frame-root");
        if (newMountTarget !== mountTargetRef.current) {
          mountTargetRef.current = newMountTarget;
          setMountTarget(newMountTarget);
        }

        // مراقبة التغييرات في الـ styles
        const styleObserver = observeStyleChanges(doc);

        // تحديث CSS variables بشكل دوري
        const cssVariablesInterval = setInterval(() => {
          updateCSSVariables(doc);
        }, 1000);

        // انتظار تحميل الـ styles ثم إعلام أن الـ iframe جاهز
        // ⭐ CRITICAL: Use ref to track if styles are already loaded
        if (!stylesLoadedRef.current) {
          const checkStylesLoaded = () => {
            // Skip if already loaded
            if (stylesLoadedRef.current) {
              return;
            }

            const iframeStyles = doc.querySelectorAll(
              'style, link[rel="stylesheet"]',
            );
            const parentStyles = document.querySelectorAll(
              'style, link[rel="stylesheet"]',
            );

            if (iframeStyles.length >= parentStyles.length) {
              stylesLoadedRef.current = true;
              setStylesLoaded(true);
              // Use ref to call callback
              if (onReadyRef.current) {
                onReadyRef.current();
              }
            } else {
              setTimeout(checkStylesLoaded, 50);
            }
          };

          setTimeout(checkStylesLoaded, 100);
        }

        // تنظيف المراقب عند إلغاء المكون
        return () => {
          styleObserver.disconnect();
          clearInterval(cssVariablesInterval);
        };
      } else {
        // Use ref to call callback
        if (onNotReadyRef.current) {
          onNotReadyRef.current();
        }
      }
    }
    // ⭐ CRITICAL: Remove onReady and onNotReady from deps to prevent infinite loops
    // They are stored in refs and updated separately
  }, [
    frameRef,
    loaded,
    copyStylesToIframe,
    observeStyleChanges,
    updateCSSVariables,
  ]);

  // إعادة تعيين علامة الـ styles عند إلغاء المكون
  useEffect(() => {
    return () => {
      stylesInitializedRef.current = false;
      stylesLoadedRef.current = false;
      mountTargetRef.current = null;
    };
  }, []);

  return (
    <iframe
      className={className}
      style={{ ...style, overflow: "auto" }}
      srcDoc='<!DOCTYPE html><html dir="rtl"><head></head><body dir="rtl"><div id="frame-root" data-live-editor-entry></div></body></html>'
      ref={frameRef}
      onLoad={() => setLoaded(true)}
    >
      {loaded &&
        mountTarget &&
        stylesLoaded &&
        createPortal(children, mountTarget)}
    </iframe>
  );
}
