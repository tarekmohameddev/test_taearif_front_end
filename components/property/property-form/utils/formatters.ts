import { uploadSingleFile } from "@/utils/uploadSingle";
import { uploadMultipleFiles } from "@/utils/uploadMultiple";
import { uploadVideo, uploadDeedImage } from "../services/uploadService";

export interface FormData {
  [key: string]: any;
}

export interface Images {
  thumbnail?: File | null;
  gallery?: File[];
  floorPlans?: File[];
  deedImage?: File | null;
  [key: string]: any;
}

export interface Previews {
  thumbnail?: string | null;
  gallery?: string[];
  floorPlans?: string[];
  [key: string]: any;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  displayOnPage: boolean;
}

export const formatPropertyData = async (
  formData: FormData,
  images: Images,
  previews: Previews,
  video: File | null,
  videoPreview: string | null,
  faqs: FAQ[],
  mode: "add" | "edit",
): Promise<any> => {
  let thumbnailPath = null;
  let galleryPaths: string[] = [];
  let floorPlansPaths: string[] = [];
  let videoPaths: string[] = [];

  // رفع الصور للإضافة أو إذا تم تغييرها في التعديل
  if (images.thumbnail) {
    const uploadedFile = await uploadSingleFile(images.thumbnail, "property");
    thumbnailPath =
      mode === "add"
        ? uploadedFile.path.replace(
            process.env.NEXT_PUBLIC_Backend_URLWithOutApi || "",
            "",
          )
        : uploadedFile.url;
  }

  if (images.gallery && images.gallery.length > 0) {
    const uploadedFiles = await uploadMultipleFiles(images.gallery, "property");
    galleryPaths =
      mode === "add"
        ? uploadedFiles.map((f: any) =>
            f.path.replace(
              process.env.NEXT_PUBLIC_Backend_URLWithOutApi || "",
              "",
            ),
          )
        : uploadedFiles.map((f: any) => f.url);
  }

  if (images.floorPlans && images.floorPlans.length > 0) {
    const uploadedFiles = await uploadMultipleFiles(
      images.floorPlans,
      "property",
    );
    floorPlansPaths =
      mode === "add"
        ? uploadedFiles.map((f: any) =>
            f.path.replace(
              process.env.NEXT_PUBLIC_Backend_URLWithOutApi || "",
              "",
            ),
          )
        : uploadedFiles.map((f: any) => f.url);
  }

  // رفع الفيديو
  if (video) {
    const uploadedFile = await uploadVideo(video);
    videoPaths = [uploadedFile.url];
  }

  // رفع صورة السند
  let deedImagePath = "";
  if (images.deedImage) {
    const uploadedDeedImage = await uploadDeedImage(images.deedImage);
    deedImagePath = uploadedDeedImage.path || uploadedDeedImage.url;
  }

  return {
    title: formData.title,
    address: formData.address,
    building_id: formData.building_id,
    water_meter_number: formData.water_meter_number,
    electricity_meter_number: formData.electricity_meter_number,
    deed_number: deedImagePath,
    price: Number(formData.price),
    beds: parseInt(formData.bedrooms) || 0,
    bath: parseInt(formData.bathrooms) || 0,
    size: parseInt(formData.size) || 0,
    features:
      mode === "add" ? formData.features.join(", ") : formData.features,
    status: 0, // Will be set by publish parameter
    featured_image: thumbnailPath || previews.thumbnail,
    floor_planning_image:
      floorPlansPaths.length > 0 ? floorPlansPaths : previews.floorPlans,
    gallery: galleryPaths.length > 0 ? galleryPaths : previews.gallery,
    description: formData.description,
    latitude: formData.latitude,
    longitude: formData.longitude,
    featured: formData.featured,
    area: parseInt(formData.size) || 0,
    project_id: formData.project_id,
    purpose: formData.purpose,
    category_id: parseInt(formData.category) || 0,
    city_id: formData.city_id,
    state_id: formData.district_id,
    rooms: parseInt(formData.rooms) || 0,
    floors: parseInt(formData.floors) || 0,
    floor_number: parseInt(formData.floor_number) || 0,
    driver_room: parseInt(formData.driver_room) || 0,
    maid_room: parseInt(formData.maid_room) || 0,
    dining_room: parseInt(formData.dining_room) || 0,
    living_room: parseInt(formData.living_room) || 0,
    majlis: parseInt(formData.majlis) || 0,
    storage_room: parseInt(formData.storage_room) || 0,
    basement: parseInt(formData.basement) || 0,
    swimming_pool: parseInt(formData.swimming_pool) || 0,
    kitchen: parseInt(formData.kitchen) || 0,
    balcony: parseInt(formData.balcony) || 0,
    garden: parseInt(formData.garden) || 0,
    annex: parseInt(formData.annex) || 0,
    elevator: parseInt(formData.elevator) || 0,
    private_parking: parseInt(formData.private_parking) || 0,
    facade_id: parseInt(formData.facade_id) || 0,
    length: parseFloat(formData.length) || 0,
    width: parseFloat(formData.width) || 0,
    street_width_north: parseFloat(formData.street_width_north) || 0,
    street_width_south: parseFloat(formData.street_width_south) || 0,
    street_width_east: parseFloat(formData.street_width_east) || 0,
    street_width_west: parseFloat(formData.street_width_west) || 0,
    building_age: parseFloat(formData.building_age) || 0,
    payment_method: formData.payment_method || null,
    pricePerMeter: formData.pricePerMeter || 0,
    type: formData.PropertyType || "",
    advertising_license: formData.advertising_license || "",
    owner_number: formData.owner_number || "",
    faqs: faqs,
    video_url: videoPaths.length > 0 ? videoPaths[0] : formData.video_url || "",
    virtual_tour: formData.virtual_tour || "",
  };
};
