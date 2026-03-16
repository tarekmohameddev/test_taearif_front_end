import axios from "axios";

const LOCATIONS_BASE = "https://nzl-backend.com/api";

/** City from backend (e.g. /cities?country_id=1). */
export interface LocationCity {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  region_id?: number;
  region_name?: string;
}

/** Normalized city for UI (id + display name). */
export interface CityOption {
  id: number;
  name: string;
  region_name?: string;
}

/** Region option when backend provides a list. */
export interface RegionOption {
  id?: number;
  name: string;
}

const CITIES_KEY = "locations:cities";
const inFlight = new Map<string, Promise<unknown>>();

function dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

function normalizeCity(c: LocationCity | Record<string, unknown>): CityOption {
  const name =
    (c as LocationCity).name_ar ||
    (c as LocationCity).name_en ||
    (c as LocationCity).name ||
    String((c as LocationCity).id);
  return {
    id: (c as LocationCity).id,
    name,
    region_name: (c as LocationCity).region_name,
  };
}

/**
 * Fetch cities from backend (نفس أسلوب صفحة إضافة عقار: axios + الرابط الكامل بدون axiosInstance).
 */
export async function fetchCities(countryId: number | string = 1): Promise<CityOption[]> {
  return dedupe(`${CITIES_KEY}:${countryId}`, async () => {
    const response = await axios.get<{ data?: LocationCity[] }>(
      `${LOCATIONS_BASE}/cities?country_id=${countryId}`
    );
    const raw = response.data;
    const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
    return list.map(normalizeCity);
  });
}

/**
 * Fetch districts for a city (نفس أسلوب صفحة إضافة عقار: axios + الرابط الكامل بدون axiosInstance).
 */
export async function fetchDistricts(cityId: number | string): Promise<{ id: number; name: string }[]> {
  const response = await axios.get<{ data?: { id: number; name_ar?: string; name_en?: string; name?: string }[] }>(
    `${LOCATIONS_BASE}/districts?city_id=${cityId}`
  );
  const raw = response.data;
  const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
  if (!list.length) return [];
  return list.map((d: { id: number; name_ar?: string; name_en?: string; name?: string }) => ({
    id: d.id,
    name: d.name_ar || d.name_en || d.name || String(d.id),
  }));
}

/**
 * Build unique regions list from cities (when each city has region_name).
 * If backend provides regions in filter-options, use that instead.
 */
export function regionsFromCities(cities: CityOption[]): string[] {
  const set = new Set<string>();
  cities.forEach((c) => {
    if (c.region_name?.trim()) set.add(c.region_name.trim());
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ar"));
}

/**
 * Build map city name -> region name for filtering (when city has region_name).
 */
export function cityToRegionMap(cities: CityOption[]): Record<string, string> {
  const map: Record<string, string> = {};
  cities.forEach((c) => {
    if (c.name?.trim() && c.region_name?.trim()) map[c.name.trim()] = c.region_name.trim();
  });
  return map;
}
