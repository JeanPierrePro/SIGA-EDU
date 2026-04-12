import { useState } from "react";

// 🔹 Generate week
const getWeekDays = (offset: number) => {
  const today = new Date();
  const start = new Date(today);

  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff + offset * 7);

  const days = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().split("T")[0],
      short:
        d.getDate() +
        " " +
        d.toLocaleString("en-US", { month: "short" }),
    });
  }

  return days;
};

const times = [
  "08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00"
];

type Slot = {
  teacherId: number;
  date: string;
  time: string;
  student: string;
};

export default function AvailabilityCalendar({ teacherId }: { teacherId: number }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [studentName, setStudentName] = useState("");

  const weekDays = getWeekDays(weekOffset);

  const getSlot = (date: string, time: string) =>
    slots.find(
      s =>
        s.teacherId === teacherId &&
        s.date === date &&
        s.time === time
    );

  const handleBookClick = (date: string, time: string) => {
    if (getSlot(date, time)) return;
    setSelectedSlot({ date, time });
  };

  const bookSlot = () => {
    if (!selectedSlot || !studentName) return;

    setSlots(prev => [
      ...prev,
      {
        teacherId,
        date: selectedSlot.date,
        time: selectedSlot.time,
        student: studentName,
      },
    ]);

    setSelectedSlot(null);
    setStudentName("");
  };

  const cancelBooking = (date: string, time: string) => {
    setSlots(prev =>
      prev.filter(
        s =>
          !(
            s.teacherId === teacherId &&
            s.date === date &&
            s.time === time
          )
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold">
          Weekly Availability
        </h2>

        <div className="flex gap-2">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-3 py-1 bg-gray-100 rounded">←</button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1 bg-gray-100 rounded">Today</button>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-3 py-1 bg-gray-100 rounded">→</button>
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-6 gap-3">

        {/* TIME COLUMN */}
        <div>
          <div></div>
          {times.map(time => (
            <div key={time} className="h-16 text-xs text-gray-400 flex items-center">
              {time}
            </div>
          ))}
        </div>

        {/* DAYS */}
        {weekDays.map(day => (
          <div key={day.date}>

            <div className="text-center mb-2">
              <p className="text-sm font-medium">{day.label}</p>
              <p className="text-xs text-gray-400">{day.short}</p>
            </div>

            {times.map(time => {
              const slot = getSlot(day.date, time);

              return (
                <div
                  key={time}
                  className={`h-16 rounded-xl p-2 mb-2 flex flex-col justify-between
                    ${
                      slot
                        ? "bg-red-100 border border-red-300"
                        : "bg-gray-50 hover:bg-blue-50"
                    }`}
                >
                  {slot ? (
                    <>
                      <span className="text-xs text-red-600 font-medium">
                        Booked
                      </span>
                      <span className="text-xs text-gray-600">
                        {slot.student}
                      </span>
                      <button
                        onClick={() => cancelBooking(day.date, time)}
                        className="text-xs text-red-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleBookClick(day.date, time)}
                      className="text-xs text-blue-600"
                    >
                      + Book
                    </button>
                  )}
                </div>
              );
            })}

          </div>
        ))}

      </div>

      {/* MODAL */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-lg font-semibold mb-2">
              Book Session
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {selectedSlot.date} at {selectedSlot.time}
            </p>

            <input
              type="text"
              placeholder="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="border w-full p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedSlot(null)}>Cancel</button>
              <button onClick={bookSlot} className="bg-blue-600 text-white px-4 py-1 rounded">
                Confirm
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}