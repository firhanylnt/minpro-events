"use client";

import IEvents from "@/app/types/event.type";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventViews() {
  const [data, setData] = useState<IEvents[]>([]); // Stores the event data
  const [loading, setLoading] = useState(false); // To handle loading state
  const [page, setPage] = useState(1); // Current page
  const [pageSize, setPageSize] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/events", {
        params: { page, pageSize },
      });
      setData(data.data);
      setTotalPages(Math.ceil(data.data.length / pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>

      {/* Table Section */}
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Slug</th>
            <th className="border border-gray-300 px-4 py-2">Start Date</th>
            <th className="border border-gray-300 px-4 py-2">End Date</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={8}
              >
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((event) => (
              <tr key={event.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{event.name}</td>
                <td className="border border-gray-300 px-4 py-2">{event.slug}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(event.start_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(event.end_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{event.status === 1 ? 'Publish' : event.status === 2 ? 'Postponed' : event.status === 3 ? 'Completed' : 'Cancel'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {event.eventCategory?.name || "N/A"} {/* Assuming the eventCategory object has a 'name' */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {event.cities?.city_name || "N/A"} {/* Assuming cities object has a 'city_name' */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link href="#">View</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="border border-gray-300 px-4 py-2 text-center"
                colSpan={8}
              >
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
