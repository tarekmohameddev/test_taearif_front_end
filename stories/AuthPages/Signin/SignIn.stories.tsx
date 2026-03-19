import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import SignIn from "./SignIn";
import AuthLayout from "../AuthLayout/AuthLayout";

const meta = {
  title: "AuthPages/SignIn",
  component: SignIn,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) =>
      React.createElement(AuthLayout, null, React.createElement(Story, null)),
  ],
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
