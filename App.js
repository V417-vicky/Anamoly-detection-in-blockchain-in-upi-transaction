import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Chat from './pages/Chat';
import Balance from './pages/Balance';
import SendMoney from './pages/SendMoney';
import Recharge from './pages/Recharge';
import ElectricityBill from './pages/ElectricityBill';
import QRScan from './pages/QRScan';
import RequestMoney from './pages/RequestMoney';
import BillPayments from './pages/BillPayments';
import Wallet from './pages/Wallet';
import Investments from './pages/Investments';
import Insurance from './pages/Insurance';
import Travel from './pages/Travel';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import UpiPin from './pages/UpiPin';
import { TransactionProvider } from './context/TransactionContext';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <ChatProvider>
          <Router>
            <div className="app-container">
              <Routes>
                <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="history" element={<History />} />
                <Route path="chat" element={<Chat />} />
                <Route path="balance" element={<Balance />} />
                <Route path="send-money" element={<SendMoney />} />
                <Route path="recharge" element={<Recharge />} />
                <Route path="electricity-bill" element={<ElectricityBill />} />
                <Route path="qr-scan" element={<QRScan />} />
                <Route path="request-money" element={<RequestMoney />} />
                <Route path="bill-payments" element={<BillPayments />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="investments" element={<Investments />} />
                <Route path="insurance" element={<Insurance />} />
                <Route path="travel" element={<Travel />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="profile" element={<Profile />} />
                <Route path="upi-pin" element={<UpiPin />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ChatProvider>
    </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
