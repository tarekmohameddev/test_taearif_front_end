import { useState, useEffect, useCallback } from "react";
import { fetchCities, fetchDistricts } from "../services/properties.api";

export const usePropertyFilters = () => {
  const [filterCityId, setFilterCityId] = useState<string | null>(null);
  const [filterDistrictId, setFilterDistrictId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterPurpose, setFilterPurpose] = useState<string | null>(null);
  const [filterBeds, setFilterBeds] = useState<string | null>(null);
  const [filterPriceFrom, setFilterPriceFrom] = useState<string>("");
  const [filterPriceTo, setFilterPriceTo] = useState<string>("");
  const [tempPriceFrom, setTempPriceFrom] = useState<string>("");
  const [tempPriceTo, setTempPriceTo] = useState<string>("");
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [localSearchValue, setLocalSearchValue] = useState<string>("");
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [newFilters, setNewFilters] = useState<Record<string, any>>({});

  // Fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const citiesData = await fetchCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  // Fetch districts when city is selected
  useEffect(() => {
    if (filterCityId) {
      const loadDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const districtsData = await fetchDistricts(filterCityId);
          setDistricts(districtsData);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoadingDistricts(false);
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
      setFilterDistrictId(null);
    }
  }, [filterCityId]);

  // بناء newFilters تلقائياً من الحالات المحلية للفلاتر
  useEffect(() => {
    const filters: Record<string, any> = {};

    if (filterCityId) filters.city_id = filterCityId;
    if (filterDistrictId) filters.district_id = filterDistrictId;
    if (filterType) filters.type = filterType;
    if (filterPurpose) filters.purpose = filterPurpose;
    if (filterBeds) filters.beds = filterBeds;
    if (filterPriceFrom) {
      filters.price_min = filterPriceFrom;
    }
    if (filterPriceTo) {
      filters.price_max = filterPriceTo;
    }
    if (filterSearch.trim()) {
      filters.search = filterSearch.trim();
    }

    setNewFilters(filters);
  }, [
    filterCityId,
    filterDistrictId,
    filterType,
    filterPurpose,
    filterBeds,
    filterPriceFrom,
    filterPriceTo,
    filterSearch,
  ]);

  const handleApplyFilters = useCallback((filters: any) => {
    if (filters.city_id) setFilterCityId(filters.city_id);
    if (filters.district_id) setFilterDistrictId(filters.district_id);
    if (filters.type) setFilterType(filters.type);
    if (filters.purpose) setFilterPurpose(filters.purpose);
    if (filters.beds) setFilterBeds(filters.beds);
    if (filters.price_from || filters.price_min) {
      setFilterPriceFrom(filters.price_from || filters.price_min);
    }
    if (filters.price_to || filters.price_max) {
      setFilterPriceTo(filters.price_to || filters.price_max);
    }
    if (filters.search) {
      setFilterSearch(filters.search);
      setLocalSearchValue(filters.search);
    }
  }, []);

  const handleSearchOnly = useCallback(() => {
    const searchValue = localSearchValue.trim();
    setFilterSearch(searchValue);
  }, [localSearchValue]);

  const handleClearFilters = useCallback(() => {
    setFilterCityId(null);
    setFilterDistrictId(null);
    setFilterType(null);
    setFilterPurpose(null);
    setFilterBeds(null);
    setFilterPriceFrom("");
    setFilterPriceTo("");
    setTempPriceFrom("");
    setTempPriceTo("");
    setFilterSearch("");
    setLocalSearchValue("");
  }, []);

  const handleRemoveFilter = useCallback((filterKey: string, filterValue?: any) => {
    if (filterKey === "search") {
      setFilterSearch("");
      setLocalSearchValue("");
    }
    if (filterKey === "price_range") {
      setFilterPriceFrom("");
      setTempPriceFrom("");
      setFilterPriceTo("");
      setTempPriceTo("");
    }
    if (filterKey === "price_from" || filterKey === "price_min") {
      setFilterPriceFrom("");
      setTempPriceFrom("");
    }
    if (filterKey === "price_to" || filterKey === "price_max") {
      setFilterPriceTo("");
      setTempPriceTo("");
    }
    if (filterKey === "city_id") {
      setFilterCityId(null);
      setFilterDistrictId(null);
    }
    if (filterKey === "district_id") {
      setFilterDistrictId(null);
    }
    if (filterKey === "type") {
      setFilterType(null);
    }
    if (filterKey === "purpose") {
      setFilterPurpose(null);
    }
    if (filterKey === "beds") {
      setFilterBeds(null);
    }
  }, []);

  return {
    // Filter states
    filterCityId,
    setFilterCityId,
    filterDistrictId,
    setFilterDistrictId,
    filterType,
    setFilterType,
    filterPurpose,
    setFilterPurpose,
    filterBeds,
    setFilterBeds,
    filterPriceFrom,
    setFilterPriceFrom,
    filterPriceTo,
    setFilterPriceTo,
    tempPriceFrom,
    setTempPriceFrom,
    tempPriceTo,
    setTempPriceTo,
    isPricePopoverOpen,
    setIsPricePopoverOpen,
    filterSearch,
    setFilterSearch,
    localSearchValue,
    setLocalSearchValue,
    // Data
    cities,
    districts,
    loadingCities,
    loadingDistricts,
    newFilters,
    // Handlers
    handleApplyFilters,
    handleSearchOnly,
    handleClearFilters,
    handleRemoveFilter,
  };
};
