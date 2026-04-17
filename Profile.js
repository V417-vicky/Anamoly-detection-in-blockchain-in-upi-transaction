import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Shield, Fingerprint, Eye, EyeOff, Camera, Edit2, Check, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, upiPin, appLockEnabled, toggleAppLock, biometricEnabled, toggleBiometric, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    upiId: 'john@upi',
    bankAccounts: [
      { bank: 'HDFC Bank', account: '****1234', isDefault: true },
      { bank: 'ICICI Bank', account: '****5678', isDefault: false },
    ],
  });

  const handleSaveProfile = () => {
    updateProfile(editedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfilePictureUpload = () => {
    // Simulate profile picture upload
    const newProfile = { ...editedUser, avatar: 'new-avatar.jpg' };
    setEditedUser(newProfile);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {isEditing ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            {editedUser.avatar ? (
              <img src={editedUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-primary-600" />
            )}
          </div>
          {isEditing && (
            <button
              onClick={handleProfilePictureUpload}
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
            className="text-xl font-semibold text-gray-900 text-center border-b-2 border-primary-500 focus:outline-none"
          />
        ) : (
          <h2 className="text-xl font-semibold text-gray-900">{editedUser.name}</h2>
        )}
        <p className="text-sm text-gray-500">{editedUser.upiId}</p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <span className="flex-1 text-gray-900">{editedUser.email}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <span className="flex-1 text-gray-900">{editedUser.phone}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.upiId}
                  onChange={(e) => setEditedUser({...editedUser, upiId: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <span className="flex-1 text-gray-900">{editedUser.upiId}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Bank Accounts</h3>
        <div className="space-y-3">
          {editedUser.bankAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-bold text-sm">
                    {account.bank.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{account.bank}</p>
                  <p className="text-sm text-gray-500">{account.account}</p>
                </div>
              </div>
              {account.isDefault && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">UPI PIN</p>
                <p className="text-sm text-gray-500">4-digit PIN for transactions</p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowPin(!showPin)}
                className="p-2 hover:bg-gray-100 rounded-full mr-2"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <span className="font-mono text-gray-900">
                {showPin ? upiPin : '****'}
              </span>
              <button
                onClick={() => navigate('/upi-pin')}
                className="ml-2 p-2 hover:bg-gray-100 rounded-full"
                title="Change PIN"
              >
                <Key className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">App Lock</p>
                <p className="text-sm text-gray-500">Lock app when not in use</p>
              </div>
            </div>
            <button
              onClick={toggleAppLock}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                appLockEnabled ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appLockEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Fingerprint className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Biometric Login</p>
                <p className="text-sm text-gray-500">Use fingerprint to login</p>
              </div>
            </div>
            <button
              onClick={toggleBiometric}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                biometricEnabled ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isEditing && (
          <button
            onClick={handleSaveProfile}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Save Changes
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
