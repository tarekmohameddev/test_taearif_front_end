import { ComponentStructure } from "./types";

export const videoStructure: ComponentStructure = {
  componentType: "video",
  variants: [
    {
      id: "video1",
      name: "Video 1 - Responsive Player",
      description: "Embedded video with fixed max width and responsive ratio",
      fields: [
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },
        {
          key: "video",
          label: "Video Source",
          type: "object",
          fields: [
            {
              key: "src",
              label: "Video URL",
              type: "text",
              placeholder:
                "YouTube: https://youtube.com/watch?v=... أو Vimeo: https://vimeo.com/...",
              description:
                "يمكنك إضافة رابط من YouTube أو Vimeo أو رابط مباشر للفيديو (MP4)",
            },
            {
              key: "poster",
              label: "Poster Image",
              type: "image",
              placeholder: "/images/placeholders/video/poster.jpg",
            },
            {
              key: "title",
              label: "Title",
              type: "text",
              placeholder: "Intro video",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Short description for the video",
            },
          ],
        },
        {
          key: "playback",
          label: "Playback Settings",
          type: "object",
          fields: [
            { key: "autoplay", label: "Autoplay", type: "boolean" },
            { key: "loop", label: "Loop", type: "boolean" },
            { key: "muted", label: "Muted", type: "boolean" },
            { key: "controls", label: "Show Controls", type: "boolean" },
            { key: "playsInline", label: "Plays Inline", type: "boolean" },
          ],
        },
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "aspectRatio",
              label: "Aspect Ratio",
              type: "select",
              options: [
                { value: "16:9", label: "16:9" },
                { value: "4:3", label: "4:3" },
                { value: "1:1", label: "1:1" },
              ],
              placeholder: "16:9",
            },
          ],
        },
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
            },
            {
              key: "borderRadius",
              label: "Border Radius",
              type: "text",
              placeholder: "12px",
            },
            {
              key: "shadow",
              label: "Shadow",
              type: "select",
              options: [
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "xl", label: "X-Large" },
                { value: "2xl", label: "2X-Large" },
              ],
              placeholder: "lg",
            },
            {
              key: "overlay",
              label: "Overlay",
              type: "object",
              fields: [
                { key: "enabled", label: "Enabled", type: "boolean" },
                {
                  key: "color",
                  label: "Overlay Color",
                  type: "color",
                  placeholder: "rgba(0,0,0,0.35)",
                },
              ],
            },
          ],
        },
      ],
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "video.src", label: "Video URL", type: "text" },
        { key: "video.poster", label: "Poster", type: "image" },
        { key: "playback.autoplay", label: "Autoplay", type: "boolean" },
      ],
    },
  ],
};
