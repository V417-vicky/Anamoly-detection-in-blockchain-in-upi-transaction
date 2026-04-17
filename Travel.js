import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Train, Hotel, MapPin, Calendar, Users, Check, Info } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Travel() {
  const navigate = useNavigate();
  const { balance, addTransaction } = useTransaction();
  const [selectedService, setSelectedService] = useState('');
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const travelServices = [
    {
      id: 'flights',
      name: 'Flights',
      icon: Plane,
      color: 'bg-blue-500',
      description: 'Book domestic and international flights',
    },
    {
      id: 'trains',
      name: 'Trains',
      icon: Train,
      color: 'bg-green-500',
      description: 'IRCTC train bookings',
    },
    {
      id: 'hotels',
      name: 'Hotels',
      icon: Hotel,
      color: 'bg-purple-500',
      description: 'Find and book hotels',
    },
  ];

  const popularDestinations = [
    { city: 'Mumbai', price: '₹2,999', type: 'Flight' },
    { city: 'Delhi', price: '₹1,999', type: 'Flight' },
    { city: 'Bangalore', price: '₹2,499', type: 'Flight' },
    { city: 'Goa', price: '₹3,499', type: 'Flight' },
    { city: 'Jaipur', price: '₹899', type: 'Train' },
    { city: 'Pune', price: '₹799', type: 'Train' },
  ];

  const handleBooking = () => {
    const price = Math.floor(Math.random() * 5000) + 1000;
    if (price <= balance) {
      addTransaction({
        type: 'debit',
        amount: price,
        description: `${selectedService} Booking - ${bookingData.from} to ${bookingData.to}`,
        recipient: 'Travel Provider',
        category: 'travel',
        subcategory: selectedService,
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your {selectedService} booking is confirmed</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Travel & Booking</h1>
      </div>

      {/* Travel Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Your Travel</h3>
        <div className="space-y-3">
          {travelServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left ${
                  selectedService === service.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className={`${service.color} rounded-full p-3 mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Form */}
      {selectedService && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Book {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bookingData.from}
                  onChange={(e) => setBookingData({...bookingData, from: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Departure city"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bookingData.to}
                  onChange={(e) => setBookingData({...bookingData, to: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Arrival city"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={bookingData.passengers}
                  onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!bookingData.from || !bookingData.to || !bookingData.date}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Search {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
            </button>
          </div>
        </div>
      )}

      {/* Popular Destinations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Destinations</h3>
        <div className="grid grid-cols-2 gap-3">
          {popularDestinations.map((destination, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{destination.city}</p>
                  <p className="text-sm text-gray-500">{destination.type}</p>
                </div>
                <p className="font-semibold text-primary-600">{destination.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Travel Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Book in advance for better prices</li>
              <li>• Compare prices across different platforms</li>
              <li>• Check cancellation policies before booking</li>
              <li>• Keep your travel documents ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
