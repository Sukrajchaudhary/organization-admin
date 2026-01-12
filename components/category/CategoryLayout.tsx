"use client";
import { getCategories, deleteCategory, updateCategory } from "@/apiServices/category/api.categoryServices";
import { RootCategoryData } from "@/types/categoryTypes/categoryTypes";
import { CrudTable, TableColumn } from "@/components/shared/CrudTable";
import { truncateText } from "@/lib/common";
import { Badge } from "@/components/ui/badge";

// Define columns for the category table
const columns: TableColumn<RootCategoryData>[] = [
  {
    key: "name",
    header: "Name",
    render: (category) => <span className="font-medium">{category.name}</span>,
  },
  {
    key: "slug",
    header: "Slug",
    render: (category) => <span className="text-muted-foreground">{category.slug}</span>,
  },
  {
    key: "description",
    header: "Description",
    className: "max-w-xs",
    render: (category) => truncateText(category.description, 50),
  },
  {
    key: "isActive",
    header: "Status",
    render: (category) => (
      <Badge
        variant="secondary"
        className={category.isActive
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-amber-500/10 text-amber-500"
        }
      >
        {category.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "sortOrder",
    header: "Sort Order",
    render: (category) => <span className="text-muted-foreground">{category.sortOrder}</span>,
  },
  {
    key: "createdAt",
    header: "Created At",
  },
];

const CategoryLayout = () => {
  return (
    <CrudTable<RootCategoryData>
      queryKey="categories"
      fetchFn={getCategories}
      deleteFn={deleteCategory}
      updateFn={updateCategory}
      title="Categories Management"
      description="Manage categories and their status here."
      itemName="Category"
      createPath="/dashboard/category/create"
      editPath="/dashboard/category/edit"
      columns={columns}
      showPublishAction={false}
    />
  );
};

export default CategoryLayout;