import type { CrudField } from "@/components/CrudManager";

export const leadFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "message", label: "Message", type: "textarea", required: false },
  // 'createdOn' is an ISO string, so use 'text' type for display only
  { name: "createdOn", label: "Created On", type: "text", required: false, readOnly: true },
]; 