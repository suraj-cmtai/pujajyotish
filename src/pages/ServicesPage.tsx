import { CrudManager } from "@/components/CrudManager";
import { serviceFields } from "@/config/serviceFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  selectServices,
  selectServiceLoading,
  selectServiceError
} from "@/store/serviceSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const isLoading = useSelector(selectServiceLoading);
  const error = useSelector(selectServiceError);

  useEffect(() => {
    dispatch(fetchServices() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <CrudManager
      resourceName="Service"
      fields={serviceFields}
      data={services}
      loading={isLoading}
      onCreate={form => dispatch(createService(form) as any)}
      onEdit={(id, form) => dispatch(updateService({ id, form }) as any)}
      onDelete={id => dispatch(deleteService(id) as any)}
      formInitialState={{
        name: "",
        description: "",
        price: 0,
        status: "active",
      }}
      formValidation={form => {
        if (!form.name) return "Name is required";
        if (!form.description) return "Description is required";
        return null;
      }}
    />
  );
} 