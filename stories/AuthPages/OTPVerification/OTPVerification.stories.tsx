import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import OTPVerification from "./OTPVerification";
import AuthLayout from "../AuthLayout/AuthLayout";

const meta = {
  title: "AuthPages/OTPVerification",
  component: OTPVerification,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      React.createElement(AuthLayout, null, React.createElement(Story, null)),
  ],
} satisfies Meta<typeof OTPVerification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phone: "+966 512***78",
    resendCountdown: 60,
    testCode: "12345",
  },
};

export const CanResend: Story = {
  args: {
    phone: "+966 512***78",
    resendCountdown: 0,
    testCode: "12345",
  },
};

export const WithError: Story = {
  args: {
    phone: "+966 512***78",
    resendCountdown: 45,
    error: "الرمز غير صحيح، يرجى المحاولة مرة أخرى",
    testCode: "12345",
  },
};

export const Loading: Story = {
  args: {
    phone: "+966 512***78",
    isLoading: true,
    testCode: "12345",
  },
};
