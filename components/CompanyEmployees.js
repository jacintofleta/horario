import { CalendarIcon, DocumentDownloadIcon } from "@heroicons/react/outline";
import { CSVLink } from "react-csv";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import DateRangePickerModal from "../components/DateRangePickerModal";

import { useState, useEffect } from "react";

export default function CompanyEmployees({ employees, jobs }) {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const indigoColor = "#4F46E5";

  const [jobsPerDate, setJobsPerDate] = useState(jobs);

  const [dateRange, setDateRange] = useState({
    startDate: firstDay,
    endDate: date,
    color: indigoColor,
  });

  useEffect(() => {
    let newJobsPerDate = jobs.filter((job) =>
      dayjs(new Date(job.date)).isBetween(
        dateRange.startDate,
        dateRange.endDate,
        "day",
        "[]"
      )
    );

    setJobsPerDate(newJobsPerDate);
  }, [dateRange]);

  const [openModal, setOpenModal] = useState(false);

  let getNumberOfHours = (employeeEmail) => {
    let employeeJobs = jobsPerDate.filter((job) => job.email === employeeEmail);

    if (employeeJobs.length === 0) {
      return 0;
    }

    //If employee started the dateRange.startDate working
    if (employeeJobs[0].mode === "stop") {
      employeeJobs.unshift({
        _id: employeeJobs[0] + "start",
        email: employeeEmail,
        mode: "start",
        date: dateRange.startDate,
      });
    }

    //If employee finished the range day working
    if (employeeJobs[employeeJobs.length - 1].mode === "start") {
      employeeJobs.push({
        _id: employeeJobs[employeeJobs.length - 1] + "stop",
        email: employeeEmail,
        mode: "stop",
        date: dayjs(dateRange.endDate).isBetween(
          new Date(),
          new Date(),
          "day",
          "[]"
        )
          ? new Date()
          : dayjs(dateRange.endDate).add(1, "day"),
      });
    }

    let time = 0;

    for (let i = 0; i < employeeJobs.length; i += 2) {
      const date1 = dayjs(employeeJobs[i + 1].date);
      const date2 = dayjs(employeeJobs[i].date);
      time += date1.diff(date2);
    }

    return (time / 3600000).toFixed(3);
  };

  let getDataToCSV = (employeeEmail) => {
    let employeeJobs = jobsPerDate.filter((job) => job.email === employeeEmail);

    if (employeeJobs.length === 0) {
      return false;
    }

    //If employee started the dateRange.startDate working
    if (employeeJobs[0].mode === "stop") {
      employeeJobs.unshift({
        _id: employeeJobs[0] + "start",
        email: employeeEmail,
        mode: "start",
        date: dateRange.startDate,
      });
    }

    //If employee finished the range day working
    if (employeeJobs[employeeJobs.length - 1].mode === "start") {
      employeeJobs.push({
        _id: employeeJobs[employeeJobs.length - 1] + "stop",
        email: employeeEmail,
        mode: "stop",
        date: dayjs(dateRange.endDate).isBetween(
          new Date(),
          new Date(),
          "day",
          "[]"
        )
          ? new Date()
          : dayjs(dateRange.endDate).add(1, "day"),
      });
    }

    let data = [];

    for (let i = 0; i < employeeJobs.length; i += 2) {
      const date1 = dayjs(employeeJobs[i + 1].date);
      const date2 = dayjs(employeeJobs[i].date);
      let time = (date1.diff(date2) / 3600000).toFixed(3);
      data.push({
        comienzo: employeeJobs[i].date,
        fin: employeeJobs[i + 1].date,
        tiempo: time,
      });
    }

    let headers = [
      { label: "Comienzo", key: "comienzo" },
      { label: "Fin", key: "fin" },
      { label: "Tiempo en horas", key: "tiempo" },
    ];

    return {
      data,
      headers,
    };
  };

  return (
    <>
      <DateRangePickerModal
        dateRange={dateRange}
        setDateRange={setDateRange}
        openModal={openModal}
        setOpenModal={setOpenModal}
        indigoColor={indigoColor}
      />
      <div className="flex items-center justify-between space-x-6 mx-4 lg:mx-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-base  leading-7 text-gray-800 sm:text-lg  sm:truncate">
            Desde{" "}
            <span className="font-bold">
              {dayjs(dateRange.startDate).format("DD/MMM/YYYY")}
            </span>{" "}
            hasta{" "}
            <span className="font-bold">
              {dayjs(dateRange.endDate).format("DD/MMM/YYYY")}
            </span>
          </h2>
        </div>
        <div className=" flex md:mt-0">
          <button
            onClick={() =>
              openModal ? setOpenModal(false) : setOpenModal(true)
            }
            type="button"
            className="items-center align-middle	 p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CalendarIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trabajador
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tiempo
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((person, personIdx) => {
                    let time = getNumberOfHours(person.email);
                    let jobsDataCsv = getDataToCSV(person.email);

                    return (
                      <tr
                        key={person.email}
                        className={
                          personIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {person.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {time}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {jobsDataCsv ? (
                            <CSVLink
                              data={jobsDataCsv.data}
                              headers={jobsDataCsv.headers}
                              filename={`${person.email}.csv`}
                              className="btn btn-primary text-indigo-600 hover:text-indigo-900"
                              target="_blank"
                            >
                              <DocumentDownloadIcon className="h-6" />
                            </CSVLink>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
