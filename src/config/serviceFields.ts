import type { CrudField } from "@/components/CrudManager";

export const serviceFields: CrudField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "status", label: "Status", type: "select", options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ] },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "image", label: "Image", type: "image", readOnly: true },
  { name: "bookingFee", label: "Booking Fee", type: "number" },
  {
    name: "typeofpuja",
    label: "Types of Puja",
    type: "array",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "price", label: "Price", type: "text" },
    ],
  },
  {
    name: "typeofAstrology",
    label: "Types of Astrology",
    type: "array",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "price", label: "Price", type: "number" },
    ],
  },
  {
    name: "samgris",
    label: "Samgris",
    type: "array",
    fields: [
      { name: "title", label: "Title", type: "text" },
    ],
  },
]; 