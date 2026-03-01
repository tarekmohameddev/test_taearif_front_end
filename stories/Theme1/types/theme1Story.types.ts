/**
 * Types for Theme1 Storybook stories.
 * Component names and import path metadata for theme1 from themesComponentsList.json.
 */

export type Theme1ComponentName = string;

export interface Theme1ComponentMeta {
  componentName: Theme1ComponentName;
  baseName: string;
  subPath: string;
  importPath: string;
}

export interface Theme1StoryOptions {
  useStore?: boolean;
  title?: string;
}
