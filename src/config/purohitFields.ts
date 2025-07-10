import type { CrudField } from "@/components/CrudManager";

export const purohitFields: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "qualification", label: "Qualification", type: "text" },
  { name: "wayToReach", label: "Way To Reach", type: "text" },
  { name: "presentAddress", label: "Present Address", type: "text" },
  { name: "permanentAddress", label: "Permanent Address", type: "text" },
  { name: "phoneNo", label: "Phone No", type: "text" },
  { name: "experience", label: "Experience", type: "text" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "gender", label: "Gender", type: "text" },
  { name: "languages", label: "Languages", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "profileImage", label: "Profile Image", type: "image" },
  { name: "status", label: "Status", type: "select", options: [
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]},
  { name: "idType", label: "ID Type", type: "text" },
  { name: "idProof", label: "ID Proof", type: "image" },
  { name: "yogyagtaPramanPatra", label: "Yogyagta Praman Patra", type: "image" },
  { name: "whatsappNo", label: "WhatsApp No", type: "text" },
]; 