import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import ResetPassword from "./ResetPassword";
import AuthLayout from "../AuthLayout/AuthLayout";

const meta = {
  title: "AuthPages/ResetPassword",
  component: ResetPassword,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      React.createElement(AuthLayout, null, React.createElement(Story, null)),
  ],
} satisfies Meta<typeof ResetPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCountdown: Story = {
  args: {
    resendCountdown: 45,
  },
};

export const WithError: Story = {
  args: {
    error: "رمز التحقق غير صحيح أو منتهي الصلاحية",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
