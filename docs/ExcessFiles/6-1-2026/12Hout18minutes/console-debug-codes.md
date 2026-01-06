# Console Debug Codes

## الكود الأول: عند فتح Live Editor مباشرة

انسخ هذا الكود والصقه في Console مباشرة بعد فتح Live Editor:

```javascript
// ⭐ DEBUG: Complete EditorStore State Check on Live Editor Open
(() => {
  console.group('🔍 Live Editor State Check');
  
  // Get editorStore from window (Zustand stores)
  const getEditorStore = () => {
    // Try multiple methods to get Zustand store
    if (window.__ZUSTAND_STORES__) {
      return window.__ZUSTAND_STORES__['editorStore'];
    }
    
    // Try to find store in React DevTools
    const reactRoot = document.querySelector('#__next') || document.querySelector('[data-reactroot]');
    if (reactRoot?._reactInternalFiber) {
      let fiber = reactRoot._reactInternalFiber;
      while (fiber) {
        if (fiber.memoizedState?.store) {
          return fiber.memoizedState.store;
        }
        fiber = fiber.child || fiber.sibling;
      }
    }
    
    return null;
  };

  const editorStore = getEditorStore();
  
  if (!editorStore) {
    console.error('❌ EditorStore not found!');
    console.log('Trying alternative method...');
    
    // Alternative: Use the store directly from the component
    const storeState = {};
    try {
      // Access via Next.js
      if (window.__NEXT_DATA__) {
        console.log('Next.js data available:', Object.keys(window.__NEXT_DATA__));
      }
    } catch (e) {
      console.error('Error accessing store:', e);
    }
    
    console.groupEnd();
    return;
  }

  const state = editorStore.getState();
  
  console.log('📊 EditorStore State:', {
    currentPage: state.currentPage,
    hasHeroStates: !!state.heroStates,
    heroStatesKeys: Object.keys(state.heroStates || {}),
    pageComponentsByPageKeys: Object.keys(state.pageComponentsByPage || {}),
  });

  // Check heroStates in detail
  console.group('🎯 Hero States Detail');
  if (state.heroStates) {
    Object.entries(state.heroStates).forEach(([key, value]) => {
      console.log(`Hero State [${key}]:`, {
        hasContent: !!value?.content,
        hasBackground: !!value?.background,
        visible: value?.visible,
        id: value?.id,
        variant: value?.variant,
        type: value?.type,
        dataKeys: value ? Object.keys(value) : [],
        contentTitle: value?.content?.title,
        backgroundImage: value?.background?.image,
      });
    });
  } else {
    console.warn('⚠️ heroStates is empty or undefined');
  }
  console.groupEnd();

  // Check pageComponentsByPage
  console.group('📄 Page Components By Page');
  if (state.pageComponentsByPage) {
    Object.entries(state.pageComponentsByPage).forEach(([page, components]) => {
      console.log(`Page [${page}]:`, {
        componentCount: Array.isArray(components) ? components.length : 'Not an array',
        components: Array.isArray(components) ? components.map(c => ({
          id: c.id,
          type: c.type,
          componentName: c.componentName,
          hasData: !!c.data,
          dataKeys: c.data ? Object.keys(c.data) : [],
        })) : 'Not an array',
      });
    });
  } else {
    console.warn('⚠️ pageComponentsByPage is empty or undefined');
  }
  console.groupEnd();

  // Check tenantData
  console.group('🏢 Tenant Data');
  try {
    const tenantStore = window.__ZUSTAND_STORES__?.['tenantStore'] || 
                       (() => {
                         // Try to find tenantStore
                         const reactRoot = document.querySelector('#__next');
                         if (reactRoot?._reactInternalFiber) {
                           let fiber = reactRoot._reactInternalFiber;
                           while (fiber) {
                            if (fiber.memoizedState?.tenantData) {
                              return { getState: () => ({ tenantData: fiber.memoizedState.tenantData }) };
                            }
                            fiber = fiber.child || fiber.sibling;
                          }
                         }
                         return null;
                       })();
    
    if (tenantStore) {
      const tenantState = tenantStore.getState();
      const tenantData = tenantState?.tenantData;
      
      if (tenantData) {
        console.log('Tenant Data:', {
          hasComponentSettings: !!tenantData.componentSettings,
          componentSettingsKeys: Object.keys(tenantData.componentSettings || {}),
          homepageComponents: tenantData.componentSettings?.homepage ? 
            (Array.isArray(tenantData.componentSettings.homepage) ? 
              tenantData.componentSettings.homepage.map(c => ({
                id: c.id,
                type: c.type,
                componentName: c.componentName,
                hasData: !!c.data,
              })) :
              Object.keys(tenantData.componentSettings.homepage).map(key => ({
                id: key,
                ...tenantData.componentSettings.homepage[key],
              }))
            ) : 'Not found',
        });
        
        // Check specific homepage hero
        if (tenantData.componentSettings?.homepage) {
          const homepage = tenantData.componentSettings.homepage;
          const homepageArray = Array.isArray(homepage) ? homepage : Object.values(homepage);
          const heroComponent = homepageArray.find(c => c.type === 'hero' || c.componentName?.startsWith('hero'));
          
          if (heroComponent) {
            console.log('🏠 Homepage Hero Component:', {
              id: heroComponent.id,
              type: heroComponent.type,
              componentName: heroComponent.componentName,
              hasData: !!heroComponent.data,
              dataKeys: heroComponent.data ? Object.keys(heroComponent.data) : [],
              contentTitle: heroComponent.data?.content?.title,
              backgroundImage: heroComponent.data?.background?.image,
            });
          }
        }
      } else {
        console.warn('⚠️ tenantData is empty or undefined');
      }
    } else {
      console.warn('⚠️ tenantStore not found');
    }
  } catch (e) {
    console.error('Error accessing tenantData:', e);
  }
  console.groupEnd();

  // Check iframe components
  console.group('🖼️ Iframe Components');
  try {
    const iframe = document.querySelector('iframe[src*="data-live-editor"]') || 
                   document.querySelector('iframe');
    
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const heroComponents = iframeDoc.querySelectorAll('[data-component-type="hero"], [class*="hero"]');
        console.log('Hero components in iframe:', heroComponents.length);
        
        heroComponents.forEach((comp, index) => {
          console.log(`Hero Component ${index + 1}:`, {
            id: comp.id,
            className: comp.className,
            textContent: comp.textContent?.substring(0, 100),
          });
        });
      } else {
        console.warn('⚠️ Cannot access iframe document (CORS or not loaded)');
      }
    } else {
      console.warn('⚠️ Iframe not found');
    }
  } catch (e) {
    console.error('Error accessing iframe:', e);
  }
  console.groupEnd();

  // Final comparison
  console.group('🔍 Data Flow Comparison');
  const homepageHeroFromStore = state.heroStates?.['0'];
  const homepageHeroFromPage = state.pageComponentsByPage?.homepage?.find(c => c.id === '0' || c.type === 'hero');
  
  console.log('Hero from heroStates["0"]:', {
    exists: !!homepageHeroFromStore,
    hasContent: !!homepageHeroFromStore?.content,
    contentTitle: homepageHeroFromStore?.content?.title,
  });
  
  console.log('Hero from pageComponentsByPage.homepage:', {
    exists: !!homepageHeroFromPage,
    id: homepageHeroFromPage?.id,
    componentName: homepageHeroFromPage?.componentName,
    hasData: !!homepageHeroFromPage?.data,
    dataContentTitle: homepageHeroFromPage?.data?.content?.title,
  });
  
  console.log('Match Check:', {
    storeHasData: !!homepageHeroFromStore,
    pageHasData: !!homepageHeroFromPage,
    idsMatch: homepageHeroFromStore?.id === homepageHeroFromPage?.id,
    dataMatches: JSON.stringify(homepageHeroFromStore) === JSON.stringify(homepageHeroFromPage?.data),
  });
  console.groupEnd();

  console.groupEnd();
})();
```

---

## الكود الثاني: عند الضغط على زر الحفظ في EditorSidebar

انسخ هذا الكود والصقه في Console **قبل** الضغط على زر الحفظ، ثم اضغط على زر الحفظ:

```javascript
// ⭐ DEBUG: Before Save - Set up monitoring
(() => {
  console.group('💾 Setting up Save Monitor');
  
  // Store initial state
  const getEditorStore = () => {
    if (window.__ZUSTAND_STORES__) {
      return window.__ZUSTAND_STORES__['editorStore'];
    }
    return null;
  };

  const editorStore = getEditorStore();
  
  if (!editorStore) {
    console.error('❌ EditorStore not found!');
    console.groupEnd();
    return;
  }

  const initialState = editorStore.getState();
  
  console.log('📊 State BEFORE Save:', {
    heroStatesKeys: Object.keys(initialState.heroStates || {}),
    heroState0: initialState.heroStates?.['0'],
    pageComponentsHomepage: initialState.pageComponentsByPage?.homepage,
    tempData: initialState.tempData,
  });

  // Monitor store changes
  let saveTriggered = false;
  const unsubscribe = editorStore.subscribe((state) => {
    if (!saveTriggered) {
      saveTriggered = true;
      
      setTimeout(() => {
        console.group('💾 State AFTER Save');
        const afterState = editorStore.getState();
        
        console.log('📊 State AFTER Save:', {
          heroStatesKeys: Object.keys(afterState.heroStates || {}),
          heroState0: afterState.heroStates?.['0'],
          pageComponentsHomepage: afterState.pageComponentsByPage?.homepage,
          tempData: afterState.tempData,
        });

        // Compare before and after
        console.group('🔄 Before/After Comparison');
        console.log('Hero State [0] Before:', {
          hasContent: !!initialState.heroStates?.['0']?.content,
          contentTitle: initialState.heroStates?.['0']?.content?.title,
          backgroundImage: initialState.heroStates?.['0']?.background?.image,
        });
        
        console.log('Hero State [0] After:', {
          hasContent: !!afterState.heroStates?.['0']?.content,
          contentTitle: afterState.heroStates?.['0']?.content?.title,
          backgroundImage: afterState.heroStates?.['0']?.background?.image,
        });
        
        console.log('Changed:', {
          contentTitleChanged: initialState.heroStates?.['0']?.content?.title !== 
                                afterState.heroStates?.['0']?.content?.title,
          backgroundImageChanged: initialState.heroStates?.['0']?.background?.image !== 
                                  afterState.heroStates?.['0']?.background?.image,
        });
        console.groupEnd();

        // Check pageComponentsByPage
        console.group('📄 Page Components Comparison');
        const beforePage = initialState.pageComponentsByPage?.homepage?.find(c => c.id === '0');
        const afterPage = afterState.pageComponentsByPage?.homepage?.find(c => c.id === '0');
        
        console.log('Before:', {
          exists: !!beforePage,
          hasData: !!beforePage?.data,
          dataContentTitle: beforePage?.data?.content?.title,
        });
        
        console.log('After:', {
          exists: !!afterPage,
          hasData: !!afterPage?.data,
          dataContentTitle: afterPage?.data?.content?.title,
        });
        console.groupEnd();

        // Check if data is now visible in iframe
        setTimeout(() => {
          console.group('🖼️ Iframe Check After Save');
          try {
            const iframe = document.querySelector('iframe');
            if (iframe) {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc) {
                const heroElement = iframeDoc.querySelector('[class*="hero"], [data-component-type="hero"]');
                if (heroElement) {
                  const titleElement = heroElement.querySelector('h1, h2, [class*="title"]');
                  console.log('Hero in iframe:', {
                    found: true,
                    titleText: titleElement?.textContent?.trim(),
                    backgroundImage: heroElement.style.backgroundImage || 
                                   heroElement.querySelector('img')?.src,
                  });
                } else {
                  console.warn('⚠️ Hero element not found in iframe');
                }
              }
            }
          } catch (e) {
            console.error('Error checking iframe:', e);
          }
          console.groupEnd();
        }, 500);

        console.groupEnd();
        unsubscribe();
      }, 100);
    }
  });

  console.log('✅ Monitor set up. Now click the Save button in EditorSidebar.');
  console.groupEnd();
})();
```

---

## ملاحظات مهمة:

1. **الكود الأول**: استخدمه مباشرة بعد فتح Live Editor
2. **الكود الثاني**: استخدمه قبل الضغط على زر الحفظ، ثم اضغط على زر الحفظ
3. **انسخ الكود كاملاً**: تأكد من نسخ الكود من أول سطر إلى آخر سطر
4. **الصق في Console**: افتح Console (F12) والصق الكود واضغط Enter

بعد تنفيذ الكودين، أرسل لي:
- النتيجة الكاملة من Console (نسخ/لصق)
- أو Screenshots من Console

