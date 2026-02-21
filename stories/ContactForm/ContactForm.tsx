"use client";

import { useState } from "react";
import type { ContactFormProps } from "./ContactForm.types";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_FIELDS,
  DEFAULT_LINKS,
  DEFAULT_SUBMIT_TEXT,
  DEFAULT_IMAGE_SRC,
  DEFAULT_IMAGE_ALT,
  DEFAULT_SHAPE_SRC,
} from "./data";

export const ContactForm = ({
  heading,
  description,
  fields,
  links,
  submitText,
  imageSrc,
  imageAlt,
  shapeSrc,
  onSubmit,
  dir = "rtl",
}: ContactFormProps) => {
  const _heading = heading ?? DEFAULT_HEADING;
  const _description = description ?? DEFAULT_DESCRIPTION;
  const _fields = fields ?? DEFAULT_FIELDS;
  const _links = links ?? DEFAULT_LINKS;
  const _submitText = submitText ?? DEFAULT_SUBMIT_TEXT;
  const _imageSrc = imageSrc ?? DEFAULT_IMAGE_SRC;
  const _imageAlt = imageAlt ?? DEFAULT_IMAGE_ALT;
  const _shapeSrc = shapeSrc ?? DEFAULT_SHAPE_SRC;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    select: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);
    onSubmit?.(formDataObj);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section dir={dir}>
      <div className="bg-[#F5EDE3] pt-12" id="call-us">
        <div className="app gap-2 lg:flex">
          {/* ── Form Section ───────────────────────────── */}
          <div className="flex-1">
            <div className="flex flex-col border-transparent">
              <span className="font-saudi text-5xl leading-[131%] font-bold">
                {_heading}
              </span>
              <p className="pt-11 font-bold lg:py-6">{_description}</p>
            </div>

            <form
              className="flex flex-col gap-6 py-11 lg:py-6 [&_[data-slot='form-control']]:bg-black"
              onSubmit={handleSubmit}
            >
              {/* First Name */}
              <div data-slot="form-item" className="grid gap-2">
                <input
                  data-slot="form-control"
                  className="text-[#b28966] placeholder:text-[#b28966]/50 flex h-9 w-full min-w-0 rounded-sm border-[0.6px] border-white bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none lg:text-sm focus-visible:border-[#a1a1a8] focus-visible:ring-[#a1a1a8]/50 focus-visible:ring-[3px]"
                  placeholder={_fields.firstName}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div data-slot="form-item" className="grid gap-2">
                <input
                  data-slot="form-control"
                  className="text-[#b28966] placeholder:text-[#b28966]/50 flex h-9 w-full min-w-0 rounded-sm border-[0.6px] border-white bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none lg:text-sm focus-visible:border-[#a1a1a8] focus-visible:ring-[#a1a1a8]/50 focus-visible:ring-[3px]"
                  placeholder={_fields.lastName}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div data-slot="form-item" className="grid gap-2">
                <input
                  data-slot="form-control"
                  className="text-[#b28966] placeholder:text-[#b28966]/50 flex h-9 w-full min-w-0 rounded-sm border-[0.6px] border-white bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none lg:text-sm focus-visible:border-[#a1a1a8] focus-visible:ring-[#a1a1a8]/50 focus-visible:ring-[3px]"
                  placeholder={_fields.phone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Select Dropdown */}
              <div data-slot="form-item" className="grid gap-2">
                <select
                  data-slot="select-trigger"
                  className="text-[#b28966] data-[placeholder]:text-[#b28966]/50 flex w-full items-center justify-between gap-2 rounded-sm border-[0.6px] border-white px-2 py-1 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] h-9 bg-black"
                  name="select"
                  value={formData.select}
                  onChange={handleChange}
                >
                  <option value="">{_fields.select}</option>
                </select>
              </div>

              {/* Links */}
              <div className="flex justify-between text-black lg:justify-start lg:gap-x-3.5">
                <span className="text-xs">
                  {_links.investment.text}{" "}
                  <a className="font-bold" href={_links.investment.href}>
                    هنا
                  </a>
                </span>
                <span className="text-xs">
                  {_links.suppliers.text}{" "}
                  <a className="font-bold" href={_links.suppliers.href}>
                    هنا
                  </a>
                </span>
              </div>

              {/* Message */}
              <div data-slot="form-item" className="grid gap-2">
                <textarea
                  data-slot="form-control"
                  className="text-[#b28966] placeholder:text-[#b28966]/50 flex field-sizing-content w-full rounded-md border-[0.6px] border-white bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] lg:text-sm min-h-32"
                  placeholder={_fields.message}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button
                data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all bg-[#d09260] rounded-sm font-bold text-white min-h-9 p-2 w-fit px-10 mt-6 outline-none focus-visible:ring-[3px]"
                type="submit"
              >
                {_submitText}
              </button>
            </form>
          </div>

          {/* ── Image Section ───────────────────────────── */}
          <div className="gap- relative flex lg:max-w-[60%] lg:basis-[60%]">
            <div className="relative z-20 mx-auto mt-auto aspect-square w-full md:w-1/2 lg:w-full">
              <img
                alt={_imageAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                src={_imageSrc}
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            {/* Decorative Shapes */}
            <img
              alt="shape"
              src={_shapeSrc}
              className="absolute top-0 right-0 hidden -translate-x-[174px] translate-y-16 lg:block"
            />
            <img
              alt="shape"
              src={_shapeSrc}
              className="absolute top-0 right-0 hidden size-56 -translate-x-7 translate-y-[353px] lg:block"
            />
            <img
              alt="shape"
              src={_shapeSrc}
              className="absolute top-0 left-0 hidden translate-x-8 translate-y-[253px] lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
