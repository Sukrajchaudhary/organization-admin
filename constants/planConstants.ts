import { PlanFormData } from "@/formschema/planSchema";

export const DEFAULT_PLAN_VALUES: PlanFormData = {
  name: "",
  type: "monthly",
  price: 0,
  currency: "USD",
  description: "",
  options: [],
  offerStartTime: "",
  offerEndTime: "",
  startFrom: "",
  startTo: "",
  discountPercentage: 0,
  isActive: true,
};

export const PLAN_TYPE_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime" },
] as const;

export const PLAN_STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
] as const;