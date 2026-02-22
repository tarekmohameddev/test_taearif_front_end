"use client";

import { useMemo, useState, useEffect } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

export interface CustomerOption {
  id: number | string;
  name: string;
  phone?: string;
}

interface OptionType {
  value: number;
  label: string;
  customerId: number;
}

interface CustomersCheckboxesDropdownProps {
  customers: CustomerOption[];
  selectedCustomerIds: number[];
  onSelectionChange: (ids: number[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  /** When true, show "تحميل المزيد" at the end of the dropdown menu */
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLoading?: boolean;
}

export function CustomersCheckboxesDropdown({
  customers,
  selectedCustomerIds,
  onSelectionChange,
  isLoading = false,
  placeholder = "اختر العملاء...",
  hasMore = false,
  onLoadMore,
  loadMoreLoading = false,
}: CustomersCheckboxesDropdownProps) {
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  const options: OptionType[] = useMemo(() => {
    return customers.map((c) => {
      const id = typeof c.id === "string" ? Number(c.id) : c.id;
      const label = c.phone ? `${c.name} — ${c.phone}` : c.name;
      return { value: id, label, customerId: id };
    });
  }, [customers]);

  const selectedValues = useMemo(() => {
    return options.filter((opt) => selectedCustomerIds.includes(opt.customerId));
  }, [options, selectedCustomerIds]);

  const handleChange = (selected: MultiValue<OptionType>) => {
    const ids = (selected || []).map((o) => o.customerId);
    onSelectionChange(ids);
  };

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
      maxHeight: 300,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f3f4f6" : "white",
      color: "#111827",
      paddingRight: "12px",
      paddingLeft: "12px",
      paddingTop: "4px",
      paddingBottom: "4px",
      fontSize: "12px",
      fontWeight: "400",
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

  const CustomCheckbox = ({ checked }: { checked: boolean }) => (
    <div className="flex items-center justify-center ml-1 mr-1 flex-shrink-0">
      <div
        className={`
          w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
          ${checked ? "bg-black border-black" : "bg-white border-gray-300 hover:border-gray-400"}
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

  const CustomOption = (props: { data: OptionType; innerRef: React.Ref<HTMLDivElement>; innerProps: React.HTMLAttributes<HTMLDivElement> }) => {
    const { data, innerRef, innerProps } = props;
    const checked = selectedCustomerIds.includes(data.customerId);
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
        <CustomCheckbox checked={checked} />
        <span className="flex-1">{data.label}</span>
      </div>
    );
  };

  const MENU_MAX_HEIGHT = 300;

  const CustomMenuList = (props: { children: React.ReactNode; innerRef?: React.Ref<HTMLDivElement>; innerProps?: React.HTMLAttributes<HTMLDivElement> }) => {
    const { children, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="react-select__menu-list flex flex-col"
        style={{ maxHeight: MENU_MAX_HEIGHT }}
      >
        <div
          className="overflow-y-auto flex-1 min-h-0"
          style={{ maxHeight: hasMore && onLoadMore ? MENU_MAX_HEIGHT - 48 : MENU_MAX_HEIGHT }}
        >
          {children}
        </div>
        {hasMore && onLoadMore && (
          <div className="border-t border-gray-200 p-2 flex-shrink-0" style={{ direction: "rtl", textAlign: "right" }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLoadMore();
              }}
              disabled={loadMoreLoading}
              className="w-full py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              {loadMoreLoading ? "جاري التحميل..." : "تحميل المزيد"}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <span className="text-sm text-gray-600 font-medium">جاري تحميل العملاء...</span>
        </div>
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-600">لا يوجد عملاء متاحون</p>
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
        placeholder={placeholder}
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
          Option: CustomOption as React.ComponentType<unknown>,
          MenuList: CustomMenuList as React.ComponentType<unknown>,
        }}
      />
    </div>
  );
}
