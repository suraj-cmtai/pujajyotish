import type { CrudField } from "@/components/CrudManager";

export const homeFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
]; 