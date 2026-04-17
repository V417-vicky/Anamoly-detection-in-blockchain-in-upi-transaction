import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Smartphone, 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  Wallet, 
  Camera, 
  ArrowDownLeft,
  CreditCard,
  TrendingUp as TrendingIcon,
  Plane,
  Heart,
  Gift,
  PieChart as PieChartIcon,
  AlertTriangle
} from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';
import PieChart from '../components/PieChart';

export default function Home() {
  const { balance, recentRecipients, getTransactionStats } = useTransaction();
  
  const transactionStats = getTransactionStats();
  
  const pieChartData = [
    {
      label: 'Safe Transactions',
      value: transactionStats.safe,
      color: '#10b981' // green-500
    },
    {
      label: 'Spam Transactions',
      value: transactionStats.spam,
      color: '#ef4444' // red-500
    }
  ];

  const quickActions = [
    {
      icon: ArrowUpRight,
      label: 'Send Money',
      color: 'bg-blue-500',
      link: '/send-money',
    },
    {
      icon: ArrowDownLeft,
      label: 'Request Money',
      color: 'bg-purple-500',
      link: '/request-money',
    },
    {
      icon: Camera,
      label: 'Scan & Pay',
      color: 'bg-orange-500',
      link: '/qr-scan',
    },
    {
      icon: Smartphone,
      label: 'Mobile Recharge',
      color: 'bg-green-500',
      link: '/recharge',
    },
    {
      icon: Zap,
      label: 'Bill Payments',
      color: 'bg-yellow-500',
      link: '/bill-payments',
    },
    {
      icon: CreditCard,
      label: 'Wallet',
      color: 'bg-indigo-500',
      link: '/wallet',
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'Recent Contacts',
      description: `${recentRecipients.length} recent recipients`,
    },
    {
      icon: TrendingUp,
      title: 'This Month',
      description: '₹12,450 spent',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Protected by UPI',
    },
  ];

  const services = [
    {
      icon: TrendingIcon,
      title: 'Investments',
      description: 'Mutual Funds & Digital Gold',
      link: '/investments',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Heart,
      title: 'Insurance',
      description: 'Health, Life & Vehicle',
      link: '/insurance',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Plane,
      title: 'Travel',
      description: 'Flights, Trains & Hotels',
      link: '/travel',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Gift,
      title: 'Rewards',
      description: 'Cashback & Offers',
      link: '/rewards',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-primary-100 text-sm mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold">₹{balance.toLocaleString('en-IN')}</h2>
          </div>
          <div className="bg-white/20 rounded-full p-2">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-50 transition-colors">
          Add Money
        </button>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} rounded-full p-3 mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">More Services</h3>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={service.link}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${service.color} rounded-full p-2 mr-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{service.title}</p>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Transaction Safety Analytics */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <PieChartIcon className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Transaction Safety Analytics</h3>
        </div>
        
        {transactionStats.total > 0 ? (
          <div className="flex flex-col md:flex-row items-center justify-around">
            <PieChart data={pieChartData} size={180} />
            <div className="mt-4 md:mt-0 md:ml-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">Safe Transactions</span>
                  </div>
                  <span className="text-lg font-bold text-green-900">{transactionStats.safe}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-900">Spam Transactions</span>
                  </div>
                  <span className="text-lg font-bold text-red-900">{transactionStats.spam}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Total Transactions</span>
                  </div>
                  <span className="text-lg font-bold text-blue-900">{transactionStats.total}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400">Start making transactions to see safety analytics</p>
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm"
              >
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Recipients */}
      {recentRecipients.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recipients</h3>
          <div className="space-y-2">
            {recentRecipients.slice(0, 3).map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-medium">
                    {recipient.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{recipient.name}</p>
                  <p className="text-sm text-gray-500">{recipient.upiId}</p>
                </div>
                {recipient.isSpam && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    Spam
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
