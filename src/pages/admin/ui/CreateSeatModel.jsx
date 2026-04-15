import { X, AlertCircle, Check } from "lucide-react";

function SeatModal({
  showModal,
  setShowModal,
  modalMode,
  formData,
  setFormData,
  handleSubmit,
  error,
  success,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-amber-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-amber-200">
                  <h2 className="text-xl font-bold text-amber-900">
                    {modalMode === "create" ? "Add New Seat" : "Edit Seat"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-amber-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-amber-700" />
                  </button>
                </div>
    
                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
    
                  {/* Success Message */}
                  {success && (
                    <div className="bg-green-100 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">{success}</span>
                    </div>
                  )}
    
                  {/* Seat Number Input */}
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Seat Number *
                    </label>
                    <input
                      type="text"
                      value={formData.seat_number}
                      onChange={(e) =>
                        setFormData({ ...formData, seat_number: e.target.value })
                      }
                      placeholder="e.g., A-01, B-12"
                      className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    />
                    <label className="block text-sm font-bold text-amber-900 mb-2">
                      Floor Number *
                    </label>
    
                    <select
                      value={formData.floor}
                      onChange={(e) =>
                        setFormData({ ...formData, floor: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    >
                      <option value="">Select Floor</option>
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="First Floor">First Floor</option>
                      <option value="Second Floor">Second Floor</option>
                    </select>
    
                    <p className="text-xs text-amber-600 mt-1">
                      Enter a unique seat identifier
                    </p>
                  </div>
    
                  {/* Active Status Toggle (only for edit mode) */}
                  {modalMode === "edit" && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                      <div>
                        <p className="font-bold text-amber-900">Active Status</p>
                        <p className="text-xs text-amber-600">
                          Enable or disable this seat
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_active: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  )}
    
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-bold"
                    >
                      Cancel
                    </button>
    
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-bold shadow-md"
                    >
                      {modalMode === "create" ? "Create Seat" : "Update Seat"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
  );
}

export default SeatModal;
