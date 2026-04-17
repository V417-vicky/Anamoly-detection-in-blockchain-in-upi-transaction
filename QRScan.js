import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Check, AlertCircle } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function QRScan() {
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();
  const [amount, setAmount] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScanQR = () => {
    setScanning(true);
    // Simulate QR scanning
    setTimeout(() => {
      setScanning(false);
      setMerchantName('Local Tea Shop');
    }, 2000);
  };

  const handleUploadQR = () => {
    // Simulate QR upload
    setTimeout(() => {
      setMerchantName('Supermarket Store');
    }, 1000);
  };

  const handlePayment = () => {
    if (amount && parseFloat(amount) > 0 && merchantName) {
      addTransaction({
        type: 'debit',
        amount: parseFloat(amount),
        description: `QR Payment - ${merchantName}`,
        recipient: merchantName,
        category: 'qr-payment',
      });
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">₹{amount} paid to {merchantName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Scan & Pay</h1>
      </div>

      {/* QR Scanner Area */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          {scanning ? (
            <div className="text-center">
              <div className="animate-pulse">
                <Camera className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Scanning QR Code...</p>
              </div>
              <div className="absolute inset-0 border-2 border-primary-600 rounded-lg animate-pulse"></div>
            </div>
          ) : merchantName ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900 mb-1">QR Code Detected</p>
              <p className="text-gray-600">{merchantName}</p>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Position QR code within frame</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleScanQR}
            disabled={scanning}
            className="flex items-center justify-center py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300"
          >
            <Camera className="w-5 h-5 mr-2" />
            Scan QR
          </button>
          <button
            onClick={handleUploadQR}
            className="flex items-center justify-center py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload
          </button>
        </div>
      </div>

      {/* Payment Form */}
      {merchantName && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">M</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{merchantName}</p>
                <p className="text-sm text-gray-500">Merchant</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Pay ₹{amount || '0'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Amounts */}
      {merchantName && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</h3>
          <div className="grid grid-cols-4 gap-2">
            {[100, 200, 500, 1000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className={`py-2 rounded-lg border transition-colors ${
                  amount === quickAmount.toString()
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent QR Payments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent QR Payments</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Starbucks Coffee</p>
                <p className="text-sm text-gray-500">Today, 10:30 AM</p>
              </div>
              <p className="font-semibold text-red-600">-₹450</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Grocery Store</p>
                <p className="text-sm text-gray-500">Yesterday, 6:15 PM</p>
              </div>
              <p className="font-semibold text-red-600">-₹1,250</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Scan Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure good lighting for better scanning</li>
              <li>• Keep QR code steady within the frame</li>
              <li>• Check merchant details before payment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
