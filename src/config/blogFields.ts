import type { CrudField } from "@/components/CrudManager";

export const blogFields: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "content", label: "Content", type: "textarea", required: true },
  { name: "author", label: "Author", type: "text", required: true },
  { name: "type", label: "Type", type: "select", options: [
    { label: "Image", value: "image" },
    { label: "Video", value: "video" }
  ]},
  { name: "blogImage", label: "Image", type: "image" },
  { name: "videoUrl", label: "Video", type: "text" },
  { name: "createdAt", label: "Created At", type: "date", readOnly: true }
]; 