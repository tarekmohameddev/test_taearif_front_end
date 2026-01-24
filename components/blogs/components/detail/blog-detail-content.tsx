/**
 * Blog Detail Content Component
 * 
 * @description عرض المحتوى HTML
 * 
 * @dependencies
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @props
 * - content: string (محتوى HTML)
 * 
 * @related
 * - types/blog.types.ts (BlogPost)
 */

interface BlogDetailContentProps {
  content: string;
}

export function BlogDetailContent({ content }: BlogDetailContentProps) {
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
