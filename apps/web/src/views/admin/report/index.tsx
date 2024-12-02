"use client";

import { useCallback, useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, } from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import axiosInstance from "@/utils/axios";

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

interface IReport {
  date: Date;
  transactionCount: number;
}

export default function ReportView() {
  const [filterType, setFilterType] = useState("date");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [reportData, setReportData] = useState<IReport[]>([]);

  const fetchData = async () => {
    console.log(filterType);
    try {
      const params =
        filterType === "date"
          ? { startDate: startDate, endDate: endDate }
          : filterType === "month"
          ? { startMonth: startMonth, endMonth: endMonth }
          : { startYear: startYear, endYear: endYear };

      console.log(params);
      const { data } = await axiosInstance.get("/transactions", {params});
      if (data.data && data.data.length > 0) {
        setReportData(data.data);
        // console.log(data.data);
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setReportData([]);
    }
  }

  const chartData = {
    labels: reportData.length > 0 ? reportData.map((item) => format(new Date(item.date), "yyyy-MM-dd")) : [],
    datasets: [
      {
        label: "Total Transaction",
        data: reportData.length > 0 ? reportData.map((item) => item.transactionCount) : [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: "Y-axis Lable",
        },
        display: true,
        min: 0,
      },
      x: {
        title: {
          display: true,
          text: "x-axis Lable",
        },
        display: true,
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Report Viewer</h1>

      {/* Filter Section */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-2">Filter Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="date">Date Range</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          {filterType === "date" && (
            <>
              <div>
                <label className="block font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
            </>
          )}

          {filterType === "month" && (
            <>
            <div>
              <label className="block font-medium mb-2">Month (YYYY-MM)</label>
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Month (YYYY-MM)</label>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            </>
          )}

          {filterType === "year" && (
            <>
            <div>
              <label className="block font-medium mb-2">Year</label>
              <input
                type="number"
                placeholder="Year"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Year</label>
              <input
                type="number"
                placeholder="Year"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            </>
          )}
        </div>
        <button
          onClick={fetchData}
          className="mt-4 bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600"
        >
          Fetch Data
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Report Chart</h2>
        {reportData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p className="text-gray-500 text-center">No data available for the selected filter.</p>
        )}
      </div>
    </div>
  );
}
