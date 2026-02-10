/**
 * @page Admin Settings
 * @route /admin/settings
 * @description Manage admin users and app settings
 */
"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

const AdminSettingsPage = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  
  // Settings state
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  
  // Admin management state
  const [admins, setAdmins] = useState([]);
  const [superAdmin, setSuperAdmin] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [removingAdmin, setRemovingAdmin] = useState(null);
  const [adminError, setAdminError] = useState('');
  const [addAdminModal, setAddAdminModal] = useState({ show: false, email: '' });
  const [removeAdminModal, setRemoveAdminModal] = useState({ show: false, email: '' });

  // Check admin access
  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/registrations');
      if (response.status === 401 || response.status === 403) {
        setIsAdmin(false);
      } else if (response.ok) {
        setIsAdmin(true);
      }
    } catch (error) {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setRegistrationOpen(data.registrationOpen);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
        setSuperAdmin(data.superAdmin || '');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      checkAdminAccess();
      fetchSettings();
      fetchAdmins();
    }
  }, [isLoaded, user]);

  // Toggle registration status
  const toggleRegistrationStatus = async () => {
    setUpdatingSettings(true);
    try {
      const newValue = !registrationOpen;
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationOpen: newValue }),
      });
      
      if (response.ok) {
        setRegistrationOpen(newValue);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
    setUpdatingSettings(false);
  };

  // Show add admin confirmation
  const showAddAdminConfirm = (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setAddAdminModal({ show: true, email: newAdminEmail.trim() });
  };

  // Confirm adding admin
  const confirmAddAdmin = async () => {
    const email = addAdminModal.email;
    setAddAdminModal({ show: false, email: '' });
    setAddingAdmin(true);
    setAdminError('');
    
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins || []);
        setNewAdminEmail('');
      } else {
        setAdminError(data.error || 'Failed to add admin');
      }
    } catch (error) {
      setAdminError('Failed to add admin');
    }
    setAddingAdmin(false);
  };

  // Show remove admin confirmation
  const showRemoveAdminConfirm = (email) => {
    setRemoveAdminModal({ show: true, email });
  };

  // Confirm removing admin
  const confirmRemoveAdmin = async () => {
    const email = removeAdminModal.email;
    setRemoveAdminModal({ show: false, email: '' });
    setRemovingAdmin(email);
    setAdminError('');
    
    try {
      const response = await fetch(`/api/admins?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins || []);
      } else {
        setAdminError(data.error || 'Failed to remove admin');
      }
    } catch (error) {
      setAdminError('Failed to remove admin');
    }
    setRemovingAdmin(null);
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⛔</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don&apos;t have permission to access this page.</p>
          <Link href="/" className="text-orange-400 hover:text-orange-300">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-xs sm:text-sm">Manage settings and admins</p>
      </div>

      {/* Global Settings */}
      <div className="bg-[#111]/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-[#333] mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Global Settings</h2>
        
        <div className="flex items-center justify-between p-3 sm:p-4 bg-[#222]/50 rounded-xl gap-3">
          <div className="min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">Registration Status</p>
            <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">Control site-wide registrations</p>
          </div>
          <button
            onClick={toggleRegistrationStatus}
            disabled={updatingSettings}
            className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors flex-shrink-0 ${
              registrationOpen ? 'bg-green-500' : 'bg-[#444]'
            } ${updatingSettings ? 'opacity-50' : ''}`}
          >
            <div className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full transition-transform ${
              registrationOpen ? 'translate-x-6 sm:translate-x-8' : 'translate-x-0.5 sm:translate-x-1'
            }`}></div>
          </button>
        </div>

        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[#222]/50 rounded-xl flex items-center gap-2 sm:gap-3">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${registrationOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className={`text-xs sm:text-sm ${registrationOpen ? 'text-green-400' : 'text-red-400'}`}>
            {registrationOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>

      {/* Manage Admins */}
      <div className="bg-[#111]/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-[#333]">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Admins</h2>
        
        {/* Add Admin Form */}
        <form onSubmit={showAddAdminConfirm} className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Email..."
            className="flex-1 bg-[#222]/50 border border-[#333] rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
          />
          <button
            type="submit"
            disabled={addingAdmin || !newAdminEmail.trim()}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {addingAdmin ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {adminError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {adminError}
          </div>
        )}

        {/* Admins List */}
        <div className="space-y-2 sm:space-y-3">
          {admins.map((adminEmail) => (
            <div 
              key={adminEmail}
              className="flex items-center justify-between p-2 sm:p-4 bg-[#222]/50 rounded-xl border border-[#333] gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-xs sm:text-sm font-medium">
                    {adminEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-xs sm:text-sm truncate">{adminEmail}</p>
                  {adminEmail.toLowerCase() === superAdmin.toLowerCase() && (
                    <span className="text-orange-400 text-[10px] sm:text-xs">Super Admin</span>
                  )}
                </div>
              </div>
              {adminEmail.toLowerCase() !== superAdmin.toLowerCase() && (
                <button
                  onClick={() => showRemoveAdminConfirm(adminEmail)}
                  disabled={removingAdmin === adminEmail}
                  className="p-1.5 sm:px-3 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1 sm:gap-2 flex-shrink-0"
                >
                  {removingAdmin === adminEmail ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  <span className="hidden sm:inline text-sm">Remove</span>
                </button>
              )}
            </div>
          ))}
          
          {admins.length === 0 && (
            <div className="text-center py-4 sm:py-6 text-gray-400 text-sm">
              No admins found.
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Confirmation Modal */}
      {addAdminModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl p-6 max-w-md w-full border border-[#333]">
            <h3 className="text-xl font-bold text-white mb-2">Add Admin</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to add <span className="text-orange-400">{addAdminModal.email}</span> as an admin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAddAdminModal({ show: false, email: '' })}
                className="flex-1 px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddAdmin}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Admin Confirmation Modal */}
      {removeAdminModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl p-6 max-w-md w-full border border-[#333]">
            <h3 className="text-xl font-bold text-white mb-2">Remove Admin</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove <span className="text-red-400">{removeAdminModal.email}</span> from admins?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRemoveAdminModal({ show: false, email: '' })}
                className="flex-1 px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveAdmin}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettingsPage;
