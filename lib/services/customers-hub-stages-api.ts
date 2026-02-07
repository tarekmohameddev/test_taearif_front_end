import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "/v2/customers-hub/stages";

export interface Stage {
  id: number;                    // Internal DB id
  stage_id: string;              // Unique slug (e.g., "new_lead")
  stage_name_ar: string;
  stage_name_en: string;
  color: string;                 // Hex color
  order: number;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetStagesParams {
  active_only?: boolean;
  order_by?: "order" | "created_at";
}

export interface GetStagesResponse {
  success: boolean;
  status: "success" | "error";
  code: number;
  message: string;
  data: {
    stages: Stage[];
    total: number;
  };
  timestamp: string;
}

export interface CreateStageParams {
  stage_id: string;
  stage_name_ar: string;
  stage_name_en: string;
  color: string;
  order: number;
  description?: string;
  is_active?: boolean;
}

export interface CreateStageResponse {
  success: boolean;
  status: "success" | "error";
  code: number;
  message: string;
  data: Stage;
  timestamp: string;
}

export interface UpdateStageParams {
  stage_name_ar?: string;
  stage_name_en?: string;
  color?: string;
  order?: number;
  description?: string;
  is_active?: boolean;
}

export interface UpdateStageResponse {
  success: boolean;
  status: "success" | "error";
  code: number;
  message: string;
  data: Stage;
  timestamp: string;
}

export interface DeleteStageResponse {
  success: boolean;
  status: "success" | "error";
  code: number;
  message: string;
  data: null | {
    requests_count?: number;
  };
  timestamp: string;
}

// Get all stages
export async function getStages(
  params?: GetStagesParams
): Promise<GetStagesResponse> {
  const queryParams = new URLSearchParams();
  if (params?.active_only !== undefined) {
    queryParams.append("active_only", params.active_only.toString());
  }
  if (params?.order_by) {
    queryParams.append("order_by", params.order_by);
  }

  const url = `${BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await axiosInstance.get<GetStagesResponse>(url);
  return response.data;
}

// Create a new stage
export async function createStage(
  params: CreateStageParams
): Promise<CreateStageResponse> {
  const response = await axiosInstance.post<CreateStageResponse>(BASE_URL, params);
  return response.data;
}

// Update an existing stage
export async function updateStage(
  stageId: string,
  params: UpdateStageParams
): Promise<UpdateStageResponse> {
  const response = await axiosInstance.put<UpdateStageResponse>(
    `${BASE_URL}/${stageId}`,
    params
  );
  return response.data;
}

// Delete a stage
export async function deleteStage(
  stageId: string
): Promise<DeleteStageResponse> {
  const response = await axiosInstance.delete<DeleteStageResponse>(
    `${BASE_URL}/${stageId}`
  );
  return response.data;
}
