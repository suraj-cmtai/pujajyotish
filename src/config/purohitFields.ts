import type { CrudField } from "@/components/CrudManager";

export const purohitFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "profileImage", label: "Profile Image", type: "image" },
  { name: "yogyagtaPramanPatra", label: "Yogyagta Praman Patra", type: "image" },
  { name: "idProof", label: "ID Proof", type: "image" },
  { name: "status", label: "Status", type: "select", options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
  ]},
]; 