import type { CrudField } from "@/components/CrudManager";
 
export const dailyRoutineFields: CrudField[] = [
  { name: "date", label: "Date", type: "date", required: true },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  {
    name: "rashis",
    label: "Rashis",
    type: "array",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "prediction", label: "Prediction", type: "textarea", required: true },
      { name: "image", label: "Image", type: "image", required: false },
    ],
  },
  {
    name: "panchang",
    label: "Panchang",
    type: "object",
    fields: [
      { name: "nakshatra", label: "Nakshatra", type: "text" },
      { name: "moonset", label: "Moonset", type: "text" },
      { name: "karana", label: "Karana", type: "text" },
      { name: "tithi", label: "Tithi", type: "text" },
      { name: "moonrise", label: "Moonrise", type: "text" },
      { name: "sunset", label: "Sunset", type: "text" },
      { name: "sunrise", label: "Sunrise", type: "text" },
      { name: "vaara", label: "Vaara", type: "text" },
      { name: "image", label: "Image", type: "image" },
      { name: "yoga", label: "Yoga", type: "text" },
      // location can be another object if needed
    ],
  },
]; 