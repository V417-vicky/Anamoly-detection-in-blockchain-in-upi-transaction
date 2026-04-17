import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Trophy, Star, Check, Zap, Calendar, Tag } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function Rewards() {
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const scratchCards = [
    { id: 1, prize: '₹50', used: false },
    { id: 2, prize: '₹100', used: false },
    { id: 3, prize: '₹25', used: true },
    { id: 4, prize: '₹200', used: false },
    { id: 5, prize: '₹10', used: false },
  ];

  const cashbackOffers = [
    {
      id: 1,
      title: 'Mobile Recharge Cashback',
      description: 'Get 10% cashback on mobile recharges',
      minAmount: 299,
      maxCashback: 50,
      validUntil: '31 Mar 2024',
      code: 'RECHARGE10',
    },
    {
      id: 2,
      title: 'Bill Payment Offer',
      description: 'Flat ₹100 cashback on electricity bill payments',
      minAmount: 1000,
      maxCashback: 100,
      validUntil: '25 Mar 2024',
      code: 'BILL100',
    },
    {
      id: 3,
      title: 'First Transaction Bonus',
      description: 'Get ₹25 cashback on first UPI transaction',
      minAmount: 100,
      maxCashback: 25,
      validUntil: '15 Apr 2024',
      code: 'FIRST25',
    },
  ];

  const referralProgram = {
    earned: 750,
    pending: 250,
    totalReferrals: 5,
    bonusPerReferral: 100,
  };

  const loyaltyPoints = {
    current: 2450,
    nextReward: 5000,
    rewards: [
      { points: 1000, reward: '₹50 voucher' },
      { points: 2500, reward: '₹150 voucher' },
      { points: 5000, reward: '₹350 voucher' },
      { points: 10000, reward: '₹750 voucher' },
    ],
  };

  const handleScratchCard = (cardId) => {
    const card = scratchCards.find(c => c.id === cardId);
    if (!card.used) {
      card.used = true;
      const prizeAmount = parseInt(card.prize.replace('₹', ''));
      addTransaction({
        type: 'credit',
        amount: prizeAmount,
        description: `Scratch Card Win - ${card.prize}`,
        recipient: 'Rewards Program',
        category: 'reward',
      });
    }
  };

  const handleClaimOffer = (offer) => {
    setSelectedOffer(offer);
    setShowConfirmation(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Activated!</h2>
          <p className="text-gray-600">{selectedOffer.title} has been applied</p>
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
        <h1 className="text-xl font-semibold text-gray-900">Rewards & Offers</h1>
      </div>

      {/* Scratch Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scratch & Win</h3>
        <div className="grid grid-cols-3 gap-3">
          {scratchCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleScratchCard(card.id)}
              disabled={card.used}
              className={`relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-white shadow-lg transition-all ${
                card.used ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
            >
              <div className="flex flex-col items-center">
                <Gift className="w-8 h-8 mb-2" />
                {card.used ? (
                  <span className="text-sm font-medium">Used</span>
                ) : (
                  <span className="text-sm font-medium">Scratch</span>
                )}
              </div>
              {card.used && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cashback Offers */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cashback Offers</h3>
        <div className="space-y-3">
          {cashbackOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{offer.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    Valid until {offer.validUntil}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                      Min: ₹{offer.minAmount}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Max: ₹{offer.maxCashback}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleClaimOffer(offer)}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm"
              >
                Claim Offer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Program */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white">
        <div className="flex items-center mb-3">
          <Trophy className="w-6 h-6 mr-2" />
          <h3 className="font-semibold">Referral Program</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-purple-200 text-sm">Earned</p>
            <p className="text-xl font-bold">₹{referralProgram.earned}</p>
          </div>
          <div>
            <p className="text-purple-200 text-sm">Pending</p>
            <p className="text-xl font-bold">₹{referralProgram.pending}</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm mb-1">Refer friends and earn ₹{referralProgram.bonusPerReferral} each!</p>
          <p className="text-xs text-purple-200">{referralProgram.totalReferrals} friends referred</p>
        </div>
      </div>

      {/* Loyalty Points */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Points</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <div>
                <p className="font-semibold text-gray-900">Your Points</p>
                <p className="text-2xl font-bold text-primary-600">{loyaltyPoints.current}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next reward at</p>
              <p className="font-semibold text-gray-900">{loyaltyPoints.nextReward}</p>
            </div>
          </div>
          <div className="space-y-2">
            {loyaltyPoints.rewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">{reward.points} points</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{reward.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start">
          <Zap className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Maximize Your Rewards</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete daily transactions to earn scratch cards</li>
              <li>• Refer friends for instant bonuses</li>
              <li>• Use offers before they expire</li>
              <li>• Accumulate loyalty points for bigger rewards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
