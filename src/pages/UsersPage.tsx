import { CrudManager } from "@/components/CrudManager";
import { userFields } from "@/config/userFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  selectUsers,
  selectUserLoading,
  selectUserError
} from "@/store/userSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <CrudManager
      resourceName="User"
      fields={userFields}
      data={users}
      loading={isLoading}
      onCreate={form => dispatch(createUser(form) as any)}
      onEdit={(id, form) => dispatch(updateUser({ id, form }) as any)}
      onDelete={id => dispatch(deleteUser(id) as any)}
      formInitialState={{
        name: "",
        email: "",
        phone: "",
        profileImage: "",
        role: "",
        createdAt: "",
      }}
      formValidation={form => {
        if (!form.name) return "Name is required";
        if (!form.email) return "Email is required";
        return null;
      }}
    />
  );
} 