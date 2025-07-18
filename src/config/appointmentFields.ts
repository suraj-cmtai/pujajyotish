import type { CrudField } from "@/components/CrudManager";

export const appointmentFields: CrudField[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phoneNo", label: "Phone No", type: "text" },
  { name: "whatsappNo", label: "WhatsApp No", type: "text" },
  { name: "preferredDate", label: "Preferred Date", type: "date" },
  { name: "preferredTime", label: "Preferred Time", type: "text" },
  { name: "message", label: "Message", type: "textarea" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "birthPlace", label: "Birth Place", type: "text" },
  { name: "birthDate", label: "Birth Date", type: "date" },
  { name: "birthTime", label: "Birth Time", type: "text" },
  { name: "dob", label: "DOB", type: "date" },
  { name: "gender", label: "Gender", type: "text" },
  { name: "wayToReach", label: "Way To Reach", type: "text" },
  { name: "timeOfDay", label: "Time Of Day", type: "text" },
  { name: "language", label: "Language", type: "text" },
  { name: "astrologySelect", label: "Astrology Select", type: "text" },
  { name: "pujaSelect", label: "Puja Select", type: "text" },
  { name: "rightHand", label: "Right Hand", type: "image" },
  { name: "leftHand", label: "Left Hand", type: "image" },
  { name: "paymentStatus", label: "Payment Status", type: "text" },
  { name: "paymentOrderId", label: "Payment Order ID", type: "text" },
  { name: "status", label: "Status", type: "select", options: [
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ] },
]; 