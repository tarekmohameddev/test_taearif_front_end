import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

export default (set, get) => ({
  projectsManagement: {
    viewMode: "grid",
    projects: [],
    pagination: null,
    loadingProjects: false,
    error: null,
    isInitialized: false,
  },

  setProjectsManagement: (newState) =>
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        ...newState,
      },
    })),

  updateProject: (projectId, updatedData) => {
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        projects: state.projectsManagement.projects.map((project) => {
          if (project.id == projectId) {
            return {
              ...project,
              ...updatedData,
              contents: project.contents?.map((content, index) => ({
                ...content,
                title: index === 0 ? updatedData.name : content.title,
                address: index === 0 ? updatedData.location : content.address,
                description:
                  index === 0 ? updatedData.description : content.description,
              })),
            };
          }
          return project;
        }),
      },
    }));
  },

  fetchProjects: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب

    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        loadingProjects: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.get("/projects");
        },
        3,
        1000,
      );

      console.log("API Response received:", response.data);
      console.log("Projects count:", response.data.data.projects?.length);

      // تحديث الـ store مع البيانات الجديدة
      set((state) => {
        const newState = {
          projectsManagement: {
            ...state.projectsManagement,
            projects: response.data.data.projects || [],
            pagination: response.data.data.pagination || null,
            loadingProjects: false,
            isInitialized: true,
          },
        };
        console.log("New state being set:", newState);
        return newState;
      });

      console.log("Store updated with projects");
    } catch (error) {
      const errorInfo = logError(error, "fetchProjects");
      console.error("Error fetching projects:", error);

      set((state) => ({
        projectsManagement: {
          ...state.projectsManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء جلب بيانات المشاريع"),
          loadingProjects: false,
          isInitialized: true,
        },
      }));

      throw error;
    }
  },
});
