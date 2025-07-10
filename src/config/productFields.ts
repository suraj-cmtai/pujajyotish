import type { CrudField } from "@/components/CrudManager";

export const productFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: false },
  { name: "price", label: "Price", type: "number", required: true },
  { name: "image", label: "Image", type: "image", required: false },
  { name: "category", label: "Category", type: "text", required: false },
  { name: "stock", label: "Stock", type: "number", required: false },
  { name: "createdAt", label: "Created At", type: "text", required: false, readOnly: true },
]; 