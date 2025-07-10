import type { CrudField } from "@/components/CrudManager";

export const userFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: false },
  { name: "profileImage", label: "Profile Image", type: "image", required: false },
  { name: "role", label: "Role", type: "text", required: false },
  { name: "createdAt", label: "Created At", type: "text", required: false, readOnly: true },
]; 