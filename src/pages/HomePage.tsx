import { CrudManager } from "@/components/CrudManager";
import { homeFields } from "@/config/homeFields";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomes, updateHome, selectHomes, selectHomeLoading, selectHomeError } from "@/store/homeSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const dispatch = useDispatch();
  const homes = useSelector(selectHomes);
  const isLoading = useSelector(selectHomeLoading);
  const error = useSelector(selectHomeError);

  useEffect(() => {
    dispatch(fetchHomes() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  // Only allow editing the first home record (or create if none)
  const home = homes[0] || { name: "", title: "", description: "" };

  return (
    <CrudManager
      resourceName="Home"
      fields={homeFields}
      data={home.id ? [home] : []}
      loading={isLoading}
      onCreate={() => Promise.resolve()} // No create, only update
      onEdit={(id, form) => dispatch(updateHome({ id, form }) as any).then(() => dispatch(fetchHomes() as any))}
      onDelete={() => Promise.resolve()} // No delete
      formInitialState={home}
      formValidation={form => {
        if (!form.name) return "Name is required";
        if (!form.title) return "Title is required";
        if (!form.description) return "Description is required";
        return null;
      }}
    />
  );
} 