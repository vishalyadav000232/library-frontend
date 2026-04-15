import { IndianRupee, X } from "lucide-react";



const BookingDetailsModal = ({
  showDetailsModal,
  selectedBooking,
  setShowDetailsModal,
  setShowCancelModal,
  getStatusBadge,
  getPaymentBadge,
}) => {
  if (!showDetailsModal || !selectedBooking) return null;

  console.log(selectedBooking)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-amber-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <h3 className="text-2xl font-bold">Booking Details</h3>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 hover:text-amber-700 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-amber-700 font-semibold mb-1">
                Booking ID
              </p>
              <p className="text-lg font-bold text-amber-900">
                {selectedBooking?.booking_id ||
                  selectedBooking?.id ||
                  "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-amber-700 font-semibold mb-1">
                Status
              </p>
              {getStatusBadge(selectedBooking?.status)}
            </div>
          </div>

          <div className="border-t-2 border-amber-200 pt-6">
            <h4 className="font-bold text-amber-900 mb-4 text-lg">
              User Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Name
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.userName ||
                    selectedBooking?.user?.name ||
                    "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Email
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.userEmail ||
                    selectedBooking?.user?.email ||
                    "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-amber-200 pt-6">
            <h4 className="font-bold text-amber-900 mb-4 text-lg">
              Booking Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Seat Number
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.seat?.seat_number ||
                    selectedBooking?.seat_number ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Floor
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.seat?.floor ||
                    selectedBooking?.floor ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Shift
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.shift?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Timing
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.shift?.start_time || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Date
                </p>
                <p className="font-semibold text-amber-900">
                  {selectedBooking?.booking_date
                    ? new Date(selectedBooking.booking_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-1">
                  Amount
                </p>
                <p className="font-bold text-amber-900 text-lg flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {selectedBooking?.seat?.amount || selectedBooking?.price || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-amber-200 pt-6">
            <h4 className="font-bold text-amber-900 mb-4 text-lg">
              Payment Information
            </h4>
            <div>
              <p className="text-sm text-amber-700 font-semibold mb-1">
                Payment Status
              </p>
              {getPaymentBadge(
                selectedBooking?.payment?.status ||
                  selectedBooking?.payment_status,
              )}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-t-2 border-amber-200 p-6 flex gap-3 rounded-b-xl">
          <button
            onClick={() => setShowDetailsModal(false)}
            className="flex-1 px-4 py-2 border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition font-semibold"
          >
            Close
          </button>

          {String(selectedBooking?.status).toLowerCase() === "active" && (
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setShowCancelModal(true);
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
