"use client";
import { getBlogs, deleteBlog, updateBlog } from "@/apiServices/blog/api.blogServices";
import { RootBlogsData } from "@/types/blogTypes/blogTypes";
import { CrudTable, TableColumn } from "@/components/shared/CrudTable";
import { truncateText, stripHtml } from "@/lib/common";
// Define columns for the blog table
const columns: TableColumn<RootBlogsData>[] = [
  {
    key: "title",
    header: "Title",
    render: (blog) => <span className="font-medium">{blog.title}</span>,
  },
  {
    key: "description",
    header: "Description",
    className: "max-w-xs",
    render: (blog) => truncateText(stripHtml(blog.description), 50),
  },
  {
    key: "status",
    header: "Status",
  },
  {
    key: "createdAt",
    header: "Created At",
  },
];

const BlogLayout = () => {
  return (
    <CrudTable<RootBlogsData>
      queryKey="blogs"
      fetchFn={getBlogs}
      deleteFn={deleteBlog}
      updateFn={updateBlog}
      title="Blogs Management"
      description="Manage Blogs and their status here."
      itemName="Blog"
      createPath="/dashboard/blog/create"
      editPath="/dashboard/blog/edit"
      columns={columns}
      showPublishAction={true}
    />
  );
};

export default BlogLayout;