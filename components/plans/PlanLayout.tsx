"use client";

import { getPlans, deletePlan, updatePlan } from "@/apiServices/plans/api.plansServices";
import { RootPlanData } from "@/types/planTypes/planTypes";
import { CrudTable, TableColumn } from "@/components/shared/CrudTable";
import { Badge } from "@/components/ui/badge";

// Format price with currency
const formatPrice = (price: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
};

// Define columns for the plans table
const columns: TableColumn<RootPlanData>[] = [
  {
    key: "name",
    header: "Name",
    render: (plan) => <span className="font-medium">{plan.name}</span>,
  },
  {
    key: "type",
    header: "Type",
    render: (plan) => (
      <Badge
        variant="secondary"
        className={
          plan.type === "lifetime"
            ? "bg-purple-500/10 text-purple-500"
            : plan.type === "yearly"
            ? "bg-blue-500/10 text-blue-500"
            : "bg-gray-500/10 text-gray-500"
        }
      >
        {plan.type}
      </Badge>
    ),
  },
  {
    key: "price",
    header: "Price",
    render: (plan) => (
      <span className="font-medium">{formatPrice(plan.price, plan.currency)}</span>
    ),
  },
  {
    key: "discountPercentage",
    header: "Discount",
    render: (plan) =>
      plan.discountPercentage ? (
        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
          {plan.discountPercentage}% OFF
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
  },
  {
    key: "isActive",
    header: "Status",
    render: (plan) => (
      <Badge
        variant="secondary"
        className={
          plan.isActive
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-amber-500/10 text-amber-500"
        }
      >
        {plan.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Created At",
  },
];

const PlanLayout = () => {
  return (
    <CrudTable<RootPlanData>
      queryKey="plans"
      fetchFn={getPlans}
      deleteFn={deletePlan}
      updateFn={updatePlan}
      title="Plans Management"
      description="Manage pricing plans and their features here."
      itemName="Plan"
      createPath="/dashboard/plans/create"
      editPath="/dashboard/plans/edit"
      columns={columns}
      showPublishAction={false}
    />
  );
};

export default PlanLayout;