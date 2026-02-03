import React, { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  Clock,
  Calendar,
  Check,
  X,
  Filter,
  Search,
} from "lucide-react";
import { getAllSeats } from "../Api/seat_services";
import { getAllShift } from "../Api/shift";
import { getCurrentUser } from "../Api/usrs";
import { createBooking } from "../Api/booking";

export default function SeatBookingPage() {
  // ---------------- STATE ----------------
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser , setCurrentUser] = useState({})

  // ---------------- SHIFTS DATA ----------------
  const shifts = [
    { id: "all", name: "All Shifts", time: "" },
    { id: "morning", name: "Morning", time: "6:00 AM - 12:00 PM" },
    { id: "afternoon", name: "Afternoon", time: "12:00 PM - 6:00 PM" },
    { id: "evening", name: "Evening", time: "6:00 PM - 11:00 PM" },
    { id: "fullday", name: "Full Day", time: "6:00 AM - 11:00 PM" },
  ];

  // ---------------- SEATS DATA (API) ----------------
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [shift, setShift] = useState([]);
  const [shifData, setShiftData] = useState({});

  //! Fetch all seats

  useEffect(() => {
    const fetchSeat = async () => {
      try {
        const res = await getAllSeats();

        // API response can be [] or {data: []}
        const seatList = Array.isArray(res) ? res : res?.data || [];

        // ✅ Convert API seats -> UI format
        const formattedSeats = seatList.map((s, index) => {
          const seatNumber = s.seat_number || "NA";
          const section = seatNumber?.[0] || "A";

          // floor auto assign (demo logic)
          const floor =
            index < 8
              ? "Ground Floor"
              : index < 16
                ? "First Floor"
                : index < 24
                  ? "Second Floor"
                  : "Third Floor";

          // premium/standard logic
          const type = index % 12 >= 6 ? "Premium" : "Standard";

          return {
            id: s.id,
            seatNumber,
            section,
            floor,

            isAvailable: s.is_active,

            type,
            price: type === "Premium" ? 80 : 50,
          };
        });

        setSeats(formattedSeats);
      } catch (error) {
        console.log("failed to fetch seat", error);
      }
    };

    fetchSeat();
  }, []);

  //! Fetch shifts
 
  useEffect(() => {
    const fetchShift = async () => {
      try {
        const res = await getAllShift();
        console.log(res);
        setShift(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShift();
  }, []);

  //! Get Current user 

  useEffect(() => {
  let isMounted = true;

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      if (isMounted) setCurrentUser(user);
    } catch (error) {
      console.log("Current user fetching failed", error);
    }
  };

  fetchCurrentUser();

  return () => {
    isMounted = false;
  };
}, []);

  //! ---------------- HANDLERS ----------------

  const handleSeatSelect = (seat) => {
    if (!seat.isAvailable) return;
    console.log(seat.id);
    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const haandlShift = (shift) => {
    setShiftData(shift);
  };

 const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat");
    return;
  }

  try {
    // Example: currentUser.id, selectedShift.id, selectedDate
    const userId = currentUser?.id;
    const shiftId = shifData?.id; 
    const date = selectedDate; 

    if (!userId || !shiftId || !date) {
      alert("Missing user / shift / date");
      return;
    }

    const requests = selectedSeats.map((seat) => {
      const payload = {
        user_id: userId,
        seat_id: String(seat.id),
        shift_id: String(shiftId),
        start_date: date,
        end_date: date,
      };

      return createBooking(payload);
    });

    await Promise.all(requests);

    alert(`Booking confirmed for ${selectedSeats.length} seat(s)!`);
    setSelectedSeats([]);
  } catch (error) {
    console.log("Booking failed:", error);
    alert("Booking failed!");
  }
};


  // ---------------- FILTERING ----------------
  const filteredSeats = useMemo(() => {
    return seats.filter((seat) => {
      // floor filter
      if (selectedFloor !== "all" && seat.floor !== selectedFloor) return false;

      // search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const seatNum = (seat.seatNumber || "").toLowerCase();
        const section = (seat.section || "").toLowerCase();
        if (!seatNum.includes(q) && !section.includes(q)) return false;
      }

      return true;
    });
  }, [seats, selectedFloor, searchQuery]);

  const availableCount = filteredSeats.filter((s) => s.isAvailable).length;
  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price || 0),
    0,
  );

  // Floors list for grouping
  const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Armchair className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">
                  Book Your Seat
                </h1>
                <p className="text-sm text-amber-700">
                  {availableCount} seats available
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2 bg-amber-100 rounded-lg text-amber-800"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block space-y-3 md:space-y-0 md:grid md:grid-cols-4 md:gap-4`}
          >
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>

            {/* Shift */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Shift
              </label>

              <select
                value={selectedShift}
                onChange={(e) => {
                  const shiftId = e.target.value;
                  setSelectedShift(shiftId);

                  const selected = shift.find((s) => s.id === shiftId);
                  if (selected) haandlShift(selected);
                }}
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm appearance-none"
              >
                <option value="">Select Shift</option>

                {shift.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {`${s.start_time} - ${s.end_time}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Floor
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              >
                <option value="all">All Floors</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
                <option value="Second Floor">Second Floor</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Seat number or section"
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shift Info Banner */}
      {selectedShift !== "all" && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4">
          <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-lg">
            <p className="text-amber-900 font-medium">
              Selected: {shift.find((s) => s.id === selectedShift)?.name}
            </p>
            <p className="text-amber-700 text-sm">
              {shifts.find((s) => s.id === selectedShift)?.time}
            </p>
          </div>
        </div>
      )}

      {/* Seats Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded-lg"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 border-2 border-amber-500 rounded-lg"></div>
            <span className="text-sm text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 border-2 border-gray-400 rounded-lg"></div>
            <span className="text-sm text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 border-2 border-purple-500 rounded-lg"></div>
            <span className="text-sm text-gray-700">Premium</span>
          </div>
        </div>

        {/* Group by Floor */}
        {floors.map((floor) => {
          const floorSeats = filteredSeats.filter((s) => s.floor === floor);

          if (floorSeats.length === 0) return null;

          return (
            <div key={floor} className="mb-8">
              <h2 className="text-xl font-bold text-amber-900 mb-4">{floor}</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {floorSeats.map((seat) => {
                  const isSelected = selectedSeats.find(
                    (s) => s.id === seat.id,
                  );

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatSelect(seat)}
                      disabled={!seat.isAvailable}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        ${
                          !seat.isAvailable
                            ? "bg-gray-200 border-gray-400 cursor-not-allowed opacity-60"
                            : isSelected
                              ? "bg-amber-100 border-amber-500 shadow-lg scale-105"
                              : seat.type === "Premium"
                                ? "bg-purple-50 border-purple-500 hover:scale-105 hover:shadow-md"
                                : "bg-green-50 border-green-500 hover:scale-105 hover:shadow-md"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-amber-900">
                          {seat.seatNumber}
                        </span>

                        {isSelected && (
                          <Check className="w-5 h-5 text-amber-600" />
                        )}
                        {!seat.isAvailable && (
                          <X className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      <div className="text-xs text-left space-y-1">
                        <p className="text-amber-800 font-medium">
                          {seat.type}
                        </p>
                        <p className="text-amber-700">₹{seat.price}/shift</p>
                      </div>

                      {seat.type === "Premium" && (
                        <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                          Premium
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Summary - Fixed Bottom */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 shadow-2xl z-30 p-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-amber-700">
                {selectedSeats.length} seat(s) selected
              </p>
              <p className="text-2xl font-bold text-amber-900">
                Total: ₹{totalPrice}
              </p>
            </div>

            <button
              onClick={handleBooking}
              className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold px-8 py-3 rounded-lg hover:scale-105 transition shadow-lg"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
