"use client";

import { getTrips, deleteTrip, updateTrip } from "@/apiServices/trip/api.tripServices";
import { Trip } from "@/types/trip/tripTypes";
import { CrudTable, TableColumn } from "@/components/shared/CrudTable";
import { truncateText, stripHtml } from "@/lib/common";

// Define columns for the trip table
const columns: TableColumn<Trip>[] = [
  {
    key: "title",
    header: "Title",
    render: (trip) => <span className="font-medium">{trip.title}</span>,
  },
  {
    key: "overview",
    header: "Overview",
    className: "max-w-xs",
    render: (trip) => truncateText(stripHtml(trip.overview), 50),
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

const TripLayout = () => {
  return (
    <CrudTable<Trip>
      queryKey="trips"
      fetchFn={getTrips}
      deleteFn={deleteTrip}
      updateFn={updateTrip}
      title="Trips Management"
      description="Manage Trips and their status here."
      itemName="Trip"
      createPath="/dashboard/trip/create"
      editPath="/dashboard/trip/edit"
      columns={columns}
      showPublishAction={true}
    />
  );
};

export default TripLayout;