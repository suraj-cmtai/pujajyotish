import { CrudManager } from "@/components/CrudManager";
import { productFields } from "@/config/productFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  selectProducts,
  selectProductLoading,
  selectProductError
} from "@/store/productSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <CrudManager
      resourceName="Product"
      fields={productFields}
      data={products}
      loading={isLoading}
      onCreate={form => dispatch(createProduct(form) as any)}
      onEdit={(id, form) => dispatch(updateProduct({ id, form }) as any)}
      onDelete={id => dispatch(deleteProduct(id) as any)}
      formInitialState={{
        name: "",
        description: "",
        price: 0,
        image: "",
        category: "",
        stock: 0,
        createdAt: "",
      }}
      formValidation={form => {
        if (!form.name) return "Name is required";
        if (!form.price) return "Price is required";
        return null;
      }}
    />
  );
} 