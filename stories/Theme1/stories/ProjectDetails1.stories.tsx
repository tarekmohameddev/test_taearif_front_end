import type { Meta, StoryObj } from "@storybook/nextjs";
import ProjectDetails1 from "@/components/tenant/projectDetails/projectDetails1";
import { Theme1Decorator } from "../decorators";
import { getMergedDefaultDataForStory } from "../utils/defaultData";
import useAuthStore from "@/context/AuthContext";
import React, { useEffect } from "react";

function StorybookLiveEditorPath({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.location.pathname + window.location.search + window.location.hash;
    window.history.pushState({}, "", "/live-editor");
    return () => {
      window.history.pushState({}, "", prev);
    };
  }, []);
  return <>{children}</>;
}

const defaultData = (getMergedDefaultDataForStory("projectDetails1") ?? {}) as Record<string, unknown>;

const meta: Meta<typeof ProjectDetails1> = {
  title: "Theme1/ProjectDetails/ProjectDetails1",
  component: ProjectDetails1,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
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
  args: { useStore: false, projectSlug: "mock-project", ...defaultData },
};

export default meta;
type Story = StoryObj<typeof ProjectDetails1>;

export const Default: Story = {};
