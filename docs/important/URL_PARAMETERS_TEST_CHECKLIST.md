# URL Parameters Testing Checklist

## Quick Test Guide for Property Listing Pages

Use this checklist to verify URL parameter functionality is working correctly on `/for-rent` and `/for-sale` pages.

---

## ✅ Pre-Test Setup

- [ ] Backend API is running
- [ ] Tenant website is accessible
- [ ] Properties exist in database for testing
- [ ] Browser console is open (for debugging)

---

## 📋 Test Cases

### Test 1: Single Parameter - City Filter

**URL:** `/for-rent?city_id=5`

- [ ] Page loads without errors
- [ ] Search form auto-fills with city
- [ ] Properties are filtered by city_id=5
- [ ] Results display automatically (no manual search needed)
- [ ] URL remains unchanged after load

---

### Test 2: Single Parameter - Price Filter

**URL:** `/for-sale?max_price=5000`

- [ ] Page loads successfully
- [ ] Price field shows 5000
- [ ] Properties shown are ≤ 5000
- [ ] Pagination reflects filtered count

---

### Test 3: Single Parameter - District Filter

**URL:** `/for-rent?state_id=10200005003`

- [ ] District filter applied
- [ ] Results match district
- [ ] Form shows district selection

---

### Test 4: Multiple Parameters Combined

**URL:** `/for-sale?city_id=5&state_id=10200005003&max_price=5000&category_id=3`

- [ ] All form fields auto-fill correctly
- [ ] All filters applied simultaneously
- [ ] Results match ALL criteria
- [ ] Pagination works with all filters

---

### Test 5: Search Parameter

**URL:** `/for-rent?search=الرياض`

- [ ] Search field contains "الرياض"
- [ ] Results show properties matching search
- [ ] Search is case-insensitive (if supported)

---

### Test 6: Property Type Filter

**URL:** `/for-sale?type_id=شقة`

- [ ] Property type dropdown shows "شقة"
- [ ] Only apartments displayed
- [ ] Type filter works correctly

---

### Test 7: Form Submission Creates URL

**Steps:**

1. Go to `/for-rent` (no parameters)
2. Fill in: City="الرياض", Price="3000"
3. Click Search

**Verify:**

- [ ] URL updates to `/for-rent?search=الرياض&max_price=3000`
- [ ] Results filter correctly
- [ ] URL is shareable

---

### Test 8: URL Sharing

**Steps:**

1. Create filtered URL: `/for-rent?city_id=5&max_price=5000`
2. Copy URL
3. Open in new browser tab (or incognito)

**Verify:**

- [ ] Same filtered results appear
- [ ] Form auto-fills identically
- [ ] No need to re-search

---

### Test 9: Manual URL Edit

**Steps:**

1. Start at `/for-rent?max_price=5000`
2. Manually change URL to `/for-rent?max_price=3000`
3. Press Enter

**Verify:**

- [ ] Results update to new price
- [ ] Form updates to 3000
- [ ] No page refresh flicker

---

### Test 10: Pagination Preserves Filters

**Steps:**

1. Navigate to `/for-rent?city_id=5`
2. Go to page 2 (via pagination)

**Verify:**

- [ ] URL becomes `/for-rent?city_id=5&page=2` (or similar)
- [ ] Page 2 results still filtered by city_id=5
- [ ] Back to page 1 maintains filter

---

### Test 11: Browser Back/Forward

**Steps:**

1. Go to `/for-rent?city_id=5`
2. Change to `/for-rent?city_id=10`
3. Press browser Back button

**Verify:**

- [ ] Returns to city_id=5 URL
- [ ] Results update to city_id=5
- [ ] Form updates correctly
- [ ] Forward button works too

---

### Test 12: Empty/No Parameters

**URL:** `/for-rent`

- [ ] Shows all rental properties
- [ ] No filters applied
- [ ] Form fields are empty/default
- [ ] No errors

---

### Test 13: Invalid Parameters

**URL:** `/for-rent?invalid_param=test&city_id=5`

- [ ] Invalid params ignored
- [ ] Valid params (city_id) still work
- [ ] No console errors
- [ ] Page functions normally

---

### Test 14: For-Rent Page

**URL:** `/for-rent?city_id=5&max_price=3000`

- [ ] Shows only rental properties
- [ ] Filters applied correctly
- [ ] Transaction type = "rent"

---

### Test 15: For-Sale Page

**URL:** `/for-sale?city_id=5&max_price=500000`

- [ ] Shows only sale properties
- [ ] Filters applied correctly
- [ ] Transaction type = "sale"

---

### Test 16: Special Characters in Search

**URL:** `/for-rent?search=الرياض&category_id=3`

- [ ] Arabic text handled correctly
- [ ] Special characters encoded properly
- [ ] Results accurate

---

### Test 17: Very Long URL

**URL:** `/for-rent?city_id=5&state_id=10200005003&max_price=5000&category_id=3&type_id=شقة&search=الرياض`

- [ ] All parameters work
- [ ] No URL truncation
- [ ] All filters apply correctly

---

### Test 18: Clear Filters

**Steps:**

1. Start with `/for-rent?city_id=5&max_price=5000`
2. Clear all form fields
3. Submit search

**Verify:**

- [ ] URL becomes `/for-rent` (no params)
- [ ] Shows all properties
- [ ] Filters removed

---

### Test 19: Mobile Testing

**Repeat key tests on mobile:**

- [ ] Test 1 (single param)
- [ ] Test 4 (multiple params)
- [ ] Test 7 (form submission)
- [ ] Test 8 (URL sharing)

**Mobile-Specific:**

- [ ] Form auto-fill works on mobile
- [ ] URL copying works
- [ ] Touch interactions smooth

---

### Test 20: Performance Check

**With Filters:**

- [ ] Page loads in < 2 seconds
- [ ] No console warnings
- [ ] Smooth transitions
- [ ] API response time acceptable

---

## 🔍 Backend Verification

### Check API Requests

**Open Network Tab and verify:**

- [ ] API called with correct parameters
- [ ] Request URL matches filters
- [ ] Response includes filtered data
- [ ] Pagination data correct

**Example Expected Request:**

```
GET /v1/tenant-website/123/properties?purpose=rent&city_id=5&state_id=10200005003&max_price=5000&page=1
```

**Example Expected Response:**

```json
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "total": 25,
      "per_page": 20,
      "current_page": 1,
      "last_page": 2
    }
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Parameters not applying

**Check:**

- [ ] Console for JavaScript errors
- [ ] Network tab for API calls
- [ ] Store state in React DevTools
- [ ] Backend receives parameters

### Issue: Form not auto-filling

**Check:**

- [ ] URL parameters are correctly formatted
- [ ] Component uses useSearchParams hook
- [ ] State updates on URL change

### Issue: Filters lost on pagination

**Check:**

- [ ] Pagination component preserves params
- [ ] Store maintains filter state
- [ ] API includes filters in request

---

## 📊 Results Summary

**Date Tested:** **\*\*\*\***\_**\*\*\*\***

**Tester:** **\*\*\*\***\_**\*\*\*\***

**Environment:** **\*\*\*\***\_**\*\*\*\***

### Test Results

- **Total Tests:** 20
- **Passed:** **\_** / 20
- **Failed:** **\_** / 20
- **Skipped:** **\_** / 20

### Critical Issues Found

1. ***
2. ***
3. ***

### Minor Issues Found

1. ***
2. ***
3. ***

### Notes

---

---

---

---

## ✅ Sign-Off

**Feature Ready for Production:** ☐ Yes ☐ No

**Approved By:** **\*\*\*\***\_**\*\*\*\***

**Date:** **\*\*\*\***\_**\*\*\*\***

---

## 📚 Related Documentation

- Full Documentation: `docs/important/URL_QUERY_PARAMETERS.md`
- Component Architecture: `docs/important/liveEditor/COMPONENT_ARCHITECTURE.md`
- Properties Store: `store/propertiesStore.ts`
- URL Filters Hook: `hooks-liveeditor/use-url-filters.ts`
