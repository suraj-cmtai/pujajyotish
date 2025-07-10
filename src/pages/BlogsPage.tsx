import { CrudManager } from "@/components/CrudManager";
import { blogFields } from "@/config/blogFields";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  selectBlogs,
  selectBlogLoading,
  selectBlogError
} from "@/store/blogSlice";
import { useEffect } from "react";
import { toast } from "sonner";

export default function BlogsPage() {
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlogs);
  const isLoading = useSelector(selectBlogLoading);
  const error = useSelector(selectBlogError);

  useEffect(() => {
    dispatch(fetchBlogs() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
    }
  }, [error]);

  return (
    <CrudManager
      resourceName="Blog"
      fields={blogFields}
      data={blogs}
      loading={isLoading}
      onCreate={form => {
        const { createdAt, ...rest } = form;
        return dispatch(createBlog(rest) as any).then(() => dispatch(fetchBlogs() as any));
      }}
      onEdit={(id, form) => {
        const { createdAt, ...rest } = form;
        return dispatch(updateBlog({ id, form: rest }) as any).then(() => dispatch(fetchBlogs() as any));
      }}
      onDelete={id => dispatch(deleteBlog(id) as any)}
      formInitialState={{
        title: "",
        content: "",
        author: "",
        blogImage: null,
        videoUrl: "",
        type: "image",
        createdAt: "",
      }}
      formValidation={form => {
        if (!form.title) return "Title is required";
        if (!form.content) return "Content is required";
        if (!form.author) return "Author is required";
        return null;
      }}
    />
  );
} 