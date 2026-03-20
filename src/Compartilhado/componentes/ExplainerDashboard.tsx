import { useState } from "react";
import { professors } from "../servicos/explainerAvailabilityService";
import AvailabilityCalendar from "./AvailabilityCalendar";

export default function ExplainerDashboard() {
  const [selectedProf, setSelectedProf] = useState(professors[0]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b px-8 py-4">
        <h1 className="text-xl font-semibold">
          Scheduling System
        </h1>
      </div>

      <div className="flex">

        {/* LEFT PANEL */}
        <div className="w-72 bg-white border-r p-6">

          <h2 className="text-sm text-gray-500 mb-4">
            Professors
          </h2>

          <div className="space-y-2">
            {professors.map((prof) => (
              <div
                key={prof.id}
                onClick={() => setSelectedProf(prof)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  ${
                    selectedProf.id === prof.id
                      ? "bg-blue-50 border border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
              >
                <img
                  src={prof.avatar}
                  alt={prof.name}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p className="text-sm font-medium">{prof.name}</p>
                  <p className="text-xs text-gray-500">
                    {prof.subject}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* MAIN */}
        <div className="flex-1 p-8">

          <div className="mb-6 flex items-center gap-4">
            <img
              src={selectedProf.avatar}
              alt={selectedProf.name}
              className="w-14 h-14 rounded-full"
            />

            <div>
              <h2 className="text-lg font-semibold">
                {selectedProf.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {selectedProf.subject}
              </p>
            </div>
          </div>

          <AvailabilityCalendar teacherId={selectedProf.id} />

        </div>

      </div>

    </div>
  );
}