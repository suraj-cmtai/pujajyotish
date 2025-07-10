import { CrudManager } from "@/components/CrudManager";
import { leadFields } from "@/config/leadFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  selectLeads,
  selectLeadLoading,
  selectLeadError
} from "@/store/leadSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LeadsPage() {
  const dispatch = useDispatch();
  const leads = useSelector(selectLeads);
  const isLoading = useSelector(selectLeadLoading);
  const error = useSelector(selectLeadError);

  useEffect(() => {
    dispatch(fetchLeads() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <CrudManager
      resourceName="Lead"
      fields={leadFields}
      data={leads}
      loading={isLoading}
      onCreate={form => dispatch(createLead(form) as any)}
      onEdit={(id, form) => dispatch(updateLead({ id, form }) as any)}
      onDelete={id => dispatch(deleteLead(id) as any)}
      formInitialState={{
        name: "",
        email: "",
        phone: "",
        message: "",
        createdOn: "",
      }}
      formValidation={form => {
        if (!form.name) return "Name is required";
        if (!form.email) return "Email is required";
        if (!form.phone) return "Phone is required";
        return null;
      }}
    />
  );
} 