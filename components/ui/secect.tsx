"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

const ReactSelect = ({
  url = "",
  isMulti = false,
  form,
  name,
}: {
  url: string;
  isMulti: boolean;
  form: any;
  name: string;
}) => {
  const [data, setData] = useState<
    { label: string; value: number | string | null }[]
  >([]);
  useEffect(() => {
    if (name === "state" && url === "") {
      setData([
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ]);
    }
  }, [name, url]);

  // Fetch data from the API for other fields
  const { isLoading, data: fetchData } = useQuery({
    queryKey: ["fetchData", url],
    queryFn: async () => {
      if (name === "state" || !url) {
        return [];
      }
      const fullUrl = `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}${url}`;
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: true,
        }),
        cache: "no-cache",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.data.map((item: any) => ({
            label: item?.name || item?.first_name,
            value: item?._id || item?.id || null,
          }));
        }
      }
      return [];
    },
    enabled: url !== "" && name !== "state",
  });
  useEffect(() => {
    if (fetchData) {
      setData(fetchData);
    }
  }, [fetchData]);
  return (
    <div>
      <Controller
        name={name}
        control={form.control}
        defaultValue={
          form.getValues(name) || (isMulti ? [] : { value: null, label: "" })
        }
        render={({ field }) => (
          <Select
            {...field}
            options={data}
            isMulti={isMulti}
            onChange={(selectedOption) => {
              const selectedValue = isMulti
                ? Array.isArray(selectedOption)
                  ? selectedOption.map((option: any) => option.value)
                  : []
                : selectedOption &&
                  !Array.isArray(selectedOption) &&
                  typeof selectedOption === "object"
                  ? (selectedOption as { label: string; value: number | null })
                    .value
                  : null;
              form.setValue(name, selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            isLoading={isLoading}
            isDisabled={isLoading}
            value={
              isMulti
                ? data.filter((option) =>
                  Array.isArray(field.value)
                    ? field.value.some(
                      (item: any) =>
                        item === option.value ||
                        item?._id === option.value ||
                        item?.id === option.value ||
                        item?.value === option.value
                    )
                    : false
                )
                : data.find((option) => option.value === field.value) // For single select, find the selected option
            }
          />
        )}
      />
    </div>
  );
};

export default ReactSelect;
