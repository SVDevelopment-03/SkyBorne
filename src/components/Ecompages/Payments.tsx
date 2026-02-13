"use client"
import { CheckCircle, XCircle, Key, Webhook } from 'lucide-react';

export function Payments() {
  const stripeStatus = {
    connected: true,
    liveMode: true,
    apiKeyConfigured: true,
    webhookConfigured: true,
    accountId: 'acct_1MK8xZ2eZvKYlo2C',
    lastUpdated: '2026-02-11'
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#333]">Payment Settings</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#635BFF] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" className="h-8">
                <path fill="#FFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#333]">Stripe Payment Gateway</h2>
              <p className="text-sm text-[#707070]">Process payments securely with Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-[#707070]" />
              <h3 className="font-bold text-[#333]">API Key Status</h3>
            </div>
            <div className="flex items-center gap-2">
              {stripeStatus.apiKeyConfigured ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Configured</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">Not Configured</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Webhook className="w-5 h-5 text-[#707070]" />
              <h3 className="font-bold text-[#333]">Webhook Status</h3>
            </div>
            <div className="flex items-center gap-2">
              {stripeStatus.webhookConfigured ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">Not Active</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between">
            <span className="text-[#707070]">Account ID</span>
            <span className="font-mono text-sm text-[#333]">{stripeStatus.accountId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#707070]">Last Updated</span>
            <span className="text-[#333]">{stripeStatus.lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h3 className="font-bold text-[#333] mb-1">Payment Mode</h3>
            <p className="text-sm text-[#707070]">Toggle between test and live payment processing</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${!stripeStatus.liveMode ? 'text-[#707070]' : 'text-gray-400'}`}>
              Test Mode
            </span>
            <button
              className={`relative w-14 h-7 rounded-full transition-colors ${
                stripeStatus.liveMode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  stripeStatus.liveMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${stripeStatus.liveMode ? 'text-[#707070]' : 'text-gray-400'}`}>
              Live Mode
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">Payment Gateway Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All payments are processed securely through Stripe</li>
          <li>• Test mode allows you to test transactions without processing real payments</li>
          <li>• Webhooks automatically update order statuses when payments are completed</li>
          <li>• Refunds can be issued directly from the order detail page</li>
        </ul>
      </div>
    </div>
  );
}
