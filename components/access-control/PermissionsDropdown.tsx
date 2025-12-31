"use client";

import { useMemo, useState, useEffect } from "react";
import Select, { MultiValue, StylesConfig, components } from "react-select";
import { getPermissionGroupAr } from "@/lib/permissionGroupsTranslation";

// Types
interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  guard_name: string;
  team_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface PermissionsResponse {
  status: string;
  data: Permission[];
  grouped: {
    [key: string]: Permission[];
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface OptionType {
  value: string;
  label: string;
  isGroup?: boolean;
  groupName?: string;
  permission?: Permission;
}

interface PermissionsDropdownProps {
  permissions: PermissionsResponse | null;
  selectedPermissions: { [key: string]: boolean };
  handlePermissionChange: (permissionName: string, checked: boolean) => void;
  handleGroupPermissionChange: (groupName: string, checked: boolean) => void;
  isLoading?: boolean;
}

export function PermissionsDropdown({
  permissions,
  selectedPermissions,
  handlePermissionChange,
  handleGroupPermissionChange,
  isLoading = false,
}: PermissionsDropdownProps) {
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  // Convert permissions data to react-select format
  const options = useMemo(() => {
    if (!permissions || !permissions.grouped) return [];

    const formattedOptions: OptionType[] = [];

    Object.entries(permissions.grouped).forEach(
      ([groupName, groupPermissions]) => {
        // Add parent option (group) - as header only, not selectable
        const groupLabel =
          getPermissionGroupAr(groupName) || groupName.replace(/\./g, " ");
        formattedOptions.push({
          value: `group:${groupName}`,
          label: `${groupLabel} (${groupPermissions.length} صلاحية)`,
          isGroup: true,
          groupName: groupName,
        });

        // Add child options (permissions)
        groupPermissions.forEach((permission) => {
          const permissionLabel =
            permission.name_ar || permission.name_en || permission.name;
          formattedOptions.push({
            value: `permission:${permission.name}`,
            label: permissionLabel,
            isGroup: false,
            groupName: groupName,
            permission: permission,
          });
        });
      },
    );

    return formattedOptions;
  }, [permissions]);

  // Get currently selected values - only individual permissions, no groups
  const selectedValues = useMemo(() => {
    const values: OptionType[] = [];

    if (!permissions || !permissions.grouped) return values;

    // Only add individual permissions, never add groups
    Object.entries(permissions.grouped).forEach(
      ([groupName, groupPermissions]) => {
        groupPermissions.forEach((permission) => {
          if (selectedPermissions[permission.name]) {
            const permissionLabel =
              permission.name_ar || permission.name_en || permission.name;
            values.push({
              value: `permission:${permission.name}`,
              label: permissionLabel,
              isGroup: false,
              groupName: groupName,
              permission: permission,
            });
          }
        });
      },
    );

    return values;
  }, [permissions, selectedPermissions]);

  // Handle selection change - only handle individual permissions
  const handleChange = (selected: MultiValue<OptionType>) => {
    if (!permissions || !permissions.grouped) return;

    const selectedArray = selected || [];
    const newSelectedPermissions: { [key: string]: boolean } = {};

    // Initialize all permissions as false
    Object.values(permissions.grouped).forEach((groupPermissions) => {
      groupPermissions.forEach((permission) => {
        newSelectedPermissions[permission.name] = false;
      });
    });

    // Process only individual permissions (groups are not selectable)
    selectedArray.forEach((option) => {
      if (option.permission && !option.isGroup) {
        newSelectedPermissions[option.permission.name] = true;
      }
    });

    // Update all permissions that changed
    Object.keys(newSelectedPermissions).forEach((permissionName) => {
      const isSelected = newSelectedPermissions[permissionName];
      const wasSelected = selectedPermissions[permissionName] === true;
      if (isSelected !== wasSelected) {
        handlePermissionChange(permissionName, isSelected);
      }
    });
  };

  // Custom styles for react-select
  const customStyles: StylesConfig<OptionType, true> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#000" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #000" : "none",
      "&:hover": {
        borderColor: "#000",
      },
      minHeight: "32px",
      width: "100%",
      padding: "2px 4px",
      fontSize: "12px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      maxHeight: "300px", // تحديد الحد الأقصى لارتفاع القائمة
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f3f4f6" : "white",
      color: "#111827",
      paddingRight: state.data.isGroup ? "12px" : "12px",
      paddingLeft: state.data.isGroup ? "12px" : "12px",
      paddingTop: "4px",
      paddingBottom: "4px",
      fontSize: "12px",
      fontWeight: state.data.isGroup ? "600" : "400",
      lineHeight: "1.4",
      direction: "rtl",
      textAlign: "right",
      "&:active": {
        backgroundColor: "#e5e7eb",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      margin: "2px",
      padding: "0",
      fontSize: "11px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#111827",
      padding: "2px 4px",
      fontSize: "11px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#111827",
      padding: "2px 4px",
      fontSize: "11px",
      "&:hover": {
        backgroundColor: "#e5e7eb",
        color: "#111827",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "12px",
      margin: "0",
      padding: "0",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
  };

  // Custom Checkbox Component
  const CustomCheckbox = ({ checked }: { checked: boolean }) => {
    return (
      <div className="flex items-center justify-center ml-1 mr-1 flex-shrink-0">
        <div
          className={`
            w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
            ${
              checked
                ? "bg-black border-black"
                : "bg-white border-gray-300 hover:border-gray-400"
            }
          `}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
      </div>
    );
  };

  // Custom Option component to handle group clicks
  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps, isSelected } = props;

    if (data.isGroup) {
      // Group is a header - make it clickable to select all permissions
      const allSelected =
        permissions?.grouped[data.groupName]?.every(
          (p: Permission) => selectedPermissions[p.name] === true,
        ) || false;

      return (
        <div
          ref={innerRef}
          {...innerProps}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            // Toggle all permissions in the group
            const groupPermissions = permissions?.grouped[data.groupName] || [];
            const shouldSelect = !allSelected;
            groupPermissions.forEach((permission: Permission) => {
              handlePermissionChange(permission.name, shouldSelect);
            });
          }}
          className="react-select__option react-select__option--is-group flex items-center cursor-pointer"
          style={{
            paddingRight: "12px",
            paddingLeft: "12px",
            paddingTop: "8px",
            paddingBottom: "8px",
            fontSize: "12px",
            fontWeight: "600",
            lineHeight: "1.4",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <CustomCheckbox checked={allSelected} />
          <span className="flex-1">{data.label}</span>
        </div>
      );
    }

    // Regular permission option with checkbox
    const permissionSelected = data.permission
      ? selectedPermissions[data.permission.name] === true
      : false;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="react-select__option flex items-center cursor-pointer"
        style={{
          paddingRight: "36px",
          paddingLeft: "12px",
          paddingTop: "8px",
          paddingBottom: "8px",
          fontSize: "12px",
          fontWeight: "400",
          lineHeight: "1.4",
          direction: "rtl",
          textAlign: "right",
        }}
      >
        <CustomCheckbox checked={permissionSelected} />
        <span className="flex-1">{data.label}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <span className="text-sm text-gray-600 font-medium">
            جاري تحميل الصلاحيات...
          </span>
        </div>
      </div>
    );
  }

  if (!permissions || Object.keys(permissions.grouped).length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-600">لا توجد صلاحيات متاحة</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select<OptionType, true>
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        styles={customStyles}
        placeholder="اختر الصلاحيات..."
        isSearchable
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "لا توجد خيارات"}
        loadingMessage={() => "جاري التحميل..."}
        menuPortalTarget={menuPortalTarget}
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
        maxMenuHeight={300}
        components={{
          Option: CustomOption,
        }}
        isOptionDisabled={(option) => option.isGroup === true}
      />
    </div>
  );
}
