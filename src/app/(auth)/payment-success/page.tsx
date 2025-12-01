/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCreatePaymentVerificationMutation } from '@/store/api/paymentApi';
import { Calendar, CheckCircle, LayoutDashboard } from 'lucide-react';

interface PaymentData {
  orderRef: string;
  amount: number;
  currency: string;
  status: string;
}

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [verifyPayment, { isLoading }] = useCreatePaymentVerificationMutation();

  useEffect(() => {
    if (!searchParams) return;

    const orderRef = searchParams.get('orderRef');
    const reference = searchParams.get('reference');

    // if (!orderRef) {
    //   setTimeout(() => {
    //     setError('Order reference not found');
    //     setLoading(false);
    //   }, 0);
    //   return;
    // }

    const handleVerify = async () => {
      try {
        const response: any = await verifyPayment({
          orderRef:'123',
          reference,
        }).unwrap();

        setPaymentData(response);
        setLoading(false);
      } catch (err: any) {
        console.error('Error verifying payment:', err);
        setError(err?.data?.error || 'Failed to verify payment');
        setLoading(false);
      }
    };

    handleVerify();
  }, [searchParams, verifyPayment]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="flex gap-3">
            <Button
              variant={"themeRect"}
              onClick={() => router.push('/checkout')}
              className="flex-1 transition font-semibold"
            >
              Try Again
            </Button>
            <Button 
              variant={"outlineBlackRect"}
              onClick={() => router.push('/')}
              className="flex-1 transition font-semibold"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
     <div className="animate-fade-in min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="mb-8 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-[#B95E82] rounded-full blur-2xl opacity-20 animate-pulse" />
            <CheckCircle className="w-32 h-32 text-[#B95E82] relative animate-scale-in" />
          </div>
        </div>

        <h1 className="mb-3 text-4xl text-gray-800">{`You're All Set`} 🎉</h1>
        <p className="text-xl text-gray-600 mb-12">Welcome to Skyborne. Your wellness journey begins now.</p>

        <div className="bg-[#fef9f3] rounded-2xl p-8 shadow-sm border border-[#f0e5d8] mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Payment Confirmed</h3>
                <p className="text-sm text-gray-600">Your payment has been processed successfully</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Account Activated</h3>
                <p className="text-sm text-gray-600">Your membership is now active</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Welcome Email Sent</h3>
                <p className="text-sm text-gray-600">Check your inbox for next steps and class scheduling</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="flex-1 bg-[#B95E82] hover:bg-[#a16685] text-white py-4 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg"
          onClick={()=>router.push("/dashboard")}>
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button className="flex-1 bg-white border-2 border-[#B95E82] text-[#B95E82] hover:bg-[#fef9f3] py-4 px-4 rounded-full transition-all flex items-center justify-center gap-2 text-lg"
           onClick={()=>router.push("/dashboard")}>
            <Calendar className="w-5 h-5" />
            View Class Schedule
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Ready to start your wellness journey? Book your first class now.
        </p>
      </div>
    </div>
  );
}
