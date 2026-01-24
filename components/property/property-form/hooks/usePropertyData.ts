import { useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import {
  fetchCategories,
  fetchFacades,
  fetchProjects,
  fetchBuildings,
} from "../services/dataService";
import { getProperty } from "../services/propertyApi";
import type { FormData, Previews, FAQ } from "../types/propertyForm.types";
import { facilitiesList } from "../utils/constants";

export const usePropertyData = (
  mode: "add" | "edit",
  id: string | undefined,
  isDraft: boolean,
  authLoading: boolean,
  userToken: string | undefined,
  setCategories: (categories: any[]) => void,
  setProjects: (projects: any[]) => void,
  setFacades: (facades: any[]) => void,
  setBuildings: (buildings: any[]) => void,
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void,
  setPreviews: (previews: Previews | ((prev: Previews) => Previews)) => void,
  setFaqs: (faqs: FAQ[]) => void,
  setMissingFields: (fields: string[]) => void,
  setMissingFieldsAr: (fields: string[]) => void,
  setValidationErrors: (errors: string[]) => void,
  setLoadingProperty: (loading: boolean) => void,
) => {
  // Fetch categories
  useEffect(() => {
    if (authLoading || !userToken) {
      return;
    }

    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        // Error already handled in service
      }
    };
    loadCategories();
  }, [userToken, authLoading, setCategories]);

  // Fetch facades
  useEffect(() => {
    if (authLoading || !userToken) {
      return;
    }

    const loadFacades = async () => {
      try {
        const facades = await fetchFacades();
        setFacades(facades);
      } catch (error) {
        // Error already handled in service
      }
    };
    loadFacades();
  }, [userToken, authLoading, setFacades]);

  // Fetch projects
  useEffect(() => {
    if (authLoading || !userToken) {
      return;
    }

    const loadProjects = async () => {
      try {
        const projects = await fetchProjects();
        setProjects(projects);
      } catch (error) {
        // Error already handled in service
      }
    };
    if (mode === "add") {
      loadProjects();
    }
  }, [userToken, authLoading, mode, setProjects]);

  // Fetch buildings
  useEffect(() => {
    if (authLoading || !userToken) {
      return;
    }

    const loadBuildings = async () => {
      try {
        const buildings = await fetchBuildings();
        setBuildings(buildings);
      } catch (error) {
        // Error already handled in service
      }
    };
    loadBuildings();
  }, [userToken, authLoading, setBuildings]);

  // Fetch property for edit mode
  useEffect(() => {
    if (authLoading || !userToken) {
      return;
    }

    if (mode === "edit" && id) {
      const fetchPropertyData = async () => {
        setLoadingProperty(true);
        try {
          const property = await getProperty(id, isDraft);

          // Set missing fields and validation errors for drafts
          if (isDraft) {
            setMissingFields(property.missing_fields || []);
            setMissingFieldsAr(property.missing_fields_ar || []);
            setValidationErrors(property.validation_errors || []);
          }

          // Fetch projects for edit mode
          const projects = await fetchProjects();
          setProjects(projects);

          const matchedProject = projects.find(
            (p: any) => p.id === property.project_id,
          );

          // Extract data from different structures for draft vs regular property
          let title, address, description, cityId, districtId;
          if (isDraft && property.contents && property.contents.length > 0) {
            const content = property.contents[0];
            title = content.title || "";
            address = content.address || "";
            description = content.description || "";
            cityId = content.city_id || property.city_id || null;
            districtId = content.state_id || property.state_id || null;
          } else {
            title = property.title || "";
            address = property.address || "";
            description = property.description || "";
            cityId = property.city_id || null;
            districtId = property.state_id || null;
          }

          // Extract characteristics data for draft
          let characteristics: any = {};
          if (isDraft && property.user_property_characteristics) {
            characteristics = property.user_property_characteristics;
          } else if (!isDraft) {
            characteristics = property;
          }

          // معالجة الميزات
          let featuresArray: string[] = [];
          if (property.features) {
            if (typeof property.features === "string") {
              featuresArray = property.features
                .split(",")
                .map((feature: string) => feature.trim())
                .filter((feature: string) => feature.length > 0);
            } else if (Array.isArray(property.features)) {
              featuresArray = property.features;
            }
          }

          if (property.faqs && Array.isArray(property.faqs)) {
            setFaqs(
              property.faqs.map((faq: any) => ({
                id: faq.id || Date.now(), // Preserve original ID from backend
                question: faq.question,
                answer: faq.answer,
                displayOnPage: faq.displayOnPage !== undefined ? faq.displayOnPage : true,
              })),
            );
          }

          // تحديد قيم transaction_type و PropertyType بناءً على البيانات المُستلمة
          let propertyType = "";
          if (property.PropertyType) {
            propertyType = property.PropertyType;
          } else if (
            property.type &&
            (property.type === "residential" || property.type === "commercial")
          ) {
            propertyType = property.type;
          }

          setFormData((prev) => ({
            ...prev,
            project_id: matchedProject ? matchedProject.id.toString() : "",
            title: title,
            category: property.category_id?.toString() || "",
            description: description,
            address: address,
            building_id: property.building_id || "",
            water_meter_number: property.water_meter_number || "",
            electricity_meter_number: property.electricity_meter_number || "",
            deed_number: property.deed_number || "",
            price: property.price || "",
            purpose: property.purpose || "",
            bedrooms: property.beds?.toString() || "",
            bathrooms:
              property.bath?.toString() ||
              characteristics.bathrooms?.toString() ||
              "",
            size:
              property.size?.toString() ||
              characteristics.size?.toString() ||
              property.area?.toString() ||
              "",
            features: featuresArray,
            status: property.status === 1 ? "published" : "draft",
            featured: property.featured === 1 || property.featured === true,
            latitude:
              property.location?.latitude ||
              property.latitude ||
              24.766316905850978,
            longitude:
              property.location?.longitude ||
              property.longitude ||
              46.73579692840576,
            length: property.length?.toString() || characteristics.length?.toString() || "",
            width: property.width?.toString() || characteristics.width?.toString() || "",
            facade_id:
              property.facade_id?.toString() ||
              characteristics.facade_id?.toString() ||
              "",
            street_width_north:
              property.street_width_north?.toString() ||
              characteristics.street_width_north?.toString() ||
              "",
            street_width_south:
              property.street_width_south?.toString() ||
              characteristics.street_width_south?.toString() ||
              "",
            street_width_east:
              property.street_width_east?.toString() ||
              characteristics.street_width_east?.toString() ||
              "",
            street_width_west:
              property.street_width_west?.toString() ||
              characteristics.street_width_west?.toString() ||
              "",
            building_age:
              property.building_age?.toString() ||
              characteristics.building_age?.toString() ||
              "",
            rooms: property.rooms?.toString() || characteristics.rooms?.toString() || "",
            floors: property.floors?.toString() || characteristics.floors?.toString() || "",
            floor_number:
              property.floor_number?.toString() ||
              characteristics.floor_number?.toString() ||
              "",
            driver_room:
              property.driver_room?.toString() ||
              characteristics.driver_room?.toString() ||
              "",
            maid_room:
              property.maid_room?.toString() ||
              characteristics.maid_room?.toString() ||
              "",
            dining_room:
              property.dining_room?.toString() ||
              characteristics.dining_room?.toString() ||
              "",
            living_room:
              property.living_room?.toString() ||
              characteristics.living_room?.toString() ||
              "",
            majlis: property.majlis?.toString() || characteristics.majlis?.toString() || "",
            storage_room:
              property.storage_room?.toString() ||
              characteristics.storage_room?.toString() ||
              "",
            basement:
              property.basement?.toString() ||
              characteristics.basement?.toString() ||
              "",
            swimming_pool:
              property.swimming_pool?.toString() ||
              characteristics.swimming_pool?.toString() ||
              "",
            kitchen: property.kitchen?.toString() || characteristics.kitchen?.toString() || "",
            balcony: property.balcony?.toString() || characteristics.balcony?.toString() || "",
            garden: property.garden?.toString() || characteristics.garden?.toString() || "",
            annex: property.annex?.toString() || characteristics.annex?.toString() || "",
            elevator:
              property.elevator?.toString() ||
              characteristics.elevator?.toString() ||
              "",
            private_parking:
              property.private_parking?.toString() ||
              characteristics.private_parking?.toString() ||
              "",
            city_id: cityId,
            district_id: districtId,
            payment_method: property.payment_method || "",
            pricePerMeter: property.pricePerMeter || "",
            PropertyType: propertyType,
            advertising_license: property.advertising_license || "",
            owner_number: property.owner_number || "",
            faqs: property.faqs || "",
            video_url: property.video_url || "",
            virtual_tour: property.virtual_tour || "",
          }));

          // تعيين الصور الموجودة مسبقاً للعرض
          let thumbnailUrl: string | null = null;
          let galleryUrls: string[] = [];
          let floorPlanUrls: string[] = [];

          if (isDraft) {
            thumbnailUrl =
              property.featured_image_url ||
              (property.featured_image && property.featured_image !== ""
                ? property.featured_image
                : null);
            galleryUrls =
              property.gallery_images && Array.isArray(property.gallery_images)
                ? property.gallery_images.filter((img: string) => img && img !== "")
                : [];
            floorPlanUrls =
              property.floor_planning_image &&
              Array.isArray(property.floor_planning_image)
                ? property.floor_planning_image.filter((img: string) => img && img !== "")
                : [];
          } else {
            thumbnailUrl =
              property.featured_image && property.featured_image !== ""
                ? property.featured_image
                : null;
            galleryUrls = property.gallery
              ? Array.isArray(property.gallery)
                ? property.gallery.filter((img: string) => img && img !== "")
                : [property.gallery].filter((img: string) => img && img !== "")
              : [];
            floorPlanUrls = property.floor_planning_image
              ? Array.isArray(property.floor_planning_image)
                ? property.floor_planning_image.filter((img: string) => img && img !== "")
                : [property.floor_planning_image].filter(
                    (img: string) => img && img !== "",
                  )
              : [];
          }

          setPreviews({
            thumbnail: thumbnailUrl,
            gallery: galleryUrls,
            floorPlans: floorPlanUrls,
            deedImage: property.deed_number || null,
          });
        } catch (error) {
          toast.error(
            "حدث خطأ أثناء جلب بيانات الوحدة. يرجى المحاولة مرة أخرى.",
          );
        } finally {
          setLoadingProperty(false);
        }
      };
      fetchPropertyData();
    }
  }, [
    mode,
    id,
    userToken,
    authLoading,
    isDraft,
    setFormData,
    setPreviews,
    setFaqs,
    setMissingFields,
    setMissingFieldsAr,
    setValidationErrors,
    setLoadingProperty,
    setProjects,
  ]);
};
