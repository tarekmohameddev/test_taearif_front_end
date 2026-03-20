import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import ForgotPassword from "./ForgotPassword";
import AuthLayout from "../AuthLayout/AuthLayout";

const meta = {
  title: "AuthPages/ForgotPassword",
  component: ForgotPassword,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      React.createElement(AuthLayout, null, React.createElement(Story, null)),
  ],
} satisfies Meta<typeof ForgotPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "لم يتم العثور على المستخدم",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
