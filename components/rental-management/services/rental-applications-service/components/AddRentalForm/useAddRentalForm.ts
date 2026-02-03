import { useState, useEffect } from "react";
import { fetchProjectsAPI, fetchPropertiesAPI } from "../../services/api";

export const useAddRentalForm = () => {
  const [formData, setFormData] = useState({
    tenant_full_name: "",
    contract_number: "",
    tenant_phone: "",
    tenant_email: "",
    tenant_job_title: "",
    tenant_social_status: "single",
    tenant_national_id: "",
    office_commission_type: "percentage",
    office_commission_value: "",
    property_number: "",
    property_id: "",
    project_id: "",
    unit_label: "",
    move_in_date: "",
    rental_period: 12,
    paying_plan: "monthly",
    base_rent_amount: "",
    currency: "SAR",
    deposit_amount: "",
    platform_fee: "",
    water_fee: "",
    notes: "",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openProject, setOpenProject] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, propertiesRes] = await Promise.all([
          fetchProjectsAPI(),
          fetchPropertiesAPI(),
        ]);

        if (
          projectsRes?.data?.projects &&
          Array.isArray(projectsRes.data.projects)
        ) {
          setProjects(projectsRes.data.projects);
        } else if (
          projectsRes?.projects &&
          Array.isArray(projectsRes.projects)
        ) {
          setProjects(projectsRes.projects);
        } else {
          setProjects([]);
        }

        if (
          propertiesRes?.data?.properties &&
          Array.isArray(propertiesRes.data.properties)
        ) {
          setProperties(propertiesRes.data.properties);
        } else if (
          propertiesRes?.properties &&
          Array.isArray(propertiesRes.properties)
        ) {
          setProperties(propertiesRes.properties);
        } else {
          setProperties([]);
        }
      } catch (error) {
        setErrors({ general: "حدث خطأ في جلب البيانات" });
        setProjects([]);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.tenant_full_name.trim()) {
      newErrors.tenant_full_name = "الاسم الكامل مطلوب";
    }
    if (!formData.tenant_phone.trim()) {
      newErrors.tenant_phone = "رقم الهاتف مطلوب";
    }
    if (!formData.move_in_date.trim()) {
      newErrors.move_in_date = "تاريخ الانتقال مطلوب";
    }
    if (!formData.rental_period || formData.rental_period <= 0) {
      newErrors.rental_period = "مدة الإيجار مطلوبة ولا تقل عن شهر واحد";
    }
    if (
      !formData.base_rent_amount ||
      parseFloat(formData.base_rent_amount) < 100
    ) {
      newErrors.base_rent_amount = "مبلغ الإيجار مطلوب ولا يقل عن 100 ريال";
    }

    if (
      formData.tenant_phone &&
      !/^[0-9+\-\s()]+$/.test(formData.tenant_phone)
    ) {
      newErrors.tenant_phone = "رقم الهاتف غير صحيح";
    }

    if (
      formData.tenant_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant_email)
    ) {
      newErrors.tenant_email = "البريد الإلكتروني غير صحيح";
    }

    if (
      formData.rental_period &&
      (isNaN(formData.rental_period) || formData.rental_period <= 0)
    ) {
      newErrors.rental_period = "مدة الإيجار يجب أن تكون رقم صحيح أكبر من 0";
    }

    if (
      formData.base_rent_amount &&
      (isNaN(parseFloat(formData.base_rent_amount)) ||
        parseFloat(formData.base_rent_amount) < 100)
    ) {
      newErrors.base_rent_amount =
        "مبلغ الإيجار يجب أن يكون رقم صحيح لا يقل عن 100 ريال";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    projects,
    properties,
    loading,
    errors,
    setErrors,
    openProject,
    setOpenProject,
    openProperty,
    setOpenProperty,
    validateForm,
  };
};
