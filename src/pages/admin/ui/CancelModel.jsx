import { AlertCircle } from "lucide-react";

const CancelBookingModal = ({
  showCancelModal,
  selectedBooking,
  setShowCancelModal,
  handleCancelBooking,
}) => {
  if (!showCancelModal || !selectedBooking) return null;
console.log(selectedBooking)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-red-300 max-w-md w-full">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            <h3 className="text-xl font-bold">Cancel Booking</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-amber-900 mb-4">
            Are you sure you want to cancel booking{" "}
            <strong>
              {selectedBooking?.booking_id || selectedBooking?.booking_id}
            </strong>
            ?
          </p>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-amber-800">
              <strong>Seat:</strong>{" "}
              {selectedBooking?.seat?.seat_number ||
                selectedBooking?.seat?.seat_number ||
                "-"}
            </p>

            <p className="text-sm text-amber-800">
              <strong>Date:</strong>{" "}
              {selectedBooking?.booking_date
                ? new Date(selectedBooking.booking_date).toLocaleDateString("en-IN")
                : "-"}
            </p>

            <p className="text-sm text-amber-800">
              <strong>Amount:</strong> ₹
              {selectedBooking?.seat?.amount || selectedBooking?.price || 0}
            </p>
          </div>

          <p className="text-sm text-red-700 mt-4 font-semibold">
            This action cannot be undone.
          </p>
        </div>

        <div className="bg-amber-50 border-t-2 border-amber-200 p-6 flex gap-3 rounded-b-xl">
          <button
            onClick={() => setShowCancelModal(false)}
            className="flex-1 px-4 py-2 border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition font-semibold"
          >
            Keep Booking
          </button>

          <button
            onClick={() =>
              handleCancelBooking(
                selectedBooking?.booking_id || selectedBooking?.booking_id
              )
            }
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
