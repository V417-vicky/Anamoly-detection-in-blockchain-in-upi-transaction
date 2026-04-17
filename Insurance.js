import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Car, Check, AlertCircle, Info } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Insurance() {
  const navigate = useNavigate();
  const { balance, addTransaction } = useTransaction();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const insuranceCategories = [
    {
      id: 'health',
      name: 'Health Insurance',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Medical coverage for you and family',
    },
    {
      id: 'life',
      name: 'Life Insurance',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'Secure your family\'s future',
    },
    {
      id: 'vehicle',
      name: 'Vehicle Insurance',
      icon: Car,
      color: 'bg-green-500',
      description: 'Comprehensive vehicle protection',
    },
  ];

  const insurancePlans = {
    health: [
      {
        id: 1,
        name: 'Individual Health Plus',
        coverage: '5 Lakhs',
        premium: '₹299/month',
        features: ['Cashless hospitalization', 'Pre & post hospitalization', 'Ambulance cover'],
      },
      {
        id: 2,
        name: 'Family Health Shield',
        coverage: '10 Lakhs',
        premium: '₹599/month',
        features: ['Family coverage', 'No claim bonus', 'Annual health checkup'],
      },
    ],
    life: [
      {
        id: 3,
        name: 'Term Life Basic',
        coverage: '50 Lakhs',
        premium: '₹499/month',
        features: ['Pure term cover', 'Tax benefits', 'Critical illness cover'],
      },
      {
        id: 4,
        name: 'Term Life Plus',
        coverage: '1 Crore',
        premium: '₹899/month',
        features: ['Higher coverage', 'Accidental death benefit', 'Waiver of premium'],
      },
    ],
    vehicle: [
      {
        id: 5,
        name: 'Car Comprehensive',
        coverage: 'IDV based',
        premium: '₹3,999/year',
        features: ['Own damage cover', 'Third party liability', 'Zero depreciation'],
      },
      {
        id: 6,
        name: 'Bike Standard',
        coverage: 'IDV based',
        premium: '₹1,499/year',
        features: ['Basic coverage', 'Third party cover', 'Personal accident'],
      },
    ],
  };

  const handlePurchase = () => {
    if (selectedPlan) {
      const premium = parseInt(selectedPlan.premium.replace(/[₹,/month/year]/g, ''));
      if (premium <= balance) {
        addTransaction({
          type: 'debit',
          amount: premium,
          description: `Insurance Premium - ${selectedPlan.name}`,
          recipient: 'Insurance Provider',
          category: 'insurance',
          subcategory: selectedCategory,
        });
        setShowConfirmation(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Activated!</h2>
          <p className="text-gray-600">{selectedPlan.name} policy purchased successfully</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Insurance</h1>
      </div>

      {/* Insurance Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Insurance Type</h3>
        <div className="space-y-3">
          {insuranceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left ${
                  selectedCategory === category.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className={`${category.color} rounded-full p-3 mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Insurance Plans */}
      {selectedCategory && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
          <div className="space-y-3">
            {insurancePlans[selectedCategory]?.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <p className="text-sm text-gray-500">Coverage: {plan.coverage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">{plan.premium}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Button */}
      {selectedPlan && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold text-gray-900">Selected Plan</p>
              <p className="text-sm text-gray-500">{selectedPlan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary-600">{selectedPlan.premium}</p>
              <p className="text-xs text-gray-500">Premium amount</p>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Purchase Insurance
          </button>
        </div>
      )}

      {/* Insurance Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Insurance Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Compare plans before purchasing</li>
              <li>• Read policy documents carefully</li>
              <li>• Keep your nominees updated</li>
              <li>• Pay premiums on time for continuous coverage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Important Note</h4>
            <p className="text-sm text-yellow-800">
              Insurance is a subject matter of solicitation. Please read the policy terms and conditions carefully before purchasing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
