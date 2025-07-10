import { CrudManager } from "@/components/CrudManager";
import { purohitFields } from "@/config/purohitFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurohits,
  createPurohit,
  updatePurohit,
  deletePurohit,
  selectPurohits,
  selectPurohitLoading,
  selectPurohitError
} from "@/store/purohitSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PurohitsPage() {
  const dispatch = useDispatch();
  const purohits = useSelector(selectPurohits);
  const isLoading = useSelector(selectPurohitLoading);
  const error = useSelector(selectPurohitError);

  useEffect(() => {
    dispatch(fetchPurohits() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <CrudManager
      resourceName="Purohit"
      fields={purohitFields}
      data={purohits}
      loading={isLoading}
      onCreate={form => dispatch(createPurohit(form) as any)}
      onEdit={(id, form) => dispatch(updatePurohit({ id, form }) as any)}
      onDelete={id => dispatch(deletePurohit(id) as any)}
      formInitialState={{
        name: "",
        email: "",
        phone: "",
        address: "",
        profileImage: null,
        yogyagtaPramanPatra: null,
        idProof: null,
        status: "active",
      }}
      formValidation={form => {
        if (!form.name) return "Name is required";
        return null;
      }}
    />
  );
} 