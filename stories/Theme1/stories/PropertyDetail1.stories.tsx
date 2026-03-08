import type { Meta, StoryObj } from "@storybook/nextjs";
import PropertyDetail1 from "@/components/tenant/propertyDetail/propertyDetail1";
import { Theme1Decorator } from "../decorators";
import useAuthStore from "@/context/AuthContext";
import React, { useEffect } from "react";

function StorybookLiveEditorPath({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.location.pathname + window.location.search + window.location.hash;
    // Storybook-only: PropertyDetail uses window.location.pathname to decide "live-editor" mode.
    // In live-editor mode it uses mock data instead of real API calls.
    window.history.pushState({}, "", "/live-editor");
    return () => {
      window.history.pushState({}, "", prev);
    };
  }, []);
  return <>{children}</>;
}

const meta: Meta<typeof PropertyDetail1> = {
  title: "Theme1/PropertyDetail/PropertyDetail1",
  component: PropertyDetail1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      // Storybook-only: ensure useTenantId() can resolve tenantId
      // (it reads from AuthContext zustand store: userData.username)
      if (typeof window !== "undefined") {
        const current = useAuthStore.getState();
        if (!current.userData?.username) {
          useAuthStore.setState({
            ...current,
            UserIslogged: true,
            IsLoading: false,
            userData: {
              ...(current.userData || {}),
              username: "demo",
            },
          });
        }
      }
      return (
        <StorybookLiveEditorPath>
          <Story />
        </StorybookLiveEditorPath>
      );
    },
    Theme1Decorator,
  ],
  args: { useStore: false, propertySlug: "mock-property" },
};

export default meta;
type Story = StoryObj<typeof PropertyDetail1>;

export const Default: Story = {};
