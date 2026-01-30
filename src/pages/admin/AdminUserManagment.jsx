// AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Shield, 
  Lock, 
  Unlock,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role || localStorage.getItem('userRole');
      const userId = payload.id || payload.userId;
      
      setCurrentUserId(userId);

      if (userRole !== 'ADMIN') {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toString().includes(searchTerm)
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data.users || response.data);
      setFilteredUsers(response.data.users || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUserId) {
      showToast('Cannot change your own role', 'error');
      return;
    }

    setActionLoading(prev => ({ ...prev, [`role_${userId}`]: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Optimistic update
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      showToast('Role updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error');
      fetchUsers(); // Revert on error
    } finally {
      setActionLoading(prev => ({ ...prev, [`role_${userId}`]: false }));
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    if (userId === currentUserId) {
      showToast('Cannot change your own status', 'error');
      return;
    }

    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setActionLoading(prev => ({ ...prev, [`status_${userId}`]: true }));
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Optimistic update
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      showToast(`User ${newStatus.toLowerCase()} successfully`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
      fetchUsers(); // Revert on error
    } finally {
      setActionLoading(prev => ({ ...prev, [`status_${userId}`]: false }));
    }
  };

  const confirmDelete = (user) => {
    if (user.id === currentUserId) {
      showToast('Cannot delete your own account', 'error');
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setActionLoading(prev => ({ ...prev, [`delete_${userToDelete.id}`]: true }));
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users/${userToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Optimistic update
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      
      showToast('User deleted successfully', 'success');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${userToDelete.id}`]: false }));
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'LIBRARIAN':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'STUDENT':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-red-100 text-red-700 border-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-amber-900 text-lg font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border-2 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-900' 
            : 'bg-red-50 border-red-500 text-red-900'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete user <strong>{userToDelete?.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading[`delete_${userToDelete?.id}`]}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading[`delete_${userToDelete?.id}`] ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border-2 border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-amber-900">User Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 mb-1">User ID</p>
                  <p className="text-lg font-semibold text-amber-900">{selectedUser.id}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 mb-1">Name</p>
                  <p className="text-lg font-semibold text-amber-900">{selectedUser.name}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 mb-1">Email</p>
                  <p className="text-lg font-semibold text-amber-900">{selectedUser.email}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 mb-1">Role</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 mb-1">Created At</p>
                  <p className="text-lg font-semibold text-amber-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900">User Management</h1>
              <p className="text-amber-700">Yadav Library - Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-amber-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-amber-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or ID..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Filter by Role
              </label>
              <div className="relative">
                <Filter className="w-5 h-5 text-amber-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition appearance-none bg-white"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="LIBRARIAN">Librarian</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Filter by Status
              </label>
              <div className="relative">
                <Filter className="w-5 h-5 text-amber-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 transition appearance-none bg-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-amber-700">
            Showing <span className="font-bold">{filteredUsers.length}</span> of <span className="font-bold">{users.length}</span> users
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-900 font-semibold">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Created At</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-amber-700">
                      <Users className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                      <p className="text-lg font-semibold">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`border-b border-amber-100 hover:bg-amber-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-amber-50 bg-opacity-30'
                      }`}
                    >
                      <td className="px-6 py-4 text-amber-900 font-semibold">#{user.id}</td>
                      <td className="px-6 py-4 text-amber-900 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-amber-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={user.id === currentUserId || actionLoading[`role_${user.id}`]}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed ${getRoleBadgeColor(user.role)}`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="LIBRARIAN">Librarian</option>
                          <option value="STUDENT">Student</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleStatusToggle(user.id, user.status)}
                            disabled={user.id === currentUserId || actionLoading[`status_${user.id}`]}
                            className={`p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.status === 'ACTIVE'
                                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                            title={user.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                          >
                            {actionLoading[`status_${user.id}`] ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : user.status === 'ACTIVE' ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => confirmDelete(user)}
                            disabled={user.id === currentUserId}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 border-2 border-amber-200 shadow">
            <p className="text-sm text-amber-700 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-amber-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-200 shadow">
            <p className="text-sm text-red-700 mb-1">Admins</p>
            <p className="text-2xl font-bold text-red-900">
              {users.filter(u => u.role === 'ADMIN').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow">
            <p className="text-sm text-blue-700 mb-1">Librarians</p>
            <p className="text-2xl font-bold text-blue-900">
              {users.filter(u => u.role === 'LIBRARIAN').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow">
            <p className="text-sm text-green-700 mb-1">Students</p>
            <p className="text-2xl font-bold text-green-900">
              {users.filter(u => u.role === 'STUDENT').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;