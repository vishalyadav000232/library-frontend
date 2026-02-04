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
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [seats, setSeats] = useState([]);
  
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [shiftList, setShiftList] = useState([]);
  const [selectedShiftData, setSelectedShiftData] = useState(null);

  const [loadingSeats, setLoadingSeats] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);

  //! ---------------- Fetch Current User ----------------
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

  //! ---------------- Fetch Shifts ----------------
  useEffect(() => {
    const fetchShift = async () => {
      try {
        const res = await getAllShift();
        setShiftList(Array.isArray(res) ? res : res?.data || []);
      } catch (error) {
        console.log("Shift fetch failed", error);
      }
    };

    fetchShift();
  }, []);

  // ---------------- Fetch Seats ----------------
  // IMPORTANT: If you have shift+date based API like:
  // getAllSeats({ shift_id, date })
  // then use it here.
  useEffect(() => {
    const fetchSeat = async () => {
      setLoadingSeats(true);
      try {
        const res = await getAllSeats(); 
        const seatList = Array.isArray(res) ? res : res?.data || [];

        const formattedSeats = seatList.map((s) => {
          const seatNumber = s.seat_number || "NA";
          const section = seatNumber?.[0] || "A";

          return {
            id: s.id,
            seatNumber: seatNumber,
            section: section,
            floor: s.floor || "Ground Floor",
            type: s.seat_type || "Standard",
            price: Number(s.price || 0),
            isAvailable: Boolean(s.is_active),
          };
        });

        setSeats(formattedSeats);

        // if selected seat becomes unavailable after refresh -> remove selection
        if (selectedSeat) {
          const stillExists = formattedSeats.find(
            (x) => x.id === selectedSeat.id,
          );
          if (!stillExists || !stillExists.isAvailable) {
            setSelectedSeat(null);
          }
        }
      } catch (error) {
        console.log("failed to fetch seat", error);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeat();
    
  }, [selectedShift, selectedDate]);

  // ---------------- HANDLERS ----------------
  const handleSeatSelect = (seat) => {
    if (!seat.isAvailable) return;
    
    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
    }
  };

  const handleShiftChange = (shiftId) => {
    setSelectedShift(shiftId);

    const selected = shiftList.find((s) => s.id === shiftId);
    setSelectedShiftData(selected || null);

    
    setSelectedSeat(null);
  };

  const handleBooking = async () => {
    if (!selectedSeat) {
      alert("Please select a seat");
      return;
    }

    const userId = currentUser?.id;
    const shiftId = selectedShiftData?.id;
    const date = selectedDate;

    if (!userId || !shiftId || !date) {
      alert("Missing user / shift / date");
      return;
    }

    const payload = {
      user_id: String(userId),
      seat_id: String(selectedSeat.id),
      shift_id: String(shiftId),
      start_date: date,
      end_date: date,
    };

    try {
      setLoadingBooking(true);
      await createBooking(payload);

      alert(`Booking confirmed for seat ${selectedSeat.seatNumber} ✅`);
      setSelectedSeat(null);

      // refresh seats after booking
      const res = await getAllSeats();
      const seatList = Array.isArray(res) ? res : res?.data || [];

      const formattedSeats = seatList.map((s) => {
        const seatNumber = s.seat_number || "NA";
        const section = seatNumber?.[0] || "A";

        return {
          id: s.id,
          seatNumber: seatNumber,
          section: section,
          floor: s.floor || "Ground Floor",
          type: s.seat_type || "Standard",
          price: Number(s.price || 0),
          isAvailable: Boolean(s.is_active),
        };
      });

      setSeats(formattedSeats);
    } catch (error) {
      console.log("Booking failed:", error);
      alert(error?.response?.data?.detail || "Booking failed ❌");
    } finally {
      setLoadingBooking(false);
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

  const totalPrice = selectedSeat?.price || 0;

  // Floors list for grouping
 
  const floors = useMemo(() => {
    const uniqueFloors = [...new Set(filteredSeats.map((s) => s.floor))];
    return uniqueFloors;
  }, [filteredSeats]);

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
                  {loadingSeats
                    ? "Loading seats..."
                    : `${availableCount} seats available`}
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
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSeat(null);
                }}
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
                onChange={(e) => handleShiftChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm appearance-none"
              >
                <option value="">Select Shift</option>

                {shiftList.map((s) => (
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
                <option value="Third Floor">Third Floor</option>
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
      {selectedShiftData && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4">
          <div className="bg-amber-100 border-l-4 border-amber-600 p-4 rounded-lg">
            <p className="text-amber-900 font-medium">
              Selected: {selectedShiftData?.name}
            </p>
            <p className="text-amber-700 text-sm">
              {selectedShiftData?.start_time} - {selectedShiftData?.end_time}
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
                  const isSelected = selectedSeat?.id === seat.id;

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
      {selectedSeat && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 shadow-2xl z-30 p-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-amber-700">
                Selected Seat: <b>{selectedSeat.seatNumber}</b>
              </p>
              <p className="text-2xl font-bold text-amber-900">
                Total: ₹{totalPrice}
              </p>
            </div>

            <button
              onClick={handleBooking}
              disabled={loadingBooking}
              className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold px-8 py-3 rounded-lg hover:scale-105 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingBooking ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
