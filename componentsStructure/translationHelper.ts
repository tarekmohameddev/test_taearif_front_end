import {
  ComponentStructure,
  VariantDefinition,
  FieldDefinition,
} from "./types";

export function translateLabel(
  label: string,
  t: (key: string) => string,
): string {
  // Basic label mappings
  const labelMappings: Record<string, string> = {
    Visible: "components_structure.basic.visible",
    Padding: "components_structure.basic.padding",
    Desktop: "components_structure.basic.desktop",
    Tablet: "components_structure.basic.tablet",
    Mobile: "components_structure.basic.mobile",
    Title: "components_structure.basic.title",
    Description: "components_structure.basic.description",
    Text: "components_structure.basic.text",
    Weight: "components_structure.basic.weight",
    Style: "components_structure.basic.style",
    Width: "components_structure.basic.width",
    Height: "components_structure.basic.height",
    "Basic Animation": "components_structure.basic.animation",
    "Basic Responsive": "components_structure.basic.responsive",
    Margin: "components_structure.basic.margin",
    Border: "components_structure.basic.border",
    "Border Radius": "components_structure.basic.border_radius",
    "Box Shadow": "components_structure.basic.box_shadow",
    "Z-Index": "components_structure.basic.z_index",
    Gap: "components_structure.basic.gap",
    Container: "components_structure.basic.container",
    Content: "components_structure.basic.content",
    Position: "components_structure.basic.position",
    Top: "components_structure.basic.top",
    Bottom: "components_structure.basic.bottom",
    ID: "components_structure.basic.id",
    URL: "components_structure.basic.url",
    Required: "components_structure.basic.required",
    Placeholder: "components_structure.basic.placeholder",
    Type: "components_structure.basic.type",
    Rows: "components_structure.basic.rows",
    "Hover Effect": "components_structure.basic.hover_effect",
    Breakpoints: "components_structure.basic.breakpoints",
    "Duration (ms)": "components_structure.basic.duration_ms",
    "Delay (ms)": "components_structure.basic.delay_ms",
    "Stagger (ms)": "components_structure.basic.stagger_ms",
    "Stagger Delay (ms)": "components_structure.basic.stagger_delay_ms",
    Add: "components_structure.basic.add",
    "Add Step": "components_structure.basic.add_step",
    Step: "components_structure.basic.step",
    "Header Animation Enabled":
      "components_structure.basic.header_animation_enabled",
    "Steps Animation Enabled":
      "components_structure.basic.steps_animation_enabled",

    // Additional common labels
    Vertical: "components_structure.basic.vertical",
    Horizontal: "components_structure.basic.horizontal",
    Direction: "components_structure.basic.direction",
    "Text Width": "components_structure.basic.text_width",
    "Gap Between Sections": "components_structure.basic.gap_between_sections",
    "Minimum Height": "components_structure.basic.minimum_height",
    Static: "components_structure.basic.static",
    Sticky: "components_structure.basic.sticky",
    Fixed: "components_structure.basic.fixed",
    "Top (px)": "components_structure.basic.top_px",
    Heights: "components_structure.basic.heights",
    "Desktop (px)": "components_structure.basic.desktop_px",
    "Tablet (px)": "components_structure.basic.tablet_px",
    "Mobile (px)": "components_structure.basic.mobile_px",
    Subtitle: "components_structure.basic.subtitle",
    "Button Link": "components_structure.basic.button_link",
    "Image Alt": "components_structure.basic.image_alt",
    "Image Position": "components_structure.basic.image_position",
    "Show Image": "components_structure.basic.show_image",
    "Display Mode": "components_structure.basic.display_mode",
    Logos: "components_structure.basic.logos",
    "Both (Forward & Reverse)":
      "components_structure.basic.both_forward_reverse",
    "Forward Only": "components_structure.basic.forward_only",
    "Reverse Only": "components_structure.basic.reverse_only",
    "Animation Speed (seconds)":
      "components_structure.basic.animation_speed_seconds",
    "Pause on Hover": "components_structure.basic.pause_on_hover",
    "Logo Opacity": "components_structure.basic.logo_opacity",
    "Logo Hover Opacity": "components_structure.basic.logo_hover_opacity",
    "Left Position": "components_structure.basic.left_position",
    "Right Position": "components_structure.basic.right_position",
    "Top Position": "components_structure.basic.top",
    "Bottom Position": "components_structure.basic.bottom",

    // Colors section
    Colors: "components_structure.colors.colors",
    Primary: "components_structure.colors.primary",
    Secondary: "components_structure.colors.secondary",
    Accent: "components_structure.colors.accent",
    Hover: "components_structure.colors.hover",
    Focus: "components_structure.colors.focus",
    Success: "components_structure.colors.success",
    Warning: "components_structure.colors.warning",
    Error: "components_structure.colors.error",
    Info: "components_structure.colors.info",

    // Spacing section
    Spacing: "components_structure.spacing.spacing",
    "Space Between": "components_structure.spacing.space_between",
    "Space Around": "components_structure.spacing.space_around",
    "Space Evenly": "components_structure.spacing.space_evenly",

    // Typography section
    "Letter Spacing": "components_structure.typography.letter_spacing",
    "Text Align": "components_structure.typography.text_align",
    "Text Transform": "components_structure.typography.text_transform",
    "Text Decoration": "components_structure.typography.text_decoration",

    // Animation section
    Animation: "components_structure.animation.animation",
    Transition: "components_structure.animation.transition",
    Transform: "components_structure.animation.transform",
    Keyframes: "components_structure.animation.keyframes",

    // Responsive section
    "Large Desktop": "components_structure.responsive.large_desktop",

    // Border section
    "Border Width": "components_structure.border.border_width",
    "Border Style": "components_structure.border.border_style",
    "Border Color": "components_structure.border.border_color",
    "Border Top": "components_structure.border.border_top",
    "Border Right": "components_structure.border.border_right",
    "Border Bottom": "components_structure.border.border_bottom",
    "Border Left": "components_structure.border.border_left",

    // Shadow section
    Shadow: "components_structure.shadow.shadow",
    "Text Shadow": "components_structure.shadow.text_shadow",
    "Drop Shadow": "components_structure.shadow.drop_shadow",
    "Inner Shadow": "components_structure.shadow.inner_shadow",

    // Effects section
    Effects: "components_structure.effects.effects",
    Filter: "components_structure.effects.filter",
    "Backdrop Filter": "components_structure.effects.backdrop_filter",
    Blur: "components_structure.effects.blur",
    Brightness: "components_structure.effects.brightness",
    Contrast: "components_structure.effects.contrast",
    Grayscale: "components_structure.effects.grayscale",
    "Hue Rotate": "components_structure.effects.hue_rotate",
    Invert: "components_structure.effects.invert",
    Saturate: "components_structure.effects.saturate",
    Sepia: "components_structure.effects.sepia",

    // Common component labels that might be missing
    Show: "components_structure.basic.show",
    Hide: "components_structure.basic.hide",
    Display: "components_structure.basic.display",
    Visibility: "components_structure.basic.visibility",
    "Basic Opacity": "components_structure.basic.opacity",
    "Basic Z-Index": "components_structure.basic.z_index",
    "Basic Position": "components_structure.basic.position",
    Float: "components_structure.basic.float",
    Clear: "components_structure.basic.clear",
    Overflow: "components_structure.basic.overflow",
    "Display Type": "components_structure.basic.display_type",
    "Flex Direction": "components_structure.basic.flex_direction",
    "Justify Content": "components_structure.basic.justify_content",
    "Align Items": "components_structure.basic.align_items",
    "Flex Wrap": "components_structure.basic.flex_wrap",
    Order: "components_structure.basic.order",
    "Flex Grow": "components_structure.basic.flex_grow",
    "Flex Shrink": "components_structure.basic.flex_shrink",
    "Flex Basis": "components_structure.basic.flex_basis",
    "Grid Template Columns": "components_structure.basic.grid_template_columns",
    "Grid Template Rows": "components_structure.basic.grid_template_rows",
    "Grid Gap": "components_structure.basic.grid_gap",
    "Grid Column Gap": "components_structure.basic.grid_column_gap",
    "Grid Row Gap": "components_structure.basic.grid_row_gap",
    "Grid Area": "components_structure.basic.grid_area",
    "Grid Column": "components_structure.basic.grid_column",
    "Grid Row": "components_structure.basic.grid_row",
    "Grid Column Start": "components_structure.basic.grid_column_start",
    "Grid Column End": "components_structure.basic.grid_column_end",
    "Grid Row Start": "components_structure.basic.grid_row_start",
    "Grid Row End": "components_structure.basic.grid_row_end",
    "Justify Self": "components_structure.basic.justify_self",
    "Align Self": "components_structure.basic.align_self",
    "Place Self": "components_structure.basic.place_self",
    "Place Items": "components_structure.basic.place_items",
    "Place Content": "components_structure.basic.place_content",
    Auto: "components_structure.basic.auto",
    Min: "components_structure.basic.min",
    Max: "components_structure.basic.max",
    Fit: "components_structure.basic.fit",
    Fill: "components_structure.basic.fill",
    Stretch: "components_structure.basic.stretch",
    Start: "components_structure.basic.start",
    End: "components_structure.basic.end",
    Space: "components_structure.basic.space",
    Around: "components_structure.basic.around",
    Between: "components_structure.basic.between",
    Evenly: "components_structure.basic.evenly",
    Normal: "components_structure.basic.normal",
    Reverse: "components_structure.basic.reverse",
    Column: "components_structure.basic.column",
    Row: "components_structure.basic.row",
    Wrap: "components_structure.basic.wrap",
    Nowrap: "components_structure.basic.nowrap",
    "Wrap Reverse": "components_structure.basic.wrap_reverse",
    "Flex Start": "components_structure.basic.flex_start",
    "Flex End": "components_structure.basic.flex_end",
    "Flex Center": "components_structure.basic.center",
    "Flex Baseline": "components_structure.basic.baseline",
    "Flex Stretch": "components_structure.basic.stretch",
    "Self Start": "components_structure.basic.self_start",
    "Self End": "components_structure.basic.self_end",
    "Self Center": "components_structure.basic.self_center",
    "Self Baseline": "components_structure.basic.self_baseline",
    "Self Stretch": "components_structure.basic.self_stretch",
    Inherit: "components_structure.basic.inherit",
    Initial: "components_structure.basic.initial",
    Unset: "components_structure.basic.unset",

    // PhotosGrid specific labels
    "Photos Grid 1 - Responsive gallery":
      "components_structure.photosGrid.photos_grid_1",
    "Photos Grid 2 - Images only (no card)":
      "components_structure.photosGrid.photos_grid_2",
    "Grid Columns": "components_structure.photosGrid.grid_columns",
    "Mobile Columns": "components_structure.photosGrid.mobile_columns",
    "Tablet Columns": "components_structure.photosGrid.tablet_columns",
    "Desktop Columns": "components_structure.photosGrid.desktop_columns",
    "Gap Between Photos": "components_structure.photosGrid.gap_between_photos",
    "Section Padding": "components_structure.photosGrid.section_padding",
    "Top Padding": "components_structure.photosGrid.top_padding",
    "Bottom Padding": "components_structure.photosGrid.bottom_padding",
    "Image Aspect Ratio": "components_structure.photosGrid.image_aspect_ratio",
    "Eyebrow Text": "components_structure.photosGrid.eyebrow_text",
    "Section Title": "components_structure.photosGrid.section_title",
    "Section Subtitle": "components_structure.photosGrid.section_subtitle",
    Photos: "components_structure.photosGrid.photos",
    "Add Photo": "components_structure.photosGrid.add_photo",
    Photo: "components_structure.photosGrid.photo",
    "Photo ID": "components_structure.photosGrid.photo_id",
    "Image Source": "components_structure.photosGrid.image_source",
    "Tag / Category": "components_structure.photosGrid.tag_category",
    "Card Border Radius": "components_structure.photosGrid.card_border_radius",
    "Image Border Radius":
      "components_structure.photosGrid.image_border_radius",
    "Card Shadow": "components_structure.photosGrid.card_shadow",
    "Hover Scale": "components_structure.photosGrid.hover_scale",
    "Title Typography": "components_structure.photosGrid.title_typography",
    "Subtitle Typography":
      "components_structure.photosGrid.subtitle_typography",
    "Caption Typography": "components_structure.photosGrid.caption_typography",
    "Responsive Breakpoints":
      "components_structure.photosGrid.responsive_breakpoints",
    "Mobile Breakpoint": "components_structure.photosGrid.mobile_breakpoint",
    "Tablet Breakpoint": "components_structure.photosGrid.tablet_breakpoint",
    "Desktop Breakpoint": "components_structure.photosGrid.desktop_breakpoint",
    "Header Animation": "components_structure.photosGrid.header_animation",
    "Cards Animation": "components_structure.photosGrid.cards_animation",
    "Images Animation": "components_structure.photosGrid.images_animation",
    "Stagger (ms)": "components_structure.photosGrid.stagger_ms",

    // Video specific labels
    "Video 1 - Responsive Player": "components_structure.video.video_1",
    "Video Source": "components_structure.video.video_source",
    "Video URL": "components_structure.video.video_url",
    "Poster Image": "components_structure.video.poster_image",
    "Playback Settings": "components_structure.video.playback_settings",
    "Show Controls": "components_structure.video.show_controls",
    "Plays Inline": "components_structure.video.plays_inline",
    "Aspect Ratio": "components_structure.video.aspect_ratio",

    // ResponsiveImage specific labels
    "Responsive Image 1 - متجاوب لجميع الشاشات":
      "components_structure.responsiveImage.responsive_image_1",
    "Image URL": "components_structure.responsiveImage.image_url",
    "Max Width": "components_structure.responsiveImage.max_width",
    Alignment: "components_structure.responsiveImage.alignment",
    "Object Fit": "components_structure.responsiveImage.object_fit",
    Cover: "components_structure.responsiveImage.cover",
    Contain: "components_structure.responsiveImage.contain",
    Fill: "components_structure.responsiveImage.fill",
    "Scale Down": "components_structure.responsiveImage.scale_down",
    "Border Enabled": "components_structure.responsiveImage.border_enabled",
    "Border Width": "components_structure.responsiveImage.border_width",
    "Border Style": "components_structure.responsiveImage.border_style",
    Solid: "components_structure.responsiveImage.solid",
    Dashed: "components_structure.responsiveImage.dashed",
    Dotted: "components_structure.responsiveImage.dotted",
    Double: "components_structure.responsiveImage.double",

    // Title specific labels
    "Title 1 - Centered Heading": "components_structure.title.title_1",
    "Title Text": "components_structure.title.title_text",
    "Text Align": "components_structure.title.text_align",
    "Text Color": "components_structure.title.text_color",
    "Line Height": "components_structure.title.line_height",
    "Letter Spacing": "components_structure.title.letter_spacing",
    "Enable Animation": "components_structure.title.enable_animation",
    "Animation Type": "components_structure.title.animation_type",

    // Hero specific labels
    "Show Search Form": "components_structure.hero_specific.show_search_form",
    "Show Purpose Field":
      "components_structure.hero_specific.show_purpose_field",
    "Show City Field": "components_structure.hero_specific.show_city_field",
    "Show Type Field": "components_structure.hero_specific.show_type_field",
    "Show Price Field": "components_structure.hero_specific.show_price_field",
    "Show Keywords Field":
      "components_structure.hero_specific.show_keywords_field",
    "Search Form": "components_structure.hero_specific.search_form",
    "Purpose Field": "components_structure.hero_specific.purpose_field",
    "City Field": "components_structure.hero_specific.city_field",
    "Type Field": "components_structure.hero_specific.type_field",
    "Price Field": "components_structure.hero_specific.price_field",
    "Keywords Field": "components_structure.hero_specific.keywords_field",
    "Overlay Opacity": "components_structure.hero_specific.overlay_opacity",
    "Show Overlay": "components_structure.hero_specific.show_overlay",
    "Description Animation":
      "components_structure.hero_specific.description_animation",
    Alignment: "components_structure.hero_specific.alignment",
    "Background Image": "components_structure.hero_specific.background_image",
    "Image URL": "components_structure.hero_specific.image_url",
    "Font Settings": "components_structure.hero_specific.font_settings",
    "Title Font": "components_structure.hero_specific.title_font",
    Family: "components_structure.hero_specific.family",
    "Floating Bar Type": "components_structure.hero_specific.floating_bar_type",
    "Property Filter Configuration":
      "components_structure.hero_specific.property_filter_configuration",
    "Property Types Source":
      "components_structure.hero_specific.property_types_source",
    "Static List": "components_structure.hero_specific.static_list",
    "Dynamic API": "components_structure.hero_specific.dynamic_api",
    "Property Types List":
      "components_structure.hero_specific.property_types_list",
    "Property Type": "components_structure.hero_specific.property_type",
    "Property Types API URL":
      "components_structure.hero_specific.property_types_api_url",
    "Search Input Placeholder":
      "components_structure.hero_specific.search_input_placeholder",
    "Property Type Placeholder":
      "components_structure.hero_specific.property_type_placeholder",
    "Price Input Placeholder":
      "components_structure.hero_specific.price_input_placeholder",
    "Search Button Text":
      "components_structure.hero_specific.search_button_text",
    "Title Animation": "components_structure.hero_specific.title_animation",
    "Contact Form": "components_structure.hero_specific.contact_form",
    "Property Filter": "components_structure.hero_specific.property_filter",
    Background: "components_structure.hero_specific.background",
    "Alt Text": "components_structure.hero_specific.alt_text",
    Overlay: "components_structure.hero_specific.overlay",
    Enabled: "components_structure.hero_specific.enabled",
    Opacity: "components_structure.hero_specific.opacity",
    Color: "components_structure.hero_specific.color",
    Animations: "components_structure.hero_specific.animations",
    Type: "components_structure.hero_specific.type",

    // Testimonials specific labels
    "Testimonials 1 - Swiper Carousel":
      "components_structure.testimonials_specific.testimonials_1_swiper_carousel",
    "Section Title": "components_structure.testimonials_specific.section_title",
    "Section Description":
      "components_structure.testimonials_specific.section_description",
    Background: "components_structure.testimonials_specific.background",
    "Background Color":
      "components_structure.testimonials_specific.background_color",
    "Background Image":
      "components_structure.testimonials_specific.background_image",
    "Image Alt Text":
      "components_structure.testimonials_specific.image_alt_text",
    Overlay: "components_structure.testimonials_specific.overlay",
    Enabled: "components_structure.testimonials_specific.enabled",
    Opacity: "components_structure.testimonials_specific.opacity",
    Color: "components_structure.testimonials_specific.color",
    Spacing: "components_structure.testimonials_specific.spacing",
    "Vertical Padding":
      "components_structure.testimonials_specific.vertical_padding",
    "Header Margin Bottom":
      "components_structure.testimonials_specific.header_margin_bottom",
    "Header Styling":
      "components_structure.testimonials_specific.header_styling",
    "Text Alignment":
      "components_structure.testimonials_specific.text_alignment",
    "Max Width": "components_structure.testimonials_specific.max_width",
    "Title Styling": "components_structure.testimonials_specific.title_styling",
    "CSS Classes": "components_structure.testimonials_specific.css_classes",
    "Font Size": "components_structure.testimonials_specific.font_size",
    "Font Weight": "components_structure.testimonials_specific.font_weight",
    "Description Styling":
      "components_structure.testimonials_specific.description_styling",
    "Carousel Settings":
      "components_structure.testimonials_specific.carousel_settings",
    "Desktop Slides Count":
      "components_structure.testimonials_specific.desktop_slides_count",
    "Space Between Slides":
      "components_structure.testimonials_specific.space_between_slides",
    "Enable Autoplay":
      "components_structure.testimonials_specific.enable_autoplay",
    "Show Pagination":
      "components_structure.testimonials_specific.show_pagination",
    "Enable Loop": "components_structure.testimonials_specific.enable_loop",
    "Slide Height": "components_structure.testimonials_specific.slide_height",
    "Mobile Height": "components_structure.testimonials_specific.mobile_height",
    "Tablet Height": "components_structure.testimonials_specific.tablet_height",
    "Desktop Height":
      "components_structure.testimonials_specific.desktop_height",
    "Large Desktop Height":
      "components_structure.testimonials_specific.large_desktop_height",
    "Testimonials Data":
      "components_structure.testimonials_specific.testimonials_data",
    "Add Testimonial":
      "components_structure.testimonials_specific.add_testimonial",
    Testimonial: "components_structure.testimonials_specific.testimonial",
    ID: "components_structure.testimonials_specific.id",
    "Quote Text": "components_structure.testimonials_specific.quote_text",
    "Customer Name": "components_structure.testimonials_specific.customer_name",
    Location: "components_structure.testimonials_specific.location",
    "Rating (1-5)": "components_structure.testimonials_specific.rating_1_5",
    "Avatar Image": "components_structure.testimonials_specific.avatar_image",
    Company: "components_structure.testimonials_specific.company",
    Date: "components_structure.testimonials_specific.date",
    "Testimonial Card Styling":
      "components_structure.testimonials_specific.testimonial_card_styling",
    "Border Color": "components_structure.testimonials_specific.border_color",
    "Border Radius": "components_structure.testimonials_specific.border_radius",
    Shadow: "components_structure.testimonials_specific.shadow",
    Padding: "components_structure.testimonials_specific.padding",
    "Min Height": "components_structure.testimonials_specific.min_height",
    "Quote Icon": "components_structure.testimonials_specific.quote_icon",
    "Icon Color": "components_structure.testimonials_specific.icon_color",
    "Icon Size": "components_structure.testimonials_specific.icon_size",
    Position: "components_structure.testimonials_specific.position",
    "Text Styling": "components_structure.testimonials_specific.text_styling",
    "Text Color": "components_structure.testimonials_specific.text_color",
    "Line Height": "components_structure.testimonials_specific.line_height",
    "Max Lines": "components_structure.testimonials_specific.max_lines",
    "Card Footer": "components_structure.testimonials_specific.card_footer",
    "Margin Top": "components_structure.testimonials_specific.margin_top",
    "Padding Top": "components_structure.testimonials_specific.padding_top",
    "Customer Info": "components_structure.testimonials_specific.customer_info",
    "Name Color": "components_structure.testimonials_specific.name_color",
    "Name Font Weight":
      "components_structure.testimonials_specific.name_font_weight",
    "Location Color":
      "components_structure.testimonials_specific.location_color",
    "Rating Stars": "components_structure.testimonials_specific.rating_stars",
    "Active Star Color":
      "components_structure.testimonials_specific.active_star_color",
    "Inactive Star Color":
      "components_structure.testimonials_specific.inactive_star_color",
    "Star Size": "components_structure.testimonials_specific.star_size",
    "Pagination Styling":
      "components_structure.testimonials_specific.pagination_styling",
    "Bullet Width": "components_structure.testimonials_specific.bullet_width",
    "Bullet Height": "components_structure.testimonials_specific.bullet_height",
    "Bullet Color": "components_structure.testimonials_specific.bullet_color",
    "Bullet Opacity":
      "components_structure.testimonials_specific.bullet_opacity",
    "Bullet Margin": "components_structure.testimonials_specific.bullet_margin",
    "Active Bullet Width":
      "components_structure.testimonials_specific.active_bullet_width",
    "Active Bullet Color":
      "components_structure.testimonials_specific.active_bullet_color",
    "Active Bullet Border Radius":
      "components_structure.testimonials_specific.active_bullet_border_radius",
    "Pagination Bottom Position":
      "components_structure.testimonials_specific.pagination_bottom_position",
    "Responsive Behavior":
      "components_structure.testimonials_specific.responsive_behavior",
    "Mobile Slides Count":
      "components_structure.testimonials_specific.mobile_slides_count",
    "Tablet Slides Count":
      "components_structure.testimonials_specific.tablet_slides_count",
    "Large Desktop Slides Count":
      "components_structure.testimonials_specific.large_desktop_slides_count",
    Animations: "components_structure.testimonials_specific.animations",
    "Card Animations":
      "components_structure.testimonials_specific.card_animations",
    "Animation Type":
      "components_structure.testimonials_specific.animation_type",
    "Duration (ms)": "components_structure.testimonials_specific.duration_ms",
    "Delay (ms)": "components_structure.testimonials_specific.delay_ms",
    "Header Animations":
      "components_structure.testimonials_specific.header_animations",
    "Card Background Color":
      "components_structure.testimonials_specific.card_background_color",
    "Quote Icon Color":
      "components_structure.testimonials_specific.quote_icon_color",
    "Active Pagination Color":
      "components_structure.testimonials_specific.active_pagination_color",

    // Property Slider specific labels
    "Property Slider":
      "components_structure.property_slider_specific.property_slider",
    "Property Slider 1 - Modern Carousel":
      "components_structure.property_slider_specific.property_slider_1_modern_carousel",
    "Modern property slider with carousel functionality":
      "components_structure.property_slider_specific.modern_property_slider_description",
    "Whether the component is visible":
      "components_structure.property_slider_specific.whether_component_visible",
    "Maximum width of the section":
      "components_structure.property_slider_specific.maximum_width_section",
    "Top padding": "components_structure.property_slider_specific.top_padding",
    "Bottom padding":
      "components_structure.property_slider_specific.bottom_padding",
    "Title Bottom Margin":
      "components_structure.property_slider_specific.title_bottom_margin",
    "Slide Gap": "components_structure.property_slider_specific.slide_gap",
    "View All Text":
      "components_structure.property_slider_specific.view_all_text",
    "View All URL":
      "components_structure.property_slider_specific.view_all_url",
    "Data Source": "components_structure.property_slider_specific.data_source",
    "API URL": "components_structure.property_slider_specific.api_url",
    "Latest Rentals":
      "components_structure.property_slider_specific.latest_rentals",
    "Latest Sales":
      "components_structure.property_slider_specific.latest_sales",
    "Latest Projects":
      "components_structure.property_slider_specific.latest_projects",
    "Use API Data":
      "components_structure.property_slider_specific.use_api_data",
    Typography: "components_structure.property_slider_specific.typography",
    "Title Typography":
      "components_structure.property_slider_specific.title_typography",
    "Font Family": "components_structure.property_slider_specific.font_family",
    "Font Size": "components_structure.property_slider_specific.font_size",
    Color: "components_structure.property_slider_specific.color",
    "Subtitle Typography":
      "components_structure.property_slider_specific.subtitle_typography",
    "Link Typography":
      "components_structure.property_slider_specific.link_typography",
    "Hover Color": "components_structure.property_slider_specific.hover_color",
    "Carousel Settings":
      "components_structure.property_slider_specific.carousel_settings",
    "Desktop Slides Count":
      "components_structure.property_slider_specific.desktop_slides_count",
    "Tablet Slides Count":
      "components_structure.property_slider_specific.tablet_slides_count",
    "Mobile Slides Count":
      "components_structure.property_slider_specific.mobile_slides_count",
    "Slide Height":
      "components_structure.property_slider_specific.slide_height",
    Autoplay: "components_structure.property_slider_specific.autoplay",
    Loop: "components_structure.property_slider_specific.loop",
    Speed: "components_structure.property_slider_specific.speed",
    Background: "components_structure.property_slider_specific.background",
    Image: "components_structure.property_slider_specific.image",
    Overlay: "components_structure.property_slider_specific.overlay",
    Enabled: "components_structure.property_slider_specific.enabled",
    Opacity: "components_structure.property_slider_specific.opacity",
    Responsive: "components_structure.property_slider_specific.responsive",
    "Title Button Layout":
      "components_structure.property_slider_specific.title_button_layout",
    "Description Position":
      "components_structure.property_slider_specific.description_position",
    Animations: "components_structure.property_slider_specific.animations",
    "Title Animation":
      "components_structure.property_slider_specific.title_animation",
    Type: "components_structure.property_slider_specific.type",
    Duration: "components_structure.property_slider_specific.duration",
    Delay: "components_structure.property_slider_specific.delay",
    "Subtitle Animation":
      "components_structure.property_slider_specific.subtitle_animation",
    "Carousel Animation":
      "components_structure.property_slider_specific.carousel_animation",
    Easing: "components_structure.property_slider_specific.easing",
    "Background Color":
      "components_structure.property_slider_specific.background_color",
    "Title Color": "components_structure.property_slider_specific.title_color",
    "Subtitle Color":
      "components_structure.property_slider_specific.subtitle_color",
    "Link Color": "components_structure.property_slider_specific.link_color",

    // CTA Valuation specific labels
    "CTA Valuation 1 - Modern Design":
      "components_structure.cta_valuation_specific.cta_valuation_1_modern_design",
    "Image Source": "components_structure.cta_valuation_specific.image_source",
    "Image Alt Text":
      "components_structure.cta_valuation_specific.image_alt_text",
    "Image Width": "components_structure.cta_valuation_specific.image_width",
    "Image Height": "components_structure.cta_valuation_specific.image_height",
    Styling: "components_structure.cta_valuation_specific.styling",
    "Text Color": "components_structure.cta_valuation_specific.text_color",
    "Button Background Color":
      "components_structure.cta_valuation_specific.button_background_color",
    "Button Text Color":
      "components_structure.cta_valuation_specific.button_text_color",
    "Button Text": "components_structure.cta_valuation_specific.button_text",
    "Button URL": "components_structure.cta_valuation_specific.button_url",

    // Steps Section specific labels
    "Steps Section 1 - Modern Grid":
      "components_structure.steps_section_specific.steps_section_1_modern_grid",
    "Header Section":
      "components_structure.steps_section_specific.header_section",
    "Margin Bottom":
      "components_structure.steps_section_specific.margin_bottom",
    "Title Text": "components_structure.steps_section_specific.title_text",
    "CSS Classes": "components_structure.steps_section_specific.css_classes",
    "Description Text":
      "components_structure.steps_section_specific.description_text",
    "Grid Layout": "components_structure.steps_section_specific.grid_layout",
    "Horizontal Gap":
      "components_structure.steps_section_specific.horizontal_gap",
    "Vertical Gap": "components_structure.steps_section_specific.vertical_gap",
    "Mobile Vertical Gap":
      "components_structure.steps_section_specific.mobile_vertical_gap",
    Columns: "components_structure.steps_section_specific.columns",
    Steps: "components_structure.steps_section_specific.steps",
    "Step Title": "components_structure.steps_section_specific.step_title",
    "Step Description":
      "components_structure.steps_section_specific.step_description",
    "Step Icon": "components_structure.steps_section_specific.step_icon",
    "Icon Type": "components_structure.steps_section_specific.icon_type",
    "Icon Name": "components_structure.steps_section_specific.icon_name",
    "Image URL": "components_structure.steps_section_specific.image_url",
    "Title Style": "components_structure.steps_section_specific.title_style",
    Size: "components_structure.steps_section_specific.size",
    "Font Weight": "components_structure.steps_section_specific.font_weight",
    "Description Style":
      "components_structure.steps_section_specific.description_style",
    "Line Height": "components_structure.steps_section_specific.line_height",
    "Icon Style": "components_structure.steps_section_specific.icon_style",
    "Margin Top": "components_structure.steps_section_specific.margin_top",
    Shrink: "components_structure.steps_section_specific.shrink",
    Layout: "components_structure.steps_section_specific.layout",
    "Text Direction":
      "components_structure.steps_section_specific.text_direction",
    "Right to Left":
      "components_structure.steps_section_specific.right_to_left",
    "Left to Right":
      "components_structure.steps_section_specific.left_to_right",
    "Text Alignment":
      "components_structure.steps_section_specific.text_alignment",
    Left: "components_structure.steps_section_specific.left",
    Center: "components_structure.steps_section_specific.center",
    Right: "components_structure.steps_section_specific.right",
    "Max Width": "components_structure.steps_section_specific.max_width",
    Animations: "components_structure.steps_section_specific.animations",
    "Header Animation":
      "components_structure.steps_section_specific.header_animation",
    "Steps Animation":
      "components_structure.steps_section_specific.steps_animation",
    "Duration (ms)": "components_structure.steps_section_specific.duration_ms",
    "Delay (ms)": "components_structure.steps_section_specific.delay_ms",
    "Stagger Delay (ms)":
      "components_structure.steps_section_specific.stagger_delay_ms",
    Responsive: "components_structure.steps_section_specific.responsive",
    "Mobile Breakpoint":
      "components_structure.steps_section_specific.mobile_breakpoint",
    "Tablet Breakpoint":
      "components_structure.steps_section_specific.tablet_breakpoint",
    "Desktop Breakpoint":
      "components_structure.steps_section_specific.desktop_breakpoint",
    "Section Title":
      "components_structure.steps_section_specific.section_title",
    "Section Description":
      "components_structure.steps_section_specific.section_description",
    "Mobile Columns":
      "components_structure.steps_section_specific.mobile_columns",
    "Tablet Columns":
      "components_structure.steps_section_specific.tablet_columns",
    "Desktop Columns":
      "components_structure.steps_section_specific.desktop_columns",

    // Why Choose Us specific labels
    "Why Choose Us 1 - Features Grid":
      "components_structure.why_choose_us_specific.why_choose_us_1_features_grid",
    "Layout Settings":
      "components_structure.why_choose_us_specific.layout_settings",
    Direction: "components_structure.why_choose_us_specific.direction",
    "Right to Left":
      "components_structure.why_choose_us_specific.right_to_left",
    "Left to Right":
      "components_structure.why_choose_us_specific.left_to_right",
    "Max Width": "components_structure.why_choose_us_specific.max_width",
    "Section Padding":
      "components_structure.why_choose_us_specific.section_padding",
    "Vertical Padding":
      "components_structure.why_choose_us_specific.vertical_padding",
    "Small Vertical Padding":
      "components_structure.why_choose_us_specific.small_vertical_padding",
    "Header Section":
      "components_structure.why_choose_us_specific.header_section",
    Title: "components_structure.why_choose_us_specific.title",
    Description: "components_structure.why_choose_us_specific.description",
    "Margin Bottom":
      "components_structure.why_choose_us_specific.margin_bottom",
    "Text Alignment":
      "components_structure.why_choose_us_specific.text_alignment",
    "Horizontal Padding":
      "components_structure.why_choose_us_specific.horizontal_padding",
    Typography: "components_structure.why_choose_us_specific.typography",
    "Title Font": "components_structure.why_choose_us_specific.title_font",
    "CSS Classes": "components_structure.why_choose_us_specific.css_classes",
    "Description Font":
      "components_structure.why_choose_us_specific.description_font",
    "Features Grid":
      "components_structure.why_choose_us_specific.features_grid",
    "Features List":
      "components_structure.why_choose_us_specific.features_list",
    "Grid Layout": "components_structure.why_choose_us_specific.grid_layout",
    Gap: "components_structure.why_choose_us_specific.gap",
    Columns: "components_structure.why_choose_us_specific.columns",
    "Small Screens":
      "components_structure.why_choose_us_specific.small_screens",
    "Extra Large Screens":
      "components_structure.why_choose_us_specific.extra_large_screens",
    "Card Style": "components_structure.why_choose_us_specific.card_style",
    "Border Radius":
      "components_structure.why_choose_us_specific.border_radius",
    Border: "components_structure.why_choose_us_specific.border",
    "Background Color":
      "components_structure.why_choose_us_specific.background_color",
    Padding: "components_structure.why_choose_us_specific.padding",
    Shadow: "components_structure.why_choose_us_specific.shadow",
    Ring: "components_structure.why_choose_us_specific.ring",
    "Icon Style": "components_structure.why_choose_us_specific.icon_style",
    "Icon Settings":
      "components_structure.why_choose_us_specific.icon_settings",
    Container: "components_structure.why_choose_us_specific.container",
    Size: "components_structure.why_choose_us_specific.size",
    Flex: "components_structure.why_choose_us_specific.flex",
    Items: "components_structure.why_choose_us_specific.items",
    Justify: "components_structure.why_choose_us_specific.justify",
    Image: "components_structure.why_choose_us_specific.image",
    Height: "components_structure.why_choose_us_specific.height",
    Width: "components_structure.why_choose_us_specific.width",
    Typography: "components_structure.why_choose_us_specific.typography",
    "Title Font": "components_structure.why_choose_us_specific.title_font",
    "Margin Top": "components_structure.why_choose_us_specific.margin_top",
    "Text Align": "components_structure.why_choose_us_specific.text_align",
    "Font Size": "components_structure.why_choose_us_specific.font_size",
    "Font Weight": "components_structure.why_choose_us_specific.font_weight",
    Color: "components_structure.why_choose_us_specific.color",
    "Description Font":
      "components_structure.why_choose_us_specific.description_font",
    "Line Height": "components_structure.why_choose_us_specific.line_height",
    Responsive: "components_structure.why_choose_us_specific.responsive",
    Mobile: "components_structure.why_choose_us_specific.mobile",
    "Grid Columns": "components_structure.why_choose_us_specific.grid_columns",
    Tablet: "components_structure.why_choose_us_specific.tablet",
    Desktop: "components_structure.why_choose_us_specific.desktop",
    Animations: "components_structure.why_choose_us_specific.animations",
    "Header Animation":
      "components_structure.why_choose_us_specific.header_animation",
    "Enable Animation":
      "components_structure.why_choose_us_specific.enable_animation",
    "Animation Type":
      "components_structure.why_choose_us_specific.animation_type",
    "Fade Up": "components_structure.why_choose_us_specific.fade_up",
    "Fade Left": "components_structure.why_choose_us_specific.fade_left",
    "Fade Right": "components_structure.why_choose_us_specific.fade_right",
    "Slide Up": "components_structure.why_choose_us_specific.slide_up",
    "Duration (ms)": "components_structure.why_choose_us_specific.duration_ms",
    "Delay (ms)": "components_structure.why_choose_us_specific.delay_ms",
    "Features Animation":
      "components_structure.why_choose_us_specific.features_animation",
    "Stagger Delay (ms)":
      "components_structure.why_choose_us_specific.stagger_delay_ms",
    "Icons Animation":
      "components_structure.why_choose_us_specific.icons_animation",
    Colors: "components_structure.why_choose_us_specific.colors",
    "Section Background":
      "components_structure.why_choose_us_specific.section_background",
    "Card Background":
      "components_structure.why_choose_us_specific.card_background",
    "Title Color": "components_structure.why_choose_us_specific.title_color",
    "Description Color":
      "components_structure.why_choose_us_specific.description_color",
    "Border Color": "components_structure.why_choose_us_specific.border_color",
    "Ring Color": "components_structure.why_choose_us_specific.ring_color",
    "Header Title": "components_structure.why_choose_us_specific.header_title",
    "Header Description":
      "components_structure.why_choose_us_specific.header_description",
    "Background Color":
      "components_structure.why_choose_us_specific.background_color",

    // Footer specific labels
    "Footer 1 - Modern Real Estate":
      "components_structure.footer_specific.footer_1_modern_real_estate",
    "Background Type": "components_structure.footer_specific.background_type",
    Image: "components_structure.footer_specific.image",
    Color: "components_structure.footer_specific.color",
    Gradient: "components_structure.footer_specific.gradient",
    None: "components_structure.footer_specific.none",
    "Image URL": "components_structure.footer_specific.image_url",
    "Alt Text": "components_structure.footer_specific.alt_text",
    "Background Color": "components_structure.footer_specific.background_color",
    Enabled: "components_structure.footer_specific.enabled",
    Direction: "components_structure.footer_specific.direction",
    "To Right": "components_structure.footer_specific.to_right",
    "To Left": "components_structure.footer_specific.to_left",
    "To Top": "components_structure.footer_specific.to_top",
    "To Bottom": "components_structure.footer_specific.to_bottom",
    "To Top Right": "components_structure.footer_specific.to_top_right",
    "To Top Left": "components_structure.footer_specific.to_top_left",
    "To Bottom Right": "components_structure.footer_specific.to_bottom_right",
    "To Bottom Left": "components_structure.footer_specific.to_bottom_left",
    "Start Color": "components_structure.footer_specific.start_color",
    "End Color": "components_structure.footer_specific.end_color",
    "Middle Color (Optional)":
      "components_structure.footer_specific.middle_color_optional",
    Overlay: "components_structure.footer_specific.overlay",
    Opacity: "components_structure.footer_specific.opacity",
    "Blend Mode": "components_structure.footer_specific.blend_mode",
    Multiply: "components_structure.footer_specific.multiply",
    Overlay: "components_structure.footer_specific.overlay",
    "Soft Light": "components_structure.footer_specific.soft_light",
    "Hard Light": "components_structure.footer_specific.hard_light",
    "Color Burn": "components_structure.footer_specific.color_burn",
    "Color Dodge": "components_structure.footer_specific.color_dodge",
    Layout: "components_structure.footer_specific.layout",
    "Number of Columns":
      "components_structure.footer_specific.number_of_columns",
    "1 Column": "components_structure.footer_specific.1_column",
    "2 Columns": "components_structure.footer_specific.2_columns",
    "3 Columns": "components_structure.footer_specific.3_columns",
    "4 Columns": "components_structure.footer_specific.4_columns",
    "Column Spacing": "components_structure.footer_specific.column_spacing",
    Padding: "components_structure.footer_specific.padding",
    "Max Width": "components_structure.footer_specific.max_width",
    Content: "components_structure.footer_specific.content",
    "Company Information":
      "components_structure.footer_specific.company_information",
    "Company Name": "components_structure.footer_specific.company_name",
    Description: "components_structure.footer_specific.description",
    Tagline: "components_structure.footer_specific.tagline",
    Logo: "components_structure.footer_specific.logo",
    "Quick Links": "components_structure.footer_specific.quick_links",
    "Section Title": "components_structure.footer_specific.section_title",
    Links: "components_structure.footer_specific.links",
    "Link Text": "components_structure.footer_specific.link_text",
    URL: "components_structure.footer_specific.url",
    "Contact Information":
      "components_structure.footer_specific.contact_information",
    Address: "components_structure.footer_specific.address",
    "Phone 1": "components_structure.footer_specific.phone_1",
    "Phone 2": "components_structure.footer_specific.phone_2",
    Email: "components_structure.footer_specific.email",
    "Social Media": "components_structure.footer_specific.social_media",
    Platforms: "components_structure.footer_specific.platforms",
    "Platform Name": "components_structure.footer_specific.platform_name",
    Icon: "components_structure.footer_specific.icon",
    "Hover Color": "components_structure.footer_specific.hover_color",
    "Footer Bottom": "components_structure.footer_specific.footer_bottom",
    "Copyright Text": "components_structure.footer_specific.copyright_text",
    "Legal Links": "components_structure.footer_specific.legal_links",
    Styling: "components_structure.footer_specific.styling",
    Colors: "components_structure.footer_specific.colors",
    "Primary Text Color":
      "components_structure.footer_specific.primary_text_color",
    "Secondary Text Color":
      "components_structure.footer_specific.secondary_text_color",
    "Muted Text Color": "components_structure.footer_specific.muted_text_color",
    "Accent Color": "components_structure.footer_specific.accent_color",
    "Border Color": "components_structure.footer_specific.border_color",
    Typography: "components_structure.footer_specific.typography",
    "Title Font Size": "components_structure.footer_specific.title_font_size",
    "Title Font Weight":
      "components_structure.footer_specific.title_font_weight",
    "Body Font Size": "components_structure.footer_specific.body_font_size",
    "Body Font Weight": "components_structure.footer_specific.body_font_weight",
    Spacing: "components_structure.footer_specific.spacing",
    "Section Padding": "components_structure.footer_specific.section_padding",
    "Column Gap": "components_structure.footer_specific.column_gap",
    "Item Gap": "components_structure.footer_specific.item_gap",
    Effects: "components_structure.footer_specific.effects",
    "Hover Transition": "components_structure.footer_specific.hover_transition",
    Shadow: "components_structure.footer_specific.shadow",
    "Border Radius": "components_structure.footer_specific.border_radius",
    "Background Image": "components_structure.footer_specific.background_image",
    "Enable Gradient": "components_structure.footer_specific.enable_gradient",
    "Enable Overlay": "components_structure.footer_specific.enable_overlay",
    "Show Company Info":
      "components_structure.footer_specific.show_company_info",
    "Show Quick Links": "components_structure.footer_specific.show_quick_links",
    "Show Contact Info":
      "components_structure.footer_specific.show_contact_info",
    "Show Social Media":
      "components_structure.footer_specific.show_social_media",
    "Show Footer Bottom":
      "components_structure.footer_specific.show_footer_bottom",

    // Half Text Half Image specific labels
    "Half Text Half Image 1 - Modern":
      "components_structure.half_text_half_image_specific.half_text_half_image_1_modern",
    "Layout Settings":
      "components_structure.half_text_half_image_specific.layout_settings",
    Direction: "components_structure.half_text_half_image_specific.direction",
    "Right to Left":
      "components_structure.half_text_half_image_specific.right_to_left",
    "Left to Right":
      "components_structure.half_text_half_image_specific.left_to_right",
    "Text Width (%)":
      "components_structure.half_text_half_image_specific.text_width_percent",
    "Image Width (%)":
      "components_structure.half_text_half_image_specific.image_width_percent",
    "Gap Between Sections":
      "components_structure.half_text_half_image_specific.gap_between_sections",
    "Minimum Height":
      "components_structure.half_text_half_image_specific.minimum_height",
    Spacing: "components_structure.half_text_half_image_specific.spacing",
    Padding: "components_structure.half_text_half_image_specific.padding",
    Top: "components_structure.half_text_half_image_specific.top",
    Bottom: "components_structure.half_text_half_image_specific.bottom",
    Left: "components_structure.half_text_half_image_specific.left",
    Right: "components_structure.half_text_half_image_specific.right",
    Margin: "components_structure.half_text_half_image_specific.margin",
    Content: "components_structure.half_text_half_image_specific.content",
    "Eyebrow Text":
      "components_structure.half_text_half_image_specific.eyebrow_text",
    Title: "components_structure.half_text_half_image_specific.title",
    Description:
      "components_structure.half_text_half_image_specific.description",
    Button: "components_structure.half_text_half_image_specific.button",
    "Button Text":
      "components_structure.half_text_half_image_specific.button_text",
    "Show Button":
      "components_structure.half_text_half_image_specific.show_button",
    "Button URL":
      "components_structure.half_text_half_image_specific.button_url",
    "Button Style":
      "components_structure.half_text_half_image_specific.button_style",
    "Background Color":
      "components_structure.half_text_half_image_specific.background_color",
    "Text Color":
      "components_structure.half_text_half_image_specific.text_color",
    "Hover Background":
      "components_structure.half_text_half_image_specific.hover_background",
    "Hover Text Color":
      "components_structure.half_text_half_image_specific.hover_text_color",
    Width: "components_structure.half_text_half_image_specific.width",
    Height: "components_structure.half_text_half_image_specific.height",
    "Border Radius":
      "components_structure.half_text_half_image_specific.border_radius",
    Typography: "components_structure.half_text_half_image_specific.typography",
    "Eyebrow Font":
      "components_structure.half_text_half_image_specific.eyebrow_font",
    Size: "components_structure.half_text_half_image_specific.size",
    Weight: "components_structure.half_text_half_image_specific.weight",
    Color: "components_structure.half_text_half_image_specific.color",
    "Line Height":
      "components_structure.half_text_half_image_specific.line_height",
    "Title Font":
      "components_structure.half_text_half_image_specific.title_font",
    "Description Font":
      "components_structure.half_text_half_image_specific.description_font",
    Image: "components_structure.half_text_half_image_specific.image",
    "Image Settings":
      "components_structure.half_text_half_image_specific.image_settings",

    // Half Text Half Image 2 specific labels
    "Half Text Half Image 2 - With Stats":
      "components_structure.half_text_half_image_2_specific.half_text_half_image_2_with_stats",
    "Layout Settings":
      "components_structure.half_text_half_image_2_specific.layout_settings",
    Direction: "components_structure.half_text_half_image_2_specific.direction",
    "Max Width":
      "components_structure.half_text_half_image_2_specific.max_width",
    "Grid Columns":
      "components_structure.half_text_half_image_2_specific.grid_columns",
    Gap: "components_structure.half_text_half_image_2_specific.gap",
    "Horizontal Gap":
      "components_structure.half_text_half_image_2_specific.horizontal_gap",
    "Vertical Gap":
      "components_structure.half_text_half_image_2_specific.vertical_gap",
    "Medium Vertical Gap":
      "components_structure.half_text_half_image_2_specific.medium_vertical_gap",
    Spacing: "components_structure.half_text_half_image_2_specific.spacing",
    Padding: "components_structure.half_text_half_image_2_specific.padding",
    Horizontal:
      "components_structure.half_text_half_image_2_specific.horizontal",
    Vertical: "components_structure.half_text_half_image_2_specific.vertical",
    "Small Horizontal":
      "components_structure.half_text_half_image_2_specific.small_horizontal",
    "Small Vertical":
      "components_structure.half_text_half_image_2_specific.small_vertical",
    "Large Horizontal":
      "components_structure.half_text_half_image_2_specific.large_horizontal",
    Content: "components_structure.half_text_half_image_2_specific.content",
    "Eyebrow Text":
      "components_structure.half_text_half_image_2_specific.eyebrow_text",
    Title: "components_structure.half_text_half_image_2_specific.title",
    Description:
      "components_structure.half_text_half_image_2_specific.description",
    Statistics:
      "components_structure.half_text_half_image_2_specific.statistics",
    "Stat 1": "components_structure.half_text_half_image_2_specific.stat_1",
    "Stat 2": "components_structure.half_text_half_image_2_specific.stat_2",
    "Stat 3": "components_structure.half_text_half_image_2_specific.stat_3",
    "Stat 4": "components_structure.half_text_half_image_2_specific.stat_4",
    Value: "components_structure.half_text_half_image_2_specific.value",
    Label: "components_structure.half_text_half_image_2_specific.label",
    Typography:
      "components_structure.half_text_half_image_2_specific.typography",
    "Eyebrow Font":
      "components_structure.half_text_half_image_2_specific.eyebrow_font",
    "Title Font":
      "components_structure.half_text_half_image_2_specific.title_font",
    "Text Balance":
      "components_structure.half_text_half_image_2_specific.text_balance",
    "Description Font":
      "components_structure.half_text_half_image_2_specific.description_font",
    "Stats Font":
      "components_structure.half_text_half_image_2_specific.stats_font",
    "Value CSS Classes":
      "components_structure.half_text_half_image_2_specific.value_css_classes",
    "Label CSS Classes":
      "components_structure.half_text_half_image_2_specific.label_css_classes",
    "Label Margin Top":
      "components_structure.half_text_half_image_2_specific.label_margin_top",
    Image: "components_structure.half_text_half_image_2_specific.image",
    "Image Source":
      "components_structure.half_text_half_image_2_specific.image_source",
    "Alt Text": "components_structure.half_text_half_image_2_specific.alt_text",
    Width: "components_structure.half_text_half_image_2_specific.width",
    Height: "components_structure.half_text_half_image_2_specific.height",
    "Image Style":
      "components_structure.half_text_half_image_2_specific.image_style",
    "CSS Classes":
      "components_structure.half_text_half_image_2_specific.css_classes",
    "Border Radius":
      "components_structure.half_text_half_image_2_specific.border_radius",
    "Background Block":
      "components_structure.half_text_half_image_2_specific.background_block",
    "Show Green Block":
      "components_structure.half_text_half_image_2_specific.show_green_block",
    "Background Color":
      "components_structure.half_text_half_image_2_specific.background_color",
    Positioning:
      "components_structure.half_text_half_image_2_specific.positioning",
    "Padding Top":
      "components_structure.half_text_half_image_2_specific.padding_top",
    "Padding Right":
      "components_structure.half_text_half_image_2_specific.padding_right",
    "Padding Bottom":
      "components_structure.half_text_half_image_2_specific.padding_bottom",
    "XL Padding Right":
      "components_structure.half_text_half_image_2_specific.xl_padding_right",
    "XL Padding Bottom":
      "components_structure.half_text_half_image_2_specific.xl_padding_bottom",
    Responsive:
      "components_structure.half_text_half_image_2_specific.responsive",
    "Grid Layout":
      "components_structure.half_text_half_image_2_specific.grid_layout",
    "Text Columns":
      "components_structure.half_text_half_image_2_specific.text_columns",
    "Image Columns":
      "components_structure.half_text_half_image_2_specific.image_columns",
    "Text Order":
      "components_structure.half_text_half_image_2_specific.text_order",
    "Image Order":
      "components_structure.half_text_half_image_2_specific.image_order",
    "Stats Grid":
      "components_structure.half_text_half_image_2_specific.stats_grid",
    "Grid Columns":
      "components_structure.half_text_half_image_2_specific.grid_columns",
    Gap: "components_structure.half_text_half_image_2_specific.gap",
    "Margin Top":
      "components_structure.half_text_half_image_2_specific.margin_top",
    Animations:
      "components_structure.half_text_half_image_2_specific.animations",
    "Text Animation":
      "components_structure.half_text_half_image_2_specific.text_animation",
    "Image Animation":
      "components_structure.half_text_half_image_2_specific.image_animation",
    "Stats Animation":
      "components_structure.half_text_half_image_2_specific.stats_animation",
    "Enable Animation":
      "components_structure.half_text_half_image_2_specific.enable_animation",
    "Animation Type":
      "components_structure.half_text_half_image_2_specific.animation_type",
    "Duration (ms)":
      "components_structure.half_text_half_image_2_specific.duration_ms",
    "Delay (ms)":
      "components_structure.half_text_half_image_2_specific.delay_ms",
    "Stagger Delay (ms)":
      "components_structure.half_text_half_image_2_specific.stagger_delay_ms",
    "Fade Up": "components_structure.half_text_half_image_2_specific.fade_up",
    "Fade Left":
      "components_structure.half_text_half_image_2_specific.fade_left",
    "Fade Right":
      "components_structure.half_text_half_image_2_specific.fade_right",
    "Slide Up": "components_structure.half_text_half_image_2_specific.slide_up",
    "Stats Value Style":
      "components_structure.half_text_half_image_2_specific.stats_value_style",
    "Stats Label Style":
      "components_structure.half_text_half_image_2_specific.stats_label_style",
    "Stats Grid Layout":
      "components_structure.half_text_half_image_2_specific.stats_grid_layout",
    "Stats Gap":
      "components_structure.half_text_half_image_2_specific.stats_gap",
    "Stats Margin Top":
      "components_structure.half_text_half_image_2_specific.stats_margin_top",
    "Show Green Block":
      "components_structure.half_text_half_image_2_specific.show_green_block",
    "Text Animation":
      "components_structure.half_text_half_image_2_specific.text_animation",
    "Image Animation":
      "components_structure.half_text_half_image_2_specific.image_animation",
    "Stats Animation":
      "components_structure.half_text_half_image_2_specific.stats_animation",

    // Contact Map Section specific labels
    "Contact Map Section 1 - Form with Map":
      "components_structure.contact_map_section_specific.contact_map_section_1_form_with_map",
    "Section Title":
      "components_structure.contact_map_section_specific.section_title",
    "Section Description":
      "components_structure.contact_map_section_specific.section_description",
    Background: "components_structure.contact_map_section_specific.background",
    "Background Color":
      "components_structure.contact_map_section_specific.background_color",
    "Background Image":
      "components_structure.contact_map_section_specific.background_image",
    "Image Alt Text":
      "components_structure.contact_map_section_specific.image_alt_text",
    Overlay: "components_structure.contact_map_section_specific.overlay",
    Enabled: "components_structure.contact_map_section_specific.enabled",
    Opacity: "components_structure.contact_map_section_specific.opacity",
    Color: "components_structure.contact_map_section_specific.color",
    Spacing: "components_structure.contact_map_section_specific.spacing",
    "Vertical Padding":
      "components_structure.contact_map_section_specific.vertical_padding",
    "Max Width": "components_structure.contact_map_section_specific.max_width",
    "Horizontal Padding":
      "components_structure.contact_map_section_specific.horizontal_padding",
    "Header Margin Bottom":
      "components_structure.contact_map_section_specific.header_margin_bottom",
    "Grid Gap": "components_structure.contact_map_section_specific.grid_gap",
    "Form Elements Gap":
      "components_structure.contact_map_section_specific.form_elements_gap",
    "Input Fields Gap":
      "components_structure.contact_map_section_specific.input_fields_gap",
    "Header Styling":
      "components_structure.contact_map_section_specific.header_styling",
    "Text Alignment":
      "components_structure.contact_map_section_specific.text_alignment",
    "Title Styling":
      "components_structure.contact_map_section_specific.title_styling",
    "CSS Classes":
      "components_structure.contact_map_section_specific.css_classes",
    "Font Size": "components_structure.contact_map_section_specific.font_size",
    "Font Weight":
      "components_structure.contact_map_section_specific.font_weight",
    "Description Styling":
      "components_structure.contact_map_section_specific.description_styling",
    "Line Height":
      "components_structure.contact_map_section_specific.line_height",
    "Margin Top":
      "components_structure.contact_map_section_specific.margin_top",
    "Layout Settings":
      "components_structure.contact_map_section_specific.layout_settings",
    "Grid Columns":
      "components_structure.contact_map_section_specific.grid_columns",
    "Form Order":
      "components_structure.contact_map_section_specific.form_order",
    "Map Order": "components_structure.contact_map_section_specific.map_order",
    "Responsive Breakpoint":
      "components_structure.contact_map_section_specific.responsive_breakpoint",
    "Form Settings":
      "components_structure.contact_map_section_specific.form_settings",
    "Form Enabled":
      "components_structure.contact_map_section_specific.form_enabled",
    "Form Method":
      "components_structure.contact_map_section_specific.form_method",
    "Form Action":
      "components_structure.contact_map_section_specific.form_action",
    "Form Fields":
      "components_structure.contact_map_section_specific.form_fields",
    "Name Field":
      "components_structure.contact_map_section_specific.name_field",
    "Label Text":
      "components_structure.contact_map_section_specific.label_text",
    Placeholder:
      "components_structure.contact_map_section_specific.placeholder",
    Required: "components_structure.contact_map_section_specific.required",
    "Input Type":
      "components_structure.contact_map_section_specific.input_type",
    "Input Height":
      "components_structure.contact_map_section_specific.input_height",
    "Country Field":
      "components_structure.contact_map_section_specific.country_field",
    "Feedback Field":
      "components_structure.contact_map_section_specific.feedback_field",
    "Min Height":
      "components_structure.contact_map_section_specific.min_height",
    Resize: "components_structure.contact_map_section_specific.resize",
    "Rating System":
      "components_structure.contact_map_section_specific.rating_system",
    "Rating Enabled":
      "components_structure.contact_map_section_specific.rating_enabled",
    "Rating Label":
      "components_structure.contact_map_section_specific.rating_label",
    "Maximum Stars":
      "components_structure.contact_map_section_specific.maximum_stars",
    "Star Size": "components_structure.contact_map_section_specific.star_size",
    "Active Star Color":
      "components_structure.contact_map_section_specific.active_star_color",
    "Inactive Star Color":
      "components_structure.contact_map_section_specific.inactive_star_color",
    "Hover Star Color":
      "components_structure.contact_map_section_specific.hover_star_color",
    "Show Rating Text":
      "components_structure.contact_map_section_specific.show_rating_text",
    "Rating Text Color":
      "components_structure.contact_map_section_specific.rating_text_color",
    "Submit Button":
      "components_structure.contact_map_section_specific.submit_button",
    "Button Enabled":
      "components_structure.contact_map_section_specific.button_enabled",
    "Button Text":
      "components_structure.contact_map_section_specific.button_text",
    "Button Type":
      "components_structure.contact_map_section_specific.button_type",
    "Button Width":
      "components_structure.contact_map_section_specific.button_width",
    "Button Height":
      "components_structure.contact_map_section_specific.button_height",
    "Hover Background Color":
      "components_structure.contact_map_section_specific.hover_background_color",
    "Text Color":
      "components_structure.contact_map_section_specific.text_color",
    "Border Radius":
      "components_structure.contact_map_section_specific.border_radius",
    "Map Settings":
      "components_structure.contact_map_section_specific.map_settings",
    "Map Enabled":
      "components_structure.contact_map_section_specific.map_enabled",
    "Map Title": "components_structure.contact_map_section_specific.map_title",
    "Map Source URL":
      "components_structure.contact_map_section_specific.map_source_url",
    "Map Width": "components_structure.contact_map_section_specific.map_width",
    "Map Height":
      "components_structure.contact_map_section_specific.map_height",
    Border: "components_structure.contact_map_section_specific.border",
    Overflow: "components_structure.contact_map_section_specific.overflow",
    "Allow Full Screen":
      "components_structure.contact_map_section_specific.allow_full_screen",
    Loading: "components_structure.contact_map_section_specific.loading",
    "Referrer Policy":
      "components_structure.contact_map_section_specific.referrer_policy",
    "Form Labels":
      "components_structure.contact_map_section_specific.form_labels",
    "Label Color":
      "components_structure.contact_map_section_specific.label_color",
    "Label Font Size":
      "components_structure.contact_map_section_specific.label_font_size",
    "Label Font Weight":
      "components_structure.contact_map_section_specific.label_font_weight",
    "Label Margin Bottom":
      "components_structure.contact_map_section_specific.label_margin_bottom",
    "Responsive Behavior":
      "components_structure.contact_map_section_specific.responsive_behavior",
    "Mobile Layout":
      "components_structure.contact_map_section_specific.mobile_layout",
    "Tablet Layout":
      "components_structure.contact_map_section_specific.tablet_layout",
    "Desktop Layout":
      "components_structure.contact_map_section_specific.desktop_layout",
    "Mobile Form Order":
      "components_structure.contact_map_section_specific.mobile_form_order",
    "Mobile Map Order":
      "components_structure.contact_map_section_specific.mobile_map_order",
    Animations: "components_structure.contact_map_section_specific.animations",
    "Form Animations":
      "components_structure.contact_map_section_specific.form_animations",
    "Animation Type":
      "components_structure.contact_map_section_specific.animation_type",
    "Duration (ms)":
      "components_structure.contact_map_section_specific.duration_ms",
    "Delay (ms)": "components_structure.contact_map_section_specific.delay_ms",
    "Map Animations":
      "components_structure.contact_map_section_specific.map_animations",
    "Header Animations":
      "components_structure.contact_map_section_specific.header_animations",
    "Name Field Enabled":
      "components_structure.contact_map_section_specific.name_field_enabled",
    "Country Field Enabled":
      "components_structure.contact_map_section_specific.country_field_enabled",
    "Feedback Field Enabled":
      "components_structure.contact_map_section_specific.feedback_field_enabled",
    "Rating System Enabled":
      "components_structure.contact_map_section_specific.rating_system_enabled",
    "Submit Button Color":
      "components_structure.contact_map_section_specific.submit_button_color",
    "Map Source URL":
      "components_structure.contact_map_section_specific.map_source_url",

    // Contact Cards specific labels
    "Contact Cards 1 - Contact Information Cards":
      "components_structure.contact_cards_specific.contact_cards_1_contact_information_cards",
    Layout: "components_structure.contact_cards_specific.layout",
    Container: "components_structure.contact_cards_specific.container",
    Padding: "components_structure.contact_cards_specific.padding",
    Vertical: "components_structure.contact_cards_specific.vertical",
    Horizontal: "components_structure.contact_cards_specific.horizontal",
    "Grid Layout": "components_structure.contact_cards_specific.grid_layout",
    Columns: "components_structure.contact_cards_specific.columns",
    Mobile: "components_structure.contact_cards_specific.mobile",
    Desktop: "components_structure.contact_cards_specific.desktop",
    Gap: "components_structure.contact_cards_specific.gap",
    "Border Radius":
      "components_structure.contact_cards_specific.border_radius",
    "Contact Cards":
      "components_structure.contact_cards_specific.contact_cards",
    "Add Contact Card":
      "components_structure.contact_cards_specific.add_contact_card",
    "Contact Card": "components_structure.contact_cards_specific.contact_card",
    Icon: "components_structure.contact_cards_specific.icon",
    "Image Source": "components_structure.contact_cards_specific.image_source",
    "Alt Text": "components_structure.contact_cards_specific.alt_text",
    Size: "components_structure.contact_cards_specific.size",
    Title: "components_structure.contact_cards_specific.title",
    Text: "components_structure.contact_cards_specific.text",
    Style: "components_structure.contact_cards_specific.style",
    Weight: "components_structure.contact_cards_specific.weight",
    Color: "components_structure.contact_cards_specific.color",
    "Line Height": "components_structure.contact_cards_specific.line_height",
    Content: "components_structure.contact_cards_specific.content",
    "Content Type": "components_structure.contact_cards_specific.content_type",
    "Simple Text": "components_structure.contact_cards_specific.simple_text",
    "Links Array": "components_structure.contact_cards_specific.links_array",
    "Text Content": "components_structure.contact_cards_specific.text_content",
    Links: "components_structure.contact_cards_specific.links",
    "Add Link": "components_structure.contact_cards_specific.add_link",
    Link: "components_structure.contact_cards_specific.link",
    "Link Text": "components_structure.contact_cards_specific.link_text",
    "Link URL": "components_structure.contact_cards_specific.link_url",
    "Content Style":
      "components_structure.contact_cards_specific.content_style",
    "Card Style": "components_structure.contact_cards_specific.card_style",
    Height: "components_structure.contact_cards_specific.height",
    "Main Gap": "components_structure.contact_cards_specific.main_gap",
    "Content Gap": "components_structure.contact_cards_specific.content_gap",
    "Links Gap": "components_structure.contact_cards_specific.links_gap",
    "Box Shadow": "components_structure.contact_cards_specific.box_shadow",
    Enabled: "components_structure.contact_cards_specific.enabled",
    "Shadow Value": "components_structure.contact_cards_specific.shadow_value",
    Alignment: "components_structure.contact_cards_specific.alignment",
    Horizontal: "components_structure.contact_cards_specific.horizontal",
    Vertical: "components_structure.contact_cards_specific.vertical",
    "Responsive Settings":
      "components_structure.contact_cards_specific.responsive_settings",
    Breakpoints: "components_structure.contact_cards_specific.breakpoints",
    "Grid Columns": "components_structure.contact_cards_specific.grid_columns",
    "Mobile Columns":
      "components_structure.contact_cards_specific.mobile_columns",
    "Desktop Columns":
      "components_structure.contact_cards_specific.desktop_columns",
    Animations: "components_structure.contact_cards_specific.animations",
    "Cards Animation":
      "components_structure.contact_cards_specific.cards_animation",
    Type: "components_structure.contact_cards_specific.type",
    "Duration (ms)": "components_structure.contact_cards_specific.duration_ms",
    "Delay (ms)": "components_structure.contact_cards_specific.delay_ms",
    "Stagger (ms)": "components_structure.contact_cards_specific.stagger_ms",
    "Icons Animation":
      "components_structure.contact_cards_specific.icons_animation",
    "Desktop Columns":
      "components_structure.contact_cards_specific.desktop_columns",
    "Mobile Columns":
      "components_structure.contact_cards_specific.mobile_columns",
    "Grid Gap": "components_structure.contact_cards_specific.grid_gap",
    "Enable Card Shadow":
      "components_structure.contact_cards_specific.enable_card_shadow",
    "Enable Cards Animation":
      "components_structure.contact_cards_specific.enable_cards_animation",
    "Enable Icons Animation":
      "components_structure.contact_cards_specific.enable_icons_animation",

    // Map Section specific labels
    "Map Section 1 - Interactive Map":
      "components_structure.map_section_specific.map_section_1_interactive_map",
    Height: "components_structure.map_section_specific.height",
    Desktop: "components_structure.map_section_specific.desktop",
    Tablet: "components_structure.map_section_specific.tablet",
    Mobile: "components_structure.map_section_specific.mobile",
    "Map Settings": "components_structure.map_section_specific.map_settings",
    Enabled: "components_structure.map_section_specific.enabled",
    "Google Maps API Key":
      "components_structure.map_section_specific.google_maps_api_key",
    "Map Center": "components_structure.map_section_specific.map_center",
    Latitude: "components_structure.map_section_specific.latitude",
    Longitude: "components_structure.map_section_specific.longitude",
    "Zoom Level": "components_structure.map_section_specific.zoom_level",
    "Map Type": "components_structure.map_section_specific.map_type",
    Roadmap: "components_structure.map_section_specific.roadmap",
    Satellite: "components_structure.map_section_specific.satellite",
    Hybrid: "components_structure.map_section_specific.hybrid",
    Terrain: "components_structure.map_section_specific.terrain",
    "Map Style": "components_structure.map_section_specific.map_style",
    "Gesture Handling":
      "components_structure.map_section_specific.gesture_handling",
    Auto: "components_structure.map_section_specific.auto",
    Cooperative: "components_structure.map_section_specific.cooperative",
    Greedy: "components_structure.map_section_specific.greedy",
    None: "components_structure.map_section_specific.none",
    "Disable Default UI":
      "components_structure.map_section_specific.disable_default_ui",
    "Show Zoom Control":
      "components_structure.map_section_specific.show_zoom_control",
    "Show Map Type Control":
      "components_structure.map_section_specific.show_map_type_control",
    "Show Scale Control":
      "components_structure.map_section_specific.show_scale_control",
    "Show Street View Control":
      "components_structure.map_section_specific.show_street_view_control",
    "Show Rotate Control":
      "components_structure.map_section_specific.show_rotate_control",
    "Show Fullscreen Control":
      "components_structure.map_section_specific.show_fullscreen_control",
    "Map Markers": "components_structure.map_section_specific.map_markers",
    "Markers List": "components_structure.map_section_specific.markers_list",
    "Add Marker": "components_structure.map_section_specific.add_marker",
    Marker: "components_structure.map_section_specific.marker",
    ID: "components_structure.map_section_specific.id",
    Title: "components_structure.map_section_specific.title",
    Description: "components_structure.map_section_specific.description",
    Position: "components_structure.map_section_specific.position",
    "Icon URL": "components_structure.map_section_specific.icon_url",
    "Icon Size": "components_structure.map_section_specific.icon_size",
    Animation: "components_structure.map_section_specific.animation",
    Bounce: "components_structure.map_section_specific.bounce",
    Drop: "components_structure.map_section_specific.drop",
    Clickable: "components_structure.map_section_specific.clickable",
    Draggable: "components_structure.map_section_specific.draggable",
    Visible: "components_structure.map_section_specific.visible",
    "Info Window": "components_structure.map_section_specific.info_window",
    "Max Width": "components_structure.map_section_specific.max_width",
    "Pixel Offset": "components_structure.map_section_specific.pixel_offset",
    "Disable Auto Pan":
      "components_structure.map_section_specific.disable_auto_pan",
    "Z-Index": "components_structure.map_section_specific.z_index",
    "Info Window Style":
      "components_structure.map_section_specific.info_window_style",
    "Background Color":
      "components_structure.map_section_specific.background_color",
    "Border Color": "components_structure.map_section_specific.border_color",
    "Border Radius": "components_structure.map_section_specific.border_radius",
    "Box Shadow": "components_structure.map_section_specific.box_shadow",
    "Map Overlay": "components_structure.map_section_specific.map_overlay",
    Opacity: "components_structure.map_section_specific.opacity",
    "Overlay Color": "components_structure.map_section_specific.overlay_color",
    "Content Overlay":
      "components_structure.map_section_specific.content_overlay",
    Position: "components_structure.map_section_specific.position",
    "Top Left": "components_structure.map_section_specific.top_left",
    "Top Right": "components_structure.map_section_specific.top_right",
    "Bottom Left": "components_structure.map_section_specific.bottom_left",
    "Bottom Right": "components_structure.map_section_specific.bottom_right",
    Center: "components_structure.map_section_specific.center",
    "Content Style": "components_structure.map_section_specific.content_style",
    "Text Color": "components_structure.map_section_specific.text_color",
    Padding: "components_structure.map_section_specific.padding",
    "Max Width": "components_structure.map_section_specific.max_width",
    "Font Settings": "components_structure.map_section_specific.font_settings",
    "Title Font": "components_structure.map_section_specific.title_font",
    Family: "components_structure.map_section_specific.family",
    Size: "components_structure.map_section_specific.size",
    Weight: "components_structure.map_section_specific.weight",
    Color: "components_structure.map_section_specific.color",
    "Line Height": "components_structure.map_section_specific.line_height",
    "Description Font":
      "components_structure.map_section_specific.description_font",
    "Responsive Settings":
      "components_structure.map_section_specific.responsive_settings",
    Breakpoints: "components_structure.map_section_specific.breakpoints",
    "Responsive Height":
      "components_structure.map_section_specific.responsive_height",
    "Mobile Height": "components_structure.map_section_specific.mobile_height",
    "Tablet Height": "components_structure.map_section_specific.tablet_height",
    "Desktop Height":
      "components_structure.map_section_specific.desktop_height",
    "Responsive Zoom":
      "components_structure.map_section_specific.responsive_zoom",
    "Mobile Zoom": "components_structure.map_section_specific.mobile_zoom",
    "Tablet Zoom": "components_structure.map_section_specific.tablet_zoom",
    "Desktop Zoom": "components_structure.map_section_specific.desktop_zoom",
    Animations: "components_structure.map_section_specific.animations",
    "Map Load Animation":
      "components_structure.map_section_specific.map_load_animation",
    Type: "components_structure.map_section_specific.type",
    "Duration (ms)": "components_structure.map_section_specific.duration_ms",
    "Delay (ms)": "components_structure.map_section_specific.delay_ms",
    "Fade In": "components_structure.map_section_specific.fade_in",
    "Slide Up": "components_structure.map_section_specific.slide_up",
    Scale: "components_structure.map_section_specific.scale",
    "Markers Animation":
      "components_structure.map_section_specific.markers_animation",
    "Stagger Delay (ms)":
      "components_structure.map_section_specific.stagger_delay_ms",
    "Content Animation":
      "components_structure.map_section_specific.content_animation",
    "Slide In": "components_structure.map_section_specific.slide_in",
    "Map Events": "components_structure.map_section_specific.map_events",
    "On Map Click": "components_structure.map_section_specific.on_map_click",
    "On Marker Click":
      "components_structure.map_section_specific.on_marker_click",
    "On Map Load": "components_structure.map_section_specific.on_map_load",
    "On Zoom Change":
      "components_structure.map_section_specific.on_zoom_change",
    "On Center Change":
      "components_structure.map_section_specific.on_center_change",
    "Show Map": "components_structure.map_section_specific.show_map",
    "Google Maps API Key":
      "components_structure.map_section_specific.google_maps_api_key",
    "Map Latitude": "components_structure.map_section_specific.map_latitude",
    "Map Longitude": "components_structure.map_section_specific.map_longitude",
    "Map Zoom Level":
      "components_structure.map_section_specific.map_zoom_level",
    "Show Markers": "components_structure.map_section_specific.show_markers",
    "Show Info Window":
      "components_structure.map_section_specific.show_info_window",
    "Show Content Overlay":
      "components_structure.map_section_specific.show_content_overlay",
    "Content Title": "components_structure.map_section_specific.content_title",
    "Content Description":
      "components_structure.map_section_specific.content_description",
    "Show Map Overlay":
      "components_structure.map_section_specific.show_map_overlay",
    "Enable Map Load Animation":
      "components_structure.map_section_specific.enable_map_load_animation",
    "Enable Markers Animation":
      "components_structure.map_section_specific.enable_markers_animation",
    "Enable Content Animation":
      "components_structure.map_section_specific.enable_content_animation",

    // Contact Form Section specific labels
    "Contact Form Section 1 - Social Links & Form":
      "components_structure.contact_form_section_specific.contact_form_section_1_social_links_form",
    Layout: "components_structure.contact_form_section_specific.layout",
    Container: "components_structure.contact_form_section_specific.container",
    "Max Width": "components_structure.contact_form_section_specific.max_width",
    Padding: "components_structure.contact_form_section_specific.padding",
    "Grid Layout":
      "components_structure.contact_form_section_specific.grid_layout",
    Desktop: "components_structure.contact_form_section_specific.desktop",
    Tablet: "components_structure.contact_form_section_specific.tablet",
    Mobile: "components_structure.contact_form_section_specific.mobile",
    Gap: "components_structure.contact_form_section_specific.gap",
    Content: "components_structure.contact_form_section_specific.content",
    Title: "components_structure.contact_form_section_specific.title",
    Text: "components_structure.contact_form_section_specific.text",
    Style: "components_structure.contact_form_section_specific.style",
    Size: "components_structure.contact_form_section_specific.size",
    Color: "components_structure.contact_form_section_specific.color",
    Weight: "components_structure.contact_form_section_specific.weight",
    Margin: "components_structure.contact_form_section_specific.margin",
    "Social Links":
      "components_structure.contact_form_section_specific.social_links",
    "Add Social Link":
      "components_structure.contact_form_section_specific.add_social_link",
    "Social Link":
      "components_structure.contact_form_section_specific.social_link",
    URL: "components_structure.contact_form_section_specific.url",
    Platform: "components_structure.contact_form_section_specific.platform",
    Facebook: "components_structure.contact_form_section_specific.facebook",
    "X (Twitter)":
      "components_structure.contact_form_section_specific.x_twitter",
    Instagram: "components_structure.contact_form_section_specific.instagram",
    LinkedIn: "components_structure.contact_form_section_specific.linkedin",
    WhatsApp: "components_structure.contact_form_section_specific.whatsapp",
    "Display Text":
      "components_structure.contact_form_section_specific.display_text",
    "Icon Settings":
      "components_structure.contact_form_section_specific.icon_settings",
    Size: "components_structure.contact_form_section_specific.size",
    Color: "components_structure.contact_form_section_specific.color",
    "Text Style":
      "components_structure.contact_form_section_specific.text_style",
    Weight: "components_structure.contact_form_section_specific.weight",
    "Contact Form":
      "components_structure.contact_form_section_specific.contact_form",
    "Form Layout":
      "components_structure.contact_form_section_specific.form_layout",
    Width: "components_structure.contact_form_section_specific.width",
    Gap: "components_structure.contact_form_section_specific.gap",
    "Form Fields":
      "components_structure.contact_form_section_specific.form_fields",
    "Name Field":
      "components_structure.contact_form_section_specific.name_field",
    Enabled: "components_structure.contact_form_section_specific.enabled",
    Placeholder:
      "components_structure.contact_form_section_specific.placeholder",
    Required: "components_structure.contact_form_section_specific.required",
    Style: "components_structure.contact_form_section_specific.style",
    Border: "components_structure.contact_form_section_specific.border",
    Padding: "components_structure.contact_form_section_specific.padding",
    Outline: "components_structure.contact_form_section_specific.outline",
    "Email Field":
      "components_structure.contact_form_section_specific.email_field",
    "Message Field":
      "components_structure.contact_form_section_specific.message_field",
    Rows: "components_structure.contact_form_section_specific.rows",
    Margin: "components_structure.contact_form_section_specific.margin",
    "Submit Button":
      "components_structure.contact_form_section_specific.submit_button",
    Text: "components_structure.contact_form_section_specific.text",
    Background: "components_structure.contact_form_section_specific.background",
    "Text Color":
      "components_structure.contact_form_section_specific.text_color",
    "Border Radius":
      "components_structure.contact_form_section_specific.border_radius",
    Width: "components_structure.contact_form_section_specific.width",
    Padding: "components_structure.contact_form_section_specific.padding",
    "Font Size": "components_structure.contact_form_section_specific.font_size",
    "Hover Effect":
      "components_structure.contact_form_section_specific.hover_effect",
    "Responsive Settings":
      "components_structure.contact_form_section_specific.responsive_settings",
    Breakpoints:
      "components_structure.contact_form_section_specific.breakpoints",
    Mobile: "components_structure.contact_form_section_specific.mobile",
    Tablet: "components_structure.contact_form_section_specific.tablet",
    Desktop: "components_structure.contact_form_section_specific.desktop",
    "Responsive Layout":
      "components_structure.contact_form_section_specific.responsive_layout",
    "Social Section":
      "components_structure.contact_form_section_specific.social_section",
    "Mobile Width":
      "components_structure.contact_form_section_specific.mobile_width",
    "Tablet Width":
      "components_structure.contact_form_section_specific.tablet_width",
    "Desktop Width":
      "components_structure.contact_form_section_specific.desktop_width",
    "Form Section":
      "components_structure.contact_form_section_specific.form_section",
    "Mobile Width":
      "components_structure.contact_form_section_specific.mobile_width",
    "Tablet Width":
      "components_structure.contact_form_section_specific.tablet_width",
    "Desktop Width":
      "components_structure.contact_form_section_specific.desktop_width",
    Animations: "components_structure.contact_form_section_specific.animations",
    "Title Animation":
      "components_structure.contact_form_section_specific.title_animation",
    Type: "components_structure.contact_form_section_specific.type",
    "Duration (ms)":
      "components_structure.contact_form_section_specific.duration_ms",
    "Delay (ms)": "components_structure.contact_form_section_specific.delay_ms",
    "Social Links Animation":
      "components_structure.contact_form_section_specific.social_links_animation",
    "Stagger (ms)":
      "components_structure.contact_form_section_specific.stagger_ms",
    "Form Animation":
      "components_structure.contact_form_section_specific.form_animation",
    Visible: "components_structure.contact_form_section_specific.visible",
    Title: "components_structure.contact_form_section_specific.title",
    "Submit Button Text":
      "components_structure.contact_form_section_specific.submit_button_text",
    "Show Name Field":
      "components_structure.contact_form_section_specific.show_name_field",
    "Show Email Field":
      "components_structure.contact_form_section_specific.show_email_field",
    "Show Message Field":
      "components_structure.contact_form_section_specific.show_message_field",
    "Show Submit Button":
      "components_structure.contact_form_section_specific.show_submit_button",
    "Enable Title Animation":
      "components_structure.contact_form_section_specific.enable_title_animation",
    "Enable Social Links Animation":
      "components_structure.contact_form_section_specific.enable_social_links_animation",
    "Enable Form Animation":
      "components_structure.contact_form_section_specific.enable_form_animation",

    // Header specific labels
    "Header 1 - Modern": "components_structure.header_specific.header_1_modern",
    Visible: "components_structure.header_specific.visible",
    Position: "components_structure.header_specific.position",
    Type: "components_structure.header_specific.type",
    Static: "components_structure.header_specific.static",
    Sticky: "components_structure.header_specific.sticky",
    Fixed: "components_structure.header_specific.fixed",
    "Top (px)": "components_structure.header_specific.top_px",
    "Z-Index": "components_structure.header_specific.z_index",
    Heights: "components_structure.header_specific.heights",
    "Desktop (px)": "components_structure.header_specific.desktop_px",
    "Tablet (px)": "components_structure.header_specific.tablet_px",
    "Mobile (px)": "components_structure.header_specific.mobile_px",
    Background: "components_structure.header_specific.background",
    Mode: "components_structure.header_specific.mode",
    Solid: "components_structure.header_specific.solid",
    Gradient: "components_structure.header_specific.gradient",
    "Opacity (0-1)": "components_structure.header_specific.opacity_0_1",
    "Blur (Backdrop)": "components_structure.header_specific.blur_backdrop",
    Colors: "components_structure.header_specific.colors",
    From: "components_structure.header_specific.from",
    To: "components_structure.header_specific.to",
    "Text Color": "components_structure.header_specific.text_color",
    "Nav Link Color": "components_structure.header_specific.nav_link_color",
    "Nav Link Hover": "components_structure.header_specific.nav_link_hover",
    "Nav Link Active": "components_structure.header_specific.nav_link_active",
    "Icon Color": "components_structure.header_specific.icon_color",
    "Icon Hover": "components_structure.header_specific.icon_hover",
    "Border Color": "components_structure.header_specific.border_color",
    "Accent Color": "components_structure.header_specific.accent_color",
    Logo: "components_structure.header_specific.logo",
    Type: "components_structure.header_specific.type",
    "Image+Text": "components_structure.header_specific.image_text",
    "Image Only": "components_structure.header_specific.image_only",
    "Text Only": "components_structure.header_specific.text_only",
    "Image URL": "components_structure.header_specific.image_url",
    Text: "components_structure.header_specific.text",
    Font: "components_structure.header_specific.font",
    Family: "components_structure.header_specific.family",
    "Size (px)": "components_structure.header_specific.size_px",
    Weight: "components_structure.header_specific.weight",
    Regular: "components_structure.header_specific.regular",
    Medium: "components_structure.header_specific.medium",
    "Semi Bold": "components_structure.header_specific.semi_bold",
    Bold: "components_structure.header_specific.bold",
    URL: "components_structure.header_specific.url",
    "Click Action": "components_structure.header_specific.click_action",
    Navigate: "components_structure.header_specific.navigate",
    None: "components_structure.header_specific.none",
    "Menu Items": "components_structure.header_specific.menu_items",
    "Add Item": "components_structure.header_specific.add_item",
    Item: "components_structure.header_specific.item",
    Link: "components_structure.header_specific.link",
    "Mega Menu": "components_structure.header_specific.mega_menu",
    Dropdown: "components_structure.header_specific.dropdown",
    Button: "components_structure.header_specific.button",
    "Icon (name)": "components_structure.header_specific.icon_name",
    "Dynamic Data": "components_structure.header_specific.dynamic_data",
    Enabled: "components_structure.header_specific.enabled",
    "Source API": "components_structure.header_specific.source_api",
    Mapping: "components_structure.header_specific.mapping",
    "Label Field": "components_structure.header_specific.label_field",
    "URL Pattern": "components_structure.header_specific.url_pattern",
    Submenu: "components_structure.header_specific.submenu",
    "Add Subsection": "components_structure.header_specific.add_subsection",
    Section: "components_structure.header_specific.section",
    Section: "components_structure.header_specific.section",
    Links: "components_structure.header_specific.links",
    Title: "components_structure.header_specific.title",
    Items: "components_structure.header_specific.items",
    "Add Item": "components_structure.header_specific.add_item",
    Item: "components_structure.header_specific.item",
    Label: "components_structure.header_specific.label",
    URL: "components_structure.header_specific.url",
    Actions: "components_structure.header_specific.actions",
    Search: "components_structure.header_specific.search",
    Placeholder: "components_structure.header_specific.placeholder",
    Type: "components_structure.header_specific.type",
    Global: "components_structure.header_specific.global",
    Products: "components_structure.header_specific.products",
    "Live Suggestions": "components_structure.header_specific.live_suggestions",
    API: "components_structure.header_specific.api",
    "User Actions": "components_structure.header_specific.user_actions",
    "Show Profile": "components_structure.header_specific.show_profile",
    "Show Cart": "components_structure.header_specific.show_cart",
    "Show Wishlist": "components_structure.header_specific.show_wishlist",
    "Show Notifications":
      "components_structure.header_specific.show_notifications",
    "Mobile Menu": "components_structure.header_specific.mobile_menu",
    "Show Logo in Mobile Menu":
      "components_structure.header_specific.show_logo_in_mobile_menu",
    "Show Language Toggle":
      "components_structure.header_specific.show_language_toggle",
    "Show Search in Mobile Menu":
      "components_structure.header_specific.show_search_in_mobile_menu",
    Responsive: "components_structure.header_specific.responsive",
    Breakpoints: "components_structure.header_specific.breakpoints",
    "Mobile (px)": "components_structure.header_specific.mobile_px",
    "Tablet (px)": "components_structure.header_specific.tablet_px",
    "Desktop (px)": "components_structure.header_specific.desktop_px",
    "Mobile Menu": "components_structure.header_specific.mobile_menu",
    Side: "components_structure.header_specific.side",
    Left: "components_structure.header_specific.left",
    Right: "components_structure.header_specific.right",
    "Width (px)": "components_structure.header_specific.width_px",
    "Show Overlay": "components_structure.header_specific.show_overlay",
    Animations: "components_structure.header_specific.animations",
    "Menu Items": "components_structure.header_specific.menu_items",
    "Duration (ms)": "components_structure.header_specific.duration_ms",
    "Delay (ms)": "components_structure.header_specific.delay_ms",
    "Mobile Menu": "components_structure.header_specific.mobile_menu",
    Easing: "components_structure.header_specific.easing",
    "Background Mode": "components_structure.header_specific.background_mode",
    "Background From": "components_structure.header_specific.background_from",
    "Background To": "components_structure.header_specific.background_to",
    "Nav Link": "components_structure.header_specific.nav_link",
    "Nav Link Hover": "components_structure.header_specific.nav_link_hover",
    "Nav Link Active": "components_structure.header_specific.nav_link_active",
    Icon: "components_structure.header_specific.icon",
    "Icon Hover": "components_structure.header_specific.icon_hover",
    Border: "components_structure.header_specific.border",
    Accent: "components_structure.header_specific.accent",
    "Logo Image": "components_structure.header_specific.logo_image",
    "Logo Text": "components_structure.header_specific.logo_text",

    // Property Filter specific labels
    "Property Filter 1 - Search & Filter Form":
      "components_structure.property_filter_specific.property_filter_1_search_filter_form",
    Visible: "components_structure.property_filter_specific.visible",
    Content: "components_structure.property_filter_specific.content",
    "Search Input Placeholder":
      "components_structure.property_filter_specific.search_input_placeholder",
    "Property Type Placeholder":
      "components_structure.property_filter_specific.property_type_placeholder",
    "Price Input Placeholder":
      "components_structure.property_filter_specific.price_input_placeholder",
    "Search Button Text":
      "components_structure.property_filter_specific.search_button_text",
    "No Results Text":
      "components_structure.property_filter_specific.no_results_text",
    "Property Types List":
      "components_structure.property_filter_specific.property_types_list",
    Styling: "components_structure.property_filter_specific.styling",
    "Form Styling":
      "components_structure.property_filter_specific.form_styling",
    "Background Color":
      "components_structure.property_filter_specific.background_color",
    "Border Radius":
      "components_structure.property_filter_specific.border_radius",
    Padding: "components_structure.property_filter_specific.padding",
    "Gap Between Fields":
      "components_structure.property_filter_specific.gap_between_fields",
    "Input Fields Styling":
      "components_structure.property_filter_specific.input_fields_styling",
    "Border Color":
      "components_structure.property_filter_specific.border_color",
    "Text Color": "components_structure.property_filter_specific.text_color",
    "Placeholder Color":
      "components_structure.property_filter_specific.placeholder_color",
    Height: "components_structure.property_filter_specific.height",
    "Font Size": "components_structure.property_filter_specific.font_size",
    "Dropdown Styling":
      "components_structure.property_filter_specific.dropdown_styling",
    "Hover Background Color":
      "components_structure.property_filter_specific.hover_background_color",
    "Max Height": "components_structure.property_filter_specific.max_height",
    "Box Shadow": "components_structure.property_filter_specific.box_shadow",
    "Search Button Styling":
      "components_structure.property_filter_specific.search_button_styling",
    "Hover Background Color":
      "components_structure.property_filter_specific.hover_background_color",
    "Font Weight": "components_structure.property_filter_specific.font_weight",
    "Layout Settings":
      "components_structure.property_filter_specific.layout_settings",
    "Form Layout": "components_structure.property_filter_specific.form_layout",
    Grid: "components_structure.property_filter_specific.grid",
    Flex: "components_structure.property_filter_specific.flex",
    "Responsive Settings":
      "components_structure.property_filter_specific.responsive_settings",
    "Mobile Grid Columns":
      "components_structure.property_filter_specific.mobile_grid_columns",
    "Tablet Grid Columns":
      "components_structure.property_filter_specific.tablet_grid_columns",
    "Desktop Grid Columns":
      "components_structure.property_filter_specific.desktop_grid_columns",
    "Field Widths":
      "components_structure.property_filter_specific.field_widths",
    "Search Field Width":
      "components_structure.property_filter_specific.search_field_width",
    "Type Field Width":
      "components_structure.property_filter_specific.type_field_width",
    "Price Field Width":
      "components_structure.property_filter_specific.price_field_width",
    "Button Width":
      "components_structure.property_filter_specific.button_width",
    Spacing: "components_structure.property_filter_specific.spacing",
    "Margin Bottom":
      "components_structure.property_filter_specific.margin_bottom",
    "Gap Between Fields":
      "components_structure.property_filter_specific.gap_between_fields",
    "Search Input Placeholder":
      "components_structure.property_filter_specific.search_input_placeholder",
    "Property Type Placeholder":
      "components_structure.property_filter_specific.property_type_placeholder",
    "Price Input Placeholder":
      "components_structure.property_filter_specific.price_input_placeholder",
    "Search Button Text":
      "components_structure.property_filter_specific.search_button_text",
    "No Results Text":
      "components_structure.property_filter_specific.no_results_text",
    "Form Background Color":
      "components_structure.property_filter_specific.form_background_color",
    "Form Border Radius":
      "components_structure.property_filter_specific.form_border_radius",
    "Form Padding":
      "components_structure.property_filter_specific.form_padding",
    "Form Gap": "components_structure.property_filter_specific.form_gap",
    "Input Background Color":
      "components_structure.property_filter_specific.input_background_color",
    "Input Border Color":
      "components_structure.property_filter_specific.input_border_color",
    "Input Text Color":
      "components_structure.property_filter_specific.input_text_color",
    "Input Placeholder Color":
      "components_structure.property_filter_specific.input_placeholder_color",
    "Input Border Radius":
      "components_structure.property_filter_specific.input_border_radius",
    "Input Padding":
      "components_structure.property_filter_specific.input_padding",
    "Input Height":
      "components_structure.property_filter_specific.input_height",
    "Input Font Size":
      "components_structure.property_filter_specific.input_font_size",
    "Dropdown Background Color":
      "components_structure.property_filter_specific.dropdown_background_color",
    "Dropdown Border Color":
      "components_structure.property_filter_specific.dropdown_border_color",
    "Dropdown Text Color":
      "components_structure.property_filter_specific.dropdown_text_color",
    "Dropdown Hover Background Color":
      "components_structure.property_filter_specific.dropdown_hover_background_color",
    "Dropdown Border Radius":
      "components_structure.property_filter_specific.dropdown_border_radius",
    "Dropdown Max Height":
      "components_structure.property_filter_specific.dropdown_max_height",
    "Dropdown Box Shadow":
      "components_structure.property_filter_specific.dropdown_box_shadow",
    "Search Button Background Color":
      "components_structure.property_filter_specific.search_button_background_color",
    "Search Button Text Color":
      "components_structure.property_filter_specific.search_button_text_color",
    "Search Button Hover Background Color":
      "components_structure.property_filter_specific.search_button_hover_background_color",
    "Search Button Border Radius":
      "components_structure.property_filter_specific.search_button_border_radius",
    "Search Button Padding":
      "components_structure.property_filter_specific.search_button_padding",
    "Search Button Font Size":
      "components_structure.property_filter_specific.search_button_font_size",
    "Search Button Font Weight":
      "components_structure.property_filter_specific.search_button_font_weight",
    "Form Layout": "components_structure.property_filter_specific.form_layout",
    "Mobile Grid Columns":
      "components_structure.property_filter_specific.mobile_grid_columns",
    "Tablet Grid Columns":
      "components_structure.property_filter_specific.tablet_grid_columns",
    "Desktop Grid Columns":
      "components_structure.property_filter_specific.desktop_grid_columns",
    "Search Field Width":
      "components_structure.property_filter_specific.search_field_width",
    "Type Field Width":
      "components_structure.property_filter_specific.type_field_width",
    "Price Field Width":
      "components_structure.property_filter_specific.price_field_width",
    "Button Width":
      "components_structure.property_filter_specific.button_width",
    "Margin Bottom":
      "components_structure.property_filter_specific.margin_bottom",
    "Gap Between Fields":
      "components_structure.property_filter_specific.gap_between_fields",

    // Filter Buttons specific labels
    "Filter Buttons 1 - Property Filters":
      "components_structure.filter_buttons_specific.filter_buttons_1_property_filters",
    Visible: "components_structure.filter_buttons_specific.visible",
    Content: "components_structure.filter_buttons_specific.content",
    "Inspection Request Button Text":
      "components_structure.filter_buttons_specific.inspection_request_button_text",
    "Inspection Request Button URL":
      "components_structure.filter_buttons_specific.inspection_request_button_url",
    "All Button Text":
      "components_structure.filter_buttons_specific.all_button_text",
    "Available Button Text":
      "components_structure.filter_buttons_specific.available_button_text",
    "Sold Button Text":
      "components_structure.filter_buttons_specific.sold_button_text",
    "Rented Button Text":
      "components_structure.filter_buttons_specific.rented_button_text",
    Styling: "components_structure.filter_buttons_specific.styling",
    "Inspection Button Styling":
      "components_structure.filter_buttons_specific.inspection_button_styling",
    "Background Color":
      "components_structure.filter_buttons_specific.background_color",
    "Text Color": "components_structure.filter_buttons_specific.text_color",
    "Hover Background Color":
      "components_structure.filter_buttons_specific.hover_background_color",
    "Border Radius":
      "components_structure.filter_buttons_specific.border_radius",
    Padding: "components_structure.filter_buttons_specific.padding",
    "Font Size": "components_structure.filter_buttons_specific.font_size",
    "Filter Buttons Styling":
      "components_structure.filter_buttons_specific.filter_buttons_styling",
    "Active Background Color":
      "components_structure.filter_buttons_specific.active_background_color",
    "Active Text Color":
      "components_structure.filter_buttons_specific.active_text_color",
    "Inactive Background Color":
      "components_structure.filter_buttons_specific.inactive_background_color",
    "Inactive Text Color":
      "components_structure.filter_buttons_specific.inactive_text_color",
    "Hover Background Color":
      "components_structure.filter_buttons_specific.hover_background_color",
    "Border Radius":
      "components_structure.filter_buttons_specific.border_radius",
    Padding: "components_structure.filter_buttons_specific.padding",
    "Font Size": "components_structure.filter_buttons_specific.font_size",
    "Gap Between Buttons":
      "components_structure.filter_buttons_specific.gap_between_buttons",
    "Layout Settings":
      "components_structure.filter_buttons_specific.layout_settings",
    "Layout Direction":
      "components_structure.filter_buttons_specific.layout_direction",
    "Button Alignment":
      "components_structure.filter_buttons_specific.button_alignment",
    "Inspection Button Width":
      "components_structure.filter_buttons_specific.inspection_button_width",
    Spacing: "components_structure.filter_buttons_specific.spacing",
    "Margin Bottom":
      "components_structure.filter_buttons_specific.margin_bottom",
    "Gap Between Elements":
      "components_structure.filter_buttons_specific.gap_between_elements",
    "Inspection Request Button Text":
      "components_structure.filter_buttons_specific.inspection_request_button_text",
    "Inspection Request Button URL":
      "components_structure.filter_buttons_specific.inspection_request_button_url",
    "All Button Text":
      "components_structure.filter_buttons_specific.all_button_text",
    "Available Button Text":
      "components_structure.filter_buttons_specific.available_button_text",
    "Sold Button Text":
      "components_structure.filter_buttons_specific.sold_button_text",
    "Rented Button Text":
      "components_structure.filter_buttons_specific.rented_button_text",
    "Inspection Button Background Color":
      "components_structure.filter_buttons_specific.inspection_button_background_color",
    "Inspection Button Text Color":
      "components_structure.filter_buttons_specific.inspection_button_text_color",
    "Inspection Button Hover Background Color":
      "components_structure.filter_buttons_specific.inspection_button_hover_background_color",
    "Inspection Button Border Radius":
      "components_structure.filter_buttons_specific.inspection_button_border_radius",
    "Inspection Button Padding":
      "components_structure.filter_buttons_specific.inspection_button_padding",
    "Inspection Button Font Size":
      "components_structure.filter_buttons_specific.inspection_button_font_size",
    "Active Filter Button Background Color":
      "components_structure.filter_buttons_specific.active_filter_button_background_color",
    "Active Filter Button Text Color":
      "components_structure.filter_buttons_specific.active_filter_button_text_color",
    "Inactive Filter Button Background Color":
      "components_structure.filter_buttons_specific.inactive_filter_button_background_color",
    "Inactive Filter Button Text Color":
      "components_structure.filter_buttons_specific.inactive_filter_button_text_color",
    "Filter Button Hover Background Color":
      "components_structure.filter_buttons_specific.filter_button_hover_background_color",
    "Filter Button Border Radius":
      "components_structure.filter_buttons_specific.filter_button_border_radius",
    "Filter Button Padding":
      "components_structure.filter_buttons_specific.filter_button_padding",
    "Filter Button Font Size":
      "components_structure.filter_buttons_specific.filter_button_font_size",
    "Gap Between Filter Buttons":
      "components_structure.filter_buttons_specific.gap_between_filter_buttons",
    "Layout Direction":
      "components_structure.filter_buttons_specific.layout_direction",
    "Button Alignment":
      "components_structure.filter_buttons_specific.button_alignment",
    "Inspection Button Width":
      "components_structure.filter_buttons_specific.inspection_button_width",
    "Margin Bottom":
      "components_structure.filter_buttons_specific.margin_bottom",
    "Gap Between Elements":
      "components_structure.filter_buttons_specific.gap_between_elements",

    "Image Source":
      "components_structure.half_text_half_image_specific.image_source",
    "Alt Text": "components_structure.half_text_half_image_specific.alt_text",
    "Image Style":
      "components_structure.half_text_half_image_specific.image_style",
    "Aspect Ratio":
      "components_structure.half_text_half_image_specific.aspect_ratio",
    "Object Fit":
      "components_structure.half_text_half_image_specific.object_fit",
    Contain: "components_structure.half_text_half_image_specific.contain",
    Cover: "components_structure.half_text_half_image_specific.cover",
    Fill: "components_structure.half_text_half_image_specific.fill",
    "Border Radius":
      "components_structure.half_text_half_image_specific.border_radius",
    "Background Overlay":
      "components_structure.half_text_half_image_specific.background_overlay",
    "Show Background":
      "components_structure.half_text_half_image_specific.show_background",
    "Background Color":
      "components_structure.half_text_half_image_specific.background_color",
    "Width (%)":
      "components_structure.half_text_half_image_specific.width_percent",
    "Border Radius":
      "components_structure.half_text_half_image_specific.border_radius",
    Responsive: "components_structure.half_text_half_image_specific.responsive",
    Mobile: "components_structure.half_text_half_image_specific.mobile",
    "Text Order":
      "components_structure.half_text_half_image_specific.text_order",
    "Image Order":
      "components_structure.half_text_half_image_specific.image_order",
    "Text Width":
      "components_structure.half_text_half_image_specific.text_width",
    "Image Width":
      "components_structure.half_text_half_image_specific.image_width",
    "Image Margin Bottom":
      "components_structure.half_text_half_image_specific.image_margin_bottom",
    Tablet: "components_structure.half_text_half_image_specific.tablet",
    Desktop: "components_structure.half_text_half_image_specific.desktop",
    Animations: "components_structure.half_text_half_image_specific.animations",
    "Text Animation":
      "components_structure.half_text_half_image_specific.text_animation",
    "Enable Animation":
      "components_structure.half_text_half_image_specific.enable_animation",
    "Animation Type":
      "components_structure.half_text_half_image_specific.animation_type",
    "Fade Up": "components_structure.half_text_half_image_specific.fade_up",
    "Fade Left": "components_structure.half_text_half_image_specific.fade_left",
    "Fade Right":
      "components_structure.half_text_half_image_specific.fade_right",
    "Slide Up": "components_structure.half_text_half_image_specific.slide_up",
    "Duration (ms)":
      "components_structure.half_text_half_image_specific.duration_ms",
    "Delay (ms)": "components_structure.half_text_half_image_specific.delay_ms",
    "Image Animation":
      "components_structure.half_text_half_image_specific.image_animation",
    "Eyebrow Text":
      "components_structure.half_text_half_image_specific.eyebrow_text",
    "Button Text":
      "components_structure.half_text_half_image_specific.button_text",
    Image: "components_structure.half_text_half_image_specific.image",
    "Image Alt Text":
      "components_structure.half_text_half_image_specific.image_alt_text",
    "Show Button":
      "components_structure.half_text_half_image_specific.show_button",
    "Max Width": "components_structure.half_text_half_image_specific.max_width",
    "Grid Columns":
      "components_structure.half_text_half_image_specific.grid_columns",
    Gap: "components_structure.half_text_half_image_specific.gap",
    "Horizontal Gap":
      "components_structure.half_text_half_image_specific.horizontal_gap",
    "Vertical Gap":
      "components_structure.half_text_half_image_specific.vertical_gap",
    "Medium Vertical Gap":
      "components_structure.half_text_half_image_specific.medium_vertical_gap",

    // Grid specific labels
    "Property Grid 1 - Standard Layout":
      "components_structure.grid_specific.property_grid_1_standard_layout",
    Content: "components_structure.grid_specific.content",
    "Section Title": "components_structure.grid_specific.section_title",
    "Section Subtitle": "components_structure.grid_specific.section_subtitle",
    "Empty State Message":
      "components_structure.grid_specific.empty_state_message",
    Styling: "components_structure.grid_specific.styling",
    "Background Color": "components_structure.grid_specific.background_color",
    "Text Color": "components_structure.grid_specific.text_color",
    "Title Color": "components_structure.grid_specific.title_color",
    "Subtitle Color": "components_structure.grid_specific.subtitle_color",
    "Grid Gap": "components_structure.grid_specific.grid_gap",
    "Max Width": "components_structure.grid_specific.max_width",
    "Layout Settings": "components_structure.grid_specific.layout_settings",
    "Grid Columns": "components_structure.grid_specific.grid_columns",
    "Mobile Columns": "components_structure.grid_specific.mobile_columns",
    "Tablet Columns": "components_structure.grid_specific.tablet_columns",
    "Desktop Columns": "components_structure.grid_specific.desktop_columns",
    "Large Desktop Columns":
      "components_structure.grid_specific.large_desktop_columns",
    "Section Padding": "components_structure.grid_specific.section_padding",
    "Top Padding": "components_structure.grid_specific.top_padding",
    "Bottom Padding": "components_structure.grid_specific.bottom_padding",
    "Horizontal Padding":
      "components_structure.grid_specific.horizontal_padding",

    // Properties Showcase specific labels
    "Properties Showcase 1 - Grid Layout":
      "components_structure.propertiesShowcase_specific.properties_showcase_1_grid_layout",
    "Theme Two": "components_structure.propertiesShowcase_specific.theme_two",
    Properties: "components_structure.propertiesShowcase.properties",
    Property: "components_structure.propertiesShowcase.property",
    Layout: "components_structure.propertiesShowcase.layout",
    "Max Width": "components_structure.propertiesShowcase.max_width",
    "Grid Columns": "components_structure.propertiesShowcase.columns",
    "Mobile Columns": "components_structure.propertiesShowcase.mobile_columns",
    "Tablet Columns": "components_structure.propertiesShowcase.tablet_columns",
    "Desktop Columns":
      "components_structure.propertiesShowcase.desktop_columns",
    "Gap Between Cards": "components_structure.propertiesShowcase.gap",
    "Section Padding": "components_structure.propertiesShowcase.padding",
    "Top Padding": "components_structure.propertiesShowcase.top_padding",
    "Bottom Padding": "components_structure.propertiesShowcase.bottom_padding",
    Content: "components_structure.propertiesShowcase.content",
    "Section Title": "components_structure.propertiesShowcase.title",
    "Load More Button Text":
      "components_structure.propertiesShowcase.load_more_button_text",
    "View All Button Text":
      "components_structure.propertiesShowcase.view_all_button_text",
    "Card Type": "components_structure.propertiesShowcase.card_type",
    "Card 1": "components_structure.propertiesShowcase.card_1",
    "Card 2": "components_structure.propertiesShowcase.card_2",
    "Add Property": "components_structure.propertiesShowcase.property",
    Property: "components_structure.propertiesShowcase.property",
    "Property ID": "components_structure.propertiesShowcase.property_id",
    "Image URL": "components_structure.propertiesShowcase.image",
    "Property Title": "components_structure.propertiesShowcase.property_title",
    City: "components_structure.propertiesShowcase.city",
    District: "components_structure.propertiesShowcase.district",
    Status: "components_structure.propertiesShowcase.status",
    Area: "components_structure.propertiesShowcase.area",
    "Min Area": "components_structure.propertiesShowcase.min_area",
    "Max Area": "components_structure.propertiesShowcase.max_area",
    Rooms: "components_structure.propertiesShowcase.rooms",
    "Min Rooms": "components_structure.propertiesShowcase.min_rooms",
    "Max Rooms": "components_structure.propertiesShowcase.max_rooms",
    Units: "components_structure.propertiesShowcase.units",
    Floors: "components_structure.propertiesShowcase.floors",
    "Min Floors": "components_structure.propertiesShowcase.min_floors",
    "Max Floors": "components_structure.propertiesShowcase.max_floors",
    Price: "components_structure.propertiesShowcase.price",
    "Min Price": "components_structure.propertiesShowcase.min_price",
    "Max Price": "components_structure.propertiesShowcase.max_price",
    Bathrooms: "components_structure.propertiesShowcase.bathrooms",
    "Min Bathrooms": "components_structure.propertiesShowcase.min_bathrooms",
    "Max Bathrooms": "components_structure.propertiesShowcase.max_bathrooms",
    Featured: "components_structure.propertiesShowcase.featured",
    URL: "components_structure.propertiesShowcase.url",
    Styling: "components_structure.propertiesShowcase.styling",
    "Background Color":
      "components_structure.propertiesShowcase.background_color",
    "Title Color": "components_structure.propertiesShowcase.title_color",
    "Divider Color": "components_structure.propertiesShowcase.divider_color",
    "View All Button Color":
      "components_structure.propertiesShowcase.view_all_button_color",
    "View All Button Hover Color":
      "components_structure.propertiesShowcase.view_all_button_hover_color",
    "Load More Button Border Color":
      "components_structure.propertiesShowcase.load_more_button_color",
    "Load More Button Hover Background":
      "components_structure.propertiesShowcase.load_more_button_hover_color",
    "Load More Button Text Color":
      "components_structure.propertiesShowcase.load_more_button_text_color",
    "Load More Button Hover Text Color":
      "components_structure.propertiesShowcase.load_more_button_hover_text_color",
    Typography: "components_structure.propertiesShowcase.typography",
    "Title Typography": "components_structure.propertiesShowcase.typography",
    "Font Size": "components_structure.propertiesShowcase.font_size",
    "Font Weight": "components_structure.propertiesShowcase.font_weight",
    "Font Family": "components_structure.propertiesShowcase.font_family",
    "Responsive Breakpoints":
      "components_structure.propertiesShowcase_specific.responsive_breakpoints",
    "Mobile Breakpoint":
      "components_structure.propertiesShowcase_specific.mobile_breakpoint",
    "Tablet Breakpoint":
      "components_structure.propertiesShowcase_specific.tablet_breakpoint",
    "Desktop Breakpoint":
      "components_structure.propertiesShowcase_specific.desktop_breakpoint",

    // Map Section specific labels
    "Map Section 1 - Interactive Map":
      "components_structure.map_section_specific.map_section_1_interactive_map",
    Height: "components_structure.map_section_specific.height",
    Desktop: "components_structure.map_section_specific.desktop",
    Tablet: "components_structure.map_section_specific.tablet",
    Mobile: "components_structure.map_section_specific.mobile",
    "Map Settings": "components_structure.map_section_specific.map_settings",
    Enabled: "components_structure.map_section_specific.enabled",
    "Google Maps API Key":
      "components_structure.map_section_specific.google_maps_api_key",
    "Map Center": "components_structure.map_section_specific.map_center",
    Latitude: "components_structure.map_section_specific.latitude",
    Longitude: "components_structure.map_section_specific.longitude",
    "Zoom Level": "components_structure.map_section_specific.zoom_level",
    "Map Type": "components_structure.map_section_specific.map_type",
    Roadmap: "components_structure.map_section_specific.roadmap",
    Satellite: "components_structure.map_section_specific.satellite",
    Hybrid: "components_structure.map_section_specific.hybrid",
    Terrain: "components_structure.map_section_specific.terrain",
    "Map Style": "components_structure.map_section_specific.map_style",
    "Gesture Handling":
      "components_structure.map_section_specific.gesture_handling",
    Auto: "components_structure.map_section_specific.auto",
    Cooperative: "components_structure.map_section_specific.cooperative",
    Greedy: "components_structure.map_section_specific.greedy",
    None: "components_structure.map_section_specific.none",
    "Disable Default UI":
      "components_structure.map_section_specific.disable_default_ui",
    "Show Zoom Control":
      "components_structure.map_section_specific.show_zoom_control",
    "Show Map Type Control":
      "components_structure.map_section_specific.show_map_type_control",
    "Show Scale Control":
      "components_structure.map_section_specific.show_scale_control",
    "Show Street View Control":
      "components_structure.map_section_specific.show_street_view_control",
    "Show Rotate Control":
      "components_structure.map_section_specific.show_rotate_control",
    "Show Fullscreen Control":
      "components_structure.map_section_specific.show_fullscreen_control",
    "Map Markers": "components_structure.map_section_specific.map_markers",
    "Markers List": "components_structure.map_section_specific.markers_list",
    ID: "components_structure.map_section_specific.id",
    Title: "components_structure.map_section_specific.title",
    Description: "components_structure.map_section_specific.description",
    Position: "components_structure.map_section_specific.position",
    "Icon URL": "components_structure.map_section_specific.icon_url",
    "Icon Size": "components_structure.map_section_specific.icon_size",
    Animation: "components_structure.map_section_specific.animation",
    Bounce: "components_structure.map_section_specific.bounce",
    Drop: "components_structure.map_section_specific.drop",
    Clickable: "components_structure.map_section_specific.clickable",
    Draggable: "components_structure.map_section_specific.draggable",
    Visible: "components_structure.map_section_specific.visible",
    "Info Window": "components_structure.map_section_specific.info_window",
    "Max Width": "components_structure.map_section_specific.max_width",
    "Pixel Offset": "components_structure.map_section_specific.pixel_offset",
    "Disable Auto Pan":
      "components_structure.map_section_specific.disable_auto_pan",
    "Z-Index": "components_structure.map_section_specific.z_index",
    "Info Window Style":
      "components_structure.map_section_specific.info_window_style",
    "Background Color":
      "components_structure.map_section_specific.background_color",
    "Border Color": "components_structure.map_section_specific.border_color",
    "Border Radius": "components_structure.map_section_specific.border_radius",
    "Box Shadow": "components_structure.map_section_specific.box_shadow",
    "Map Overlay": "components_structure.map_section_specific.map_overlay",
    Opacity: "components_structure.map_section_specific.opacity",
    "Overlay Color": "components_structure.map_section_specific.overlay_color",
    "Content Overlay":
      "components_structure.map_section_specific.content_overlay",
    Position: "components_structure.map_section_specific.position",
    "Top Left": "components_structure.map_section_specific.top_left",
    "Top Right": "components_structure.map_section_specific.top_right",
    "Bottom Left": "components_structure.map_section_specific.bottom_left",
    "Bottom Right": "components_structure.map_section_specific.bottom_right",
    Center: "components_structure.map_section_specific.center",
    "Content Style": "components_structure.map_section_specific.content_style",
    "Text Color": "components_structure.map_section_specific.text_color",
    Padding: "components_structure.map_section_specific.padding",
    "Box Shadow": "components_structure.map_section_specific.box_shadow",
    "Max Width": "components_structure.map_section_specific.max_width",
    "Font Settings": "components_structure.map_section_specific.font_settings",
    "Title Font": "components_structure.map_section_specific.title_font",
    Family: "components_structure.map_section_specific.family",
    Size: "components_structure.map_section_specific.size",
    Weight: "components_structure.map_section_specific.weight",
    Color: "components_structure.map_section_specific.color",
    "Line Height": "components_structure.map_section_specific.line_height",
    "Description Font":
      "components_structure.map_section_specific.description_font",
    "Responsive Settings":
      "components_structure.map_section_specific.responsive_settings",
    Breakpoints: "components_structure.map_section_specific.breakpoints",
    Mobile: "components_structure.map_section_specific.mobile",
    Tablet: "components_structure.map_section_specific.tablet",
    Desktop: "components_structure.map_section_specific.desktop",
    "Responsive Height":
      "components_structure.map_section_specific.responsive_height",
    "Mobile Height": "components_structure.map_section_specific.mobile_height",
    "Tablet Height": "components_structure.map_section_specific.tablet_height",
    "Desktop Height":
      "components_structure.map_section_specific.desktop_height",
    "Responsive Zoom":
      "components_structure.map_section_specific.responsive_zoom",
    "Mobile Zoom": "components_structure.map_section_specific.mobile_zoom",
    "Tablet Zoom": "components_structure.map_section_specific.tablet_zoom",
    "Desktop Zoom": "components_structure.map_section_specific.desktop_zoom",
    Animations: "components_structure.map_section_specific.animations",
    "Map Load Animation":
      "components_structure.map_section_specific.map_load_animation",
    Type: "components_structure.map_section_specific.type",
    "Fade In": "components_structure.map_section_specific.fade_in",
    "Slide Up": "components_structure.map_section_specific.slide_up",
    Scale: "components_structure.map_section_specific.scale",
    "Duration (ms)": "components_structure.map_section_specific.duration_ms",
    "Delay (ms)": "components_structure.map_section_specific.delay_ms",
    "Markers Animation":
      "components_structure.map_section_specific.markers_animation",

    // Layout specific labels
    "Page name is required": "layout.page_name_required",
    "Slug is required": "layout.slug_required",
    "Slug must contain only lowercase letters, numbers, and hyphens":
      "layout.slug_format_error",
    "This slug already exists": "layout.slug_exists",
    "Meta title is required": "layout.meta_title_required",
    "Page created successfully with default components!":
      "layout.page_created_success_default",
    "Custom page created successfully!": "layout.page_created_success_custom",
    "Error creating page": "layout.page_creation_error",
    "e.g., Products Page": "layout.page_name_placeholder",
    products: "layout.slug_placeholder",
    "URL will be: /tenant/{tenantId}/{formData.slug}": "layout.url_preview",
    "This is a reserved slug": "layout.reserved_slug_warning",
    "Custom slug": "layout.custom_slug_info",
    "SEO Settings": "layout.seo_settings",
    "Meta Title": "layout.meta_title",
    "Meta Description": "layout.meta_description",
    "Meta Keywords": "layout.meta_keywords",
    "e.g., Best Products in Town": "layout.meta_title_placeholder",
    "e.g., Discover our amazing products...":
      "layout.meta_description_placeholder",
    "e.g., products, best, quality": "layout.meta_keywords_placeholder",

    // SaveConfirmationDialog specific labels
    "Apply Theme and Discard Custom Edits?":
      "save_dialog.apply_theme_discard_edits",
    "Confirm Save": "save_dialog.confirm_save",
    "This action will permanently remove all your custom edits and replace them with the selected theme defaults.":
      "save_dialog.theme_warning",
    "All your changes will be saved and applied immediately.":
      "save_dialog.save_changes_info",
    Cancel: "save_dialog.cancel",
    "Loading...": "save_dialog.loading",
    "Apply Theme": "save_dialog.apply_theme",
    "Confirm Save": "save_dialog.confirm_save",

    // Inputs2 specific labels
    "🎛️ Card Visibility Controls":
      "components_structure.inputs2.card_visibility_controls",
    "🎯 Field Visibility Controls":
      "components_structure.inputs2.field_visibility_controls",
    "Field Required Controls":
      "components_structure.inputs2.field_required_controls",
    "Control which fields are required for form submission":
      "components_structure.inputs2.control_required_fields_description",
    "Show Property Information Card":
      "components_structure.inputs2.show_property_info_card",
    "Show Budget & Payment Card":
      "components_structure.inputs2.show_budget_card",
    "Show Additional Details Card":
      "components_structure.inputs2.show_additional_details_card",
    "Show Contact Information Card":
      "components_structure.inputs2.show_contact_card",
    "Show Property Type Field":
      "components_structure.inputs2.show_property_type_field",
    "Show Property Category Field":
      "components_structure.inputs2.show_property_category_field",
    "Show City Field": "components_structure.inputs2.show_city_field",
    "Show District Field": "components_structure.inputs2.show_district_field",
    "Show Area From Field": "components_structure.inputs2.show_area_from_field",
    "Show Area To Field": "components_structure.inputs2.show_area_to_field",
    "Show Purchase Method Field":
      "components_structure.inputs2.show_purchase_method_field",
    "Show Budget From Field":
      "components_structure.inputs2.show_budget_from_field",
    "Show Budget To Field": "components_structure.inputs2.show_budget_to_field",
    "Show Seriousness Field":
      "components_structure.inputs2.show_seriousness_field",
    "Show Purchase Goal Field":
      "components_structure.inputs2.show_purchase_goal_field",
    "Show Similar Offers Field":
      "components_structure.inputs2.show_similar_offers_field",
    "Show Full Name Field": "components_structure.inputs2.show_full_name_field",
    "Show Phone Field": "components_structure.inputs2.show_phone_field",
    "Show WhatsApp Field": "components_structure.inputs2.show_whatsapp_field",
    "Show Notes Field": "components_structure.inputs2.show_notes_field",
    "Property Type Required":
      "components_structure.inputs2.property_type_required",
    "Property Category Required":
      "components_structure.inputs2.property_category_required",
    "City Required": "components_structure.inputs2.city_required",
    "District Required": "components_structure.inputs2.district_required",
    "Area From Required": "components_structure.inputs2.area_from_required",
    "Area To Required": "components_structure.inputs2.area_to_required",
    "Purchase Method Required":
      "components_structure.inputs2.purchase_method_required",
    "Budget From Required": "components_structure.inputs2.budget_from_required",
    "Budget To Required": "components_structure.inputs2.budget_to_required",
    "Seriousness Required": "components_structure.inputs2.seriousness_required",
    "Purchase Goal Required":
      "components_structure.inputs2.purchase_goal_required",
    "Similar Offers Required":
      "components_structure.inputs2.similar_offers_required",
    "Full Name Required": "components_structure.inputs2.full_name_required",
    "Phone Required": "components_structure.inputs2.phone_required",
    "WhatsApp Required": "components_structure.inputs2.whatsapp_required",
    "Notes Required": "components_structure.inputs2.notes_required",
    "Toggle to make property type field required":
      "components_structure.inputs2.toggle_property_type_required",
    "Toggle to make property category field required":
      "components_structure.inputs2.toggle_property_category_required",
    "Toggle to make city field required":
      "components_structure.inputs2.toggle_city_required",
    "Toggle to make district field required":
      "components_structure.inputs2.toggle_district_required",
    "Toggle to make area from field required":
      "components_structure.inputs2.toggle_area_from_required",
    "Toggle to make area to field required":
      "components_structure.inputs2.toggle_area_to_required",
    "Toggle to make purchase method field required":
      "components_structure.inputs2.toggle_purchase_method_required",
    "Toggle to make budget from field required":
      "components_structure.inputs2.toggle_budget_from_required",
    "Toggle to make budget to field required":
      "components_structure.inputs2.toggle_budget_to_required",
    "Toggle to make seriousness field required":
      "components_structure.inputs2.toggle_seriousness_required",
    "Toggle to make purchase goal field required":
      "components_structure.inputs2.toggle_purchase_goal_required",
    "Toggle to make similar offers field required":
      "components_structure.inputs2.toggle_similar_offers_required",
    "Toggle to make full name field required":
      "components_structure.inputs2.toggle_full_name_required",
    "Toggle to make phone field required":
      "components_structure.inputs2.toggle_phone_required",
    "Toggle to make WhatsApp field required":
      "components_structure.inputs2.toggle_whatsapp_required",
    "Toggle to make notes field required":
      "components_structure.inputs2.toggle_notes_required",

    // Inputs specific labels
    "Layout Settings": "components_structure.inputs.layout_settings",
    Direction: "components_structure.inputs.direction",
    "Right to Left": "components_structure.inputs.right_to_left",
    "Left to Right": "components_structure.inputs.left_to_right",
    "Max Width": "components_structure.inputs.max_width",
    Padding: "components_structure.inputs.padding",
    "Vertical Padding": "components_structure.inputs.vertical_padding",
    "Small Vertical Padding":
      "components_structure.inputs.small_vertical_padding",
    "Theme Settings": "components_structure.inputs.theme_settings",
    "Primary Color": "components_structure.inputs.primary_color",
    "Secondary Color": "components_structure.inputs.secondary_color",
    "Accent Color": "components_structure.inputs.accent_color",
    "Submit Button Gradient":
      "components_structure.inputs.submit_button_gradient",
    "Submit Button Settings":
      "components_structure.inputs.submit_button_settings",
    "Button Text": "components_structure.inputs.button_text",
    "Show Button": "components_structure.inputs.show_button",
    "CSS Classes": "components_structure.inputs.css_classes",
    "Background Color": "components_structure.inputs.background_color",
    "Text Color": "components_structure.inputs.text_color",
    "Hover Color": "components_structure.inputs.hover_color",
    "Border Radius": "components_structure.inputs.border_radius",
    "API Endpoint": "components_structure.inputs.api_endpoint",
    "HTTP Method": "components_structure.inputs.http_method",
    "Custom Headers (JSON)": "components_structure.inputs.custom_headers_json",
    "Cards Layout Settings":
      "components_structure.inputs.cards_layout_settings",
    "Number of Columns": "components_structure.inputs.number_of_columns",
    "1 Column": "components_structure.inputs.1_column",
    "2 Columns": "components_structure.inputs.2_columns",
    "3 Columns": "components_structure.inputs.3_columns",
    "4 Columns": "components_structure.inputs.4_columns",
    "Gap Between Cards": "components_structure.inputs.gap_between_cards",
    "Responsive Layout": "components_structure.inputs.responsive_layout",
    "Mobile Columns": "components_structure.inputs.mobile_columns",
    "Tablet Columns": "components_structure.inputs.tablet_columns",
    "Desktop Columns": "components_structure.inputs.desktop_columns",
    "Fields Layout Settings":
      "components_structure.inputs.fields_layout_settings",
    "Gap Between Fields": "components_structure.inputs.gap_between_fields",
    "Form Cards": "components_structure.inputs.form_cards",
    "Card ID": "components_structure.inputs.card_id",
    "Card Title": "components_structure.inputs.card_title",
    "Card Description": "components_structure.inputs.card_description",
    "Card Icon": "components_structure.inputs.card_icon",
    "Card Color Theme": "components_structure.inputs.card_color_theme",
    Blue: "components_structure.inputs.blue",
    Green: "components_structure.inputs.green",
    Red: "components_structure.inputs.red",
    Yellow: "components_structure.inputs.yellow",
    Purple: "components_structure.inputs.purple",
    Pink: "components_structure.inputs.pink",
    Indigo: "components_structure.inputs.indigo",
    Teal: "components_structure.inputs.teal",
    Orange: "components_structure.inputs.orange",
    Cyan: "components_structure.inputs.cyan",
    Emerald: "components_structure.inputs.emerald",
    Violet: "components_structure.inputs.violet",
    Fuchsia: "components_structure.inputs.fuchsia",
    Rose: "components_structure.inputs.rose",
    Sky: "components_structure.inputs.sky",
    Lime: "components_structure.inputs.lime",
    Amber: "components_structure.inputs.amber",
    Slate: "components_structure.inputs.slate",
    Gray: "components_structure.inputs.gray",
    Zinc: "components_structure.inputs.zinc",
    Neutral: "components_structure.inputs.neutral",
    Stone: "components_structure.inputs.stone",
    "Custom Colors": "components_structure.inputs.custom_colors",
    "Shadow Color": "components_structure.inputs.shadow_color",
    Collapsible: "components_structure.inputs.collapsible",
    "Show Add Button": "components_structure.inputs.show_add_button",
    "Add Button Text": "components_structure.inputs.add_button_text",
    "Field ID": "components_structure.inputs.field_id",
    "Field Type": "components_structure.inputs.field_type",
    Text: "components_structure.inputs.text",
    Email: "components_structure.inputs.email",
    Password: "components_structure.inputs.password",
    Number: "components_structure.inputs.number",
    Date: "components_structure.inputs.date",
    Select: "components_structure.inputs.select",
    Textarea: "components_structure.inputs.textarea",
    Currency: "components_structure.inputs.currency",
    Radio: "components_structure.inputs.radio",
    "Field Label": "components_structure.inputs.field_label",
    Placeholder: "components_structure.inputs.placeholder",
    Required: "components_structure.inputs.required",
    "Field Description": "components_structure.inputs.field_description",
    "Field Icon": "components_structure.inputs.field_icon",
    "Field Options (for Select/Radio)":
      "components_structure.inputs.field_options",
    "Option Value": "components_structure.inputs.option_value",
    "Option Label": "components_structure.inputs.option_label",
    "Validation Rules": "components_structure.inputs.validation_rules",
    "Minimum Value": "components_structure.inputs.minimum_value",
    "Maximum Value": "components_structure.inputs.maximum_value",
    "Pattern (Regex)": "components_structure.inputs.pattern_regex",
    "Custom Error Message": "components_structure.inputs.custom_error_message",

    // Contact Us Home Page labels
    Background: "components_structure.contactUsHomePage.background",
    "Background Image":
      "components_structure.contactUsHomePage.background_image",
    "Alt Text": "components_structure.contactUsHomePage.alt_text",
    Overlay: "components_structure.contactUsHomePage.overlay",
    Enabled: "components_structure.contactUsHomePage.overlay_enabled",
    "Overlay Color": "components_structure.contactUsHomePage.overlay_color",
    "Header Text": "components_structure.contactUsHomePage.header_text",
    "Form Configuration":
      "components_structure.contactUsHomePage.form_configuration",
    "Submit Button": "components_structure.contactUsHomePage.submit_button",
    "Button Text": "components_structure.contactUsHomePage.button_text",
    "Loading Text": "components_structure.contactUsHomePage.loading_text",
    "Background Color":
      "components_structure.contactUsHomePage.background_color",
    "Hover Color": "components_structure.contactUsHomePage.hover_color",
    "Text Color": "components_structure.contactUsHomePage.text_color",
    "Form Fields": "components_structure.contactUsHomePage.form_fields",
    "Full Name Field": "components_structure.contactUsHomePage.full_name_field",
    "WhatsApp Number Field":
      "components_structure.contactUsHomePage.whatsapp_number_field",
    "Email Field": "components_structure.contactUsHomePage.email_field",
    "Payment Method Field":
      "components_structure.contactUsHomePage.payment_method_field",
    "City Field": "components_structure.contactUsHomePage.city_field",
    "Unit Type Field": "components_structure.contactUsHomePage.unit_type_field",
    "Budget Field": "components_structure.contactUsHomePage.budget_field",
    "Message Field": "components_structure.contactUsHomePage.message_field",
    Label: "components_structure.contactUsHomePage.label",
    Styling: "components_structure.contactUsHomePage.styling",
    "Input Background Color":
      "components_structure.contactUsHomePage.input_background_color",
    "Input Border Color":
      "components_structure.contactUsHomePage.input_border_color",
    "Input Text Color":
      "components_structure.contactUsHomePage.input_text_color",
    "Input Placeholder Color":
      "components_structure.contactUsHomePage.input_placeholder_color",
    "Input Focus Color":
      "components_structure.contactUsHomePage.input_focus_color",
    "Label Color": "components_structure.contactUsHomePage.label_color",
    "Error Color": "components_structure.contactUsHomePage.error_color",
    Layout: "components_structure.contactUsHomePage.layout",
    "Max Width": "components_structure.contactUsHomePage.max_width",
    Padding: "components_structure.contactUsHomePage.padding",
    "Mobile Padding": "components_structure.contactUsHomePage.mobile_padding",
    "Tablet Padding": "components_structure.contactUsHomePage.tablet_padding",
    "Desktop Padding": "components_structure.contactUsHomePage.desktop_padding",
    Gap: "components_structure.contactUsHomePage.gap",
    "Mobile Gap": "components_structure.contactUsHomePage.mobile_gap",
    "Tablet Gap": "components_structure.contactUsHomePage.tablet_gap",
    "Desktop Gap": "components_structure.contactUsHomePage.desktop_gap",
    Options: "components_structure.contactUsHomePage.options",
    "Add Option": "components_structure.contactUsHomePage.add_option",
    Option: "components_structure.contactUsHomePage.option",
    Value: "components_structure.contactUsHomePage.value",
    "Submit Button Text": "components_structure.contactUsHomePage.button_text",

    // Blogs Sections specific labels
    "Blogs Sections 1 - Cards Grid with Paragraphs":
      "components_structure.blogsSections.blogs_sections_1_cards_grid",
    "First Paragraph": "components_structure.blogsSections.first_paragraph",
    "Second Paragraph": "components_structure.blogsSections.second_paragraph",
    "Blog Cards": "components_structure.blogsSections.blog_cards",
    "Add Card": "components_structure.blogsSections.add_card",
    "Card ID": "components_structure.blogsSections.card_id",
    "Read More URL": "components_structure.blogsSections.read_more_url",
    "Paragraph Text Color":
      "components_structure.blogsSections.paragraph_text_color",
    "Read More Link Color":
      "components_structure.blogsSections.read_more_link_color",
    "Read More Hover Color":
      "components_structure.blogsSections.read_more_hover_color",
    "Section Padding": "components_structure.blogsSections.section_padding",
    Gaps: "components_structure.blogsSections.gaps",
    "Paragraphs Gap": "components_structure.blogsSections.paragraphs_gap",
    "Cards Gap": "components_structure.blogsSections.cards_gap",
  };

  const translationKey = labelMappings[label];
  if (translationKey) {
    const translated = t(translationKey);
    return translated;
  }
  return label; // Return original label if no translation found
}

export function translateOptions(
  options: { label: string; value: string }[],
  t: (key: string) => string,
): { label: string; value: string }[] {
  return options.map((option) => ({
    ...option,
    label: translateLabel(option.label, t),
  }));
}

export function translateFieldDefinition(
  field: FieldDefinition,
  t: (key: string) => string,
): FieldDefinition {
  const translatedField = { ...field };

  // Translate label
  if (field.label) {
    translatedField.label = translateLabel(field.label, t);
  }

  // Translate placeholder
  if (field.placeholder) {
    translatedField.placeholder = translateLabel(field.placeholder, t);
  }

  // Translate description
  if (field.description) {
    translatedField.description = translateLabel(field.description, t);
  }

  // Translate addLabel and itemLabel for array fields
  if (field.type === "array" && "addLabel" in field) {
    if (field.addLabel) {
      (translatedField as any).addLabel = translateLabel(field.addLabel, t);
    }
    if (field.itemLabel) {
      (translatedField as any).itemLabel = translateLabel(field.itemLabel, t);
    }
  }

  // Translate options for select fields
  if (field.type === "select" && field.options) {
    translatedField.options = translateOptions(field.options, t);
  }

  // Recursively translate nested fields for object and array types
  if (field.type === "object" && "fields" in field && field.fields) {
    (translatedField as any).fields = field.fields.map((nestedField: any) =>
      translateFieldDefinition(nestedField, t),
    );
  }

  if (field.type === "array" && "of" in field && field.of) {
    (translatedField as any).of = field.of.map((nestedField: any) =>
      translateFieldDefinition(nestedField, t),
    );
  }

  return translatedField;
}

export function translateVariantDefinition(
  variant: VariantDefinition,
  t: (key: string) => string,
): VariantDefinition {
  const translatedVariant = { ...variant };

  // Translate name and description
  if (variant.name) {
    translatedVariant.name = translateLabel(variant.name, t);
  }
  if (variant.description) {
    translatedVariant.description = translateLabel(variant.description, t);
  }

  // Translate fields
  if (variant.fields) {
    translatedVariant.fields = variant.fields.map((field) =>
      translateFieldDefinition(field, t),
    );
  }

  // Translate simpleFields
  if (variant.simpleFields) {
    translatedVariant.simpleFields = variant.simpleFields.map((field) =>
      translateFieldDefinition(field, t),
    );
  }

  return translatedVariant;
}

export function translateComponentStructure(
  structure: ComponentStructure,
  t: (key: string) => string,
): ComponentStructure {
  const translatedStructure = { ...structure };

  // Translate name
  if (structure.name) {
    translatedStructure.name = translateLabel(structure.name, t);
  }

  // Translate variants
  if (structure.variants) {
    translatedStructure.variants = structure.variants.map((variant) =>
      translateVariantDefinition(variant, t),
    );
  }

  return translatedStructure;
}
