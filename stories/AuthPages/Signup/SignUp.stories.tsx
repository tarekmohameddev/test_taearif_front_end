import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import SignUp from "./SignUp";
import AuthLayout from "../AuthLayout/AuthLayout";

const meta = {
  title: "AuthPages/SignUp",
  component: SignUp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      React.createElement(
        AuthLayout,
        null,
        React.createElement(Story, null)
      ),
  ],
} satisfies Meta<typeof SignUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "رقم الجوال غير صالح يجب أن يبدأ بـ 5 ويتكون من 9 أرقام",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
