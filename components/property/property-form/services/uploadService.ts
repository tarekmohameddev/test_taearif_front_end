import axiosInstance from "@/lib/axiosInstance";

// دالة رفع الفيديوهات
export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("context", "property");
  formData.append("video", file);

  try {
    console.log("Uploading video:", file.name, "Size:", file.size);
    const response = await axiosInstance.post("/video/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Video upload response:", response.data);

    if (
      response.data &&
      response.data.status === "success" &&
      response.data.data
    ) {
      return response.data.data;
    } else {
      console.error("Unexpected response structure:", response.data);
      throw new Error("Unexpected response structure from video upload API");
    }
  } catch (error: any) {
    console.error("Video upload error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

// دالة رفع صورة السند
export const uploadDeedImage = async (file: File) => {
  const formData = new FormData();
  formData.append("deed_image", file);

  try {
    const response = await axiosInstance.post(
      "/properties/upload-deed-image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    if (
      response.data &&
      response.data.status === "success" &&
      response.data.data
    ) {
      return response.data.data;
    } else {
      throw new Error(
        "Unexpected response structure from deed image upload API",
      );
    }
  } catch (error: any) {
    console.error("Deed image upload error:", error);
    throw error;
  }
};
