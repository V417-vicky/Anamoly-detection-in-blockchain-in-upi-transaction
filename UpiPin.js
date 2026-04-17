import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Key, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UpiPin() {
  const navigate = useNavigate();
  const { upiPin, setUpiPinHandler } = useAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [step, setStep] = useState('verify'); // verify, set, success
  const [error, setError] = useState('');

  const handleVerifyPin = () => {
    if (currentPin === upiPin) {
      setStep('set');
      setCurrentPin('');
      setError('');
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  const handleSetPin = () => {
    if (newPin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    if (newPin === currentPin) {
      setError('New PIN must be different from current PIN');
      return;
    }
    
    setUpiPinHandler(newPin);
    setStep('success');
    setError('');
  };

  const handlePinChange = (value, setter) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setter(value);
      setError('');
    }
  };

  if (step === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PIN Changed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your UPI PIN has been updated</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 hover:bg-gray-100 rounded-full mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">UPI PIN Settings</h1>
      </div>

      {/* PIN Setup Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {step === 'verify' ? 'Verify Current PIN' : 'Set New PIN'}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 'verify' 
              ? 'Enter your current 4-digit UPI PIN to continue'
              : 'Choose a new 4-digit UPI PIN for your account'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {step === 'verify' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current PIN
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showCurrentPin ? 'text' : 'password'}
                  value={currentPin}
                  onChange={(e) => handlePinChange(e.target.value, setCurrentPin)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-2xl font-mono"
                  placeholder="••••"
                  maxLength={4}
                />
                <button
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {step === 'set' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New PIN
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    value={newPin}
                    onChange={(e) => handlePinChange(e.target.value, setNewPin)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-2xl font-mono"
                    placeholder="••••"
                    maxLength={4}
                  />
                  <button
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New PIN
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-2xl font-mono"
                    placeholder="••••"
                    maxLength={4}
                  />
                  <button
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            onClick={step === 'verify' ? handleVerifyPin : handleSetPin}
            disabled={
              (step === 'verify' && currentPin.length !== 4) ||
              (step === 'set' && (newPin.length !== 4 || confirmPin.length !== 4))
            }
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {step === 'verify' ? 'Verify PIN' : 'Set New PIN'}
          </button>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">PIN Security Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a PIN that's not easily guessable</li>
              <li>• Avoid using birth dates, phone numbers, or sequences</li>
              <li>• Never share your PIN with anyone</li>
              <li>• Change your PIN regularly for security</li>
              <li>• Don't write down your PIN anywhere</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PIN Requirements */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">PIN Requirements</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Must be exactly 4 digits</li>
              <li>• Cannot be the same as current PIN</li>
              <li>• New PIN and confirm PIN must match</li>
              <li>• Avoid using simple patterns like 1234 or 0000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
