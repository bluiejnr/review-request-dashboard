'use client';

import { useState } from 'react';
import PayButton from '@/components/PayButton';

export default function Home() {
  const [plan, setPlan] = useState('Free Tier');

  const handlePaymentSuccess = () => {
    setPlan('Pro Tier');
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">ReviewNudge Dashboard</h1>
          <p className="text-gray-400">Manage your SaaS review requests and subscriptions</p>
        </div>
        
        {plan === 'Free Tier' && (
          <PayButton onSuccessCallback={handlePaymentSuccess} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 border rounded-lg bg-gray-900 text-white">
          <p className="text-sm text-gray-400">Total Requests</p>
          <p className="text-3xl font-bold text-blue-500">1,240</p>
        </div>

        <div className="p-6 border rounded-lg bg-gray-900 text-white">
          <p className="text-sm text-gray-400">Current Plan</p>
          <p className={`text-3xl font-bold ${plan === 'Pro Tier' ? 'text-green-500' : 'text-purple-500'}`}>
            {plan}
          </p>
        </div>
      </div>
    </main>
  );
}