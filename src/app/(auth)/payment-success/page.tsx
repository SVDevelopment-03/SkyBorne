/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCreatePaymentVerificationMutation } from '@/store/api/paymentApi';
import { Calendar, CheckCircle, LayoutDashboard, Loader } from 'lucide-react';

interface PaymentData {
  orderRef: string;
  amount: number;
  currency: string;
  status: string;
  success: boolean;
}

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);

  const [verifyPayment, { isLoading }] = useCreatePaymentVerificationMutation();

  useEffect(() => {
    if (!searchParams) return;
    const orderRef = localStorage.getItem("orderRef");
    const reference = searchParams.get('ref');

    if (!orderRef || !reference) {
      setTimeout(() => {
        setError('OrderRef or reference not found');
        setLoading(false);
      }, 0);
      return;
    }

    const handleVerify = async () => {
      try {
        const response: any = await verifyPayment({
          orderRef,
          reference,
        }).unwrap();

        // ✅ Check if payment is successful
        if (response.success) {
          setPaymentData(response);
          setLoading(false);
          setAutoRetrying(false);
          console.log("✅ Payment verified successfully!");
        } else if (response.status === "PENDING" && retryCount < 5) {
          // ✅ If still PENDING, retry after 2 seconds
          console.log(`⏳ Payment still processing... Retry ${retryCount + 1}/5`);
          setAutoRetrying(true);
          setRetryCount(retryCount + 1);
          setPaymentData(response); // Show current status
          
          // Wait 2 seconds before retrying
          setTimeout(() => {
            handleVerify();
          }, 2000);
        } else if (response.status === "PENDING") {
          // ✅ Max retries reached, still pending
          setPaymentData(response);
          setError("Payment is still processing. Please check back shortly.");
          setLoading(false);
          setAutoRetrying(false);
        } else {
          // ✅ Payment failed or cancelled
          setPaymentData(response);
          setLoading(false);
          setAutoRetrying(false);
        }
      } catch (err: any) {
        console.error('Error verifying payment:', err);
        
        if (retryCount < 5) {
          // ✅ Retry on error
          console.log(`⏳ Retrying... Attempt ${retryCount + 1}/5`);
          setAutoRetrying(true);
          setRetryCount(retryCount + 1);
          
          setTimeout(() => {
            handleVerify();
          }, 2000);
        } else {
          // ✅ Max retries reached
          setError(err?.data?.error || 'Failed to verify payment');
          setLoading(false);
          setAutoRetrying(false);
        }
      }
    };

    handleVerify();
  }, [searchParams, verifyPayment]);

  // ✅ Loading state
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

  // ✅ Auto-retrying state
  if (autoRetrying && paymentData?.status === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Loader className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h1>
          <p className="text-gray-600 mb-4">
            Your payment is being processed. Please wait...
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-600 font-medium">
              Attempt {retryCount} of 5
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(retryCount / 5) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
           {` Do not close this page. We'll verify your payment automatically.`}
          </p>
        </div>
      </div>
    );
  }

  // ✅ Error state
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

  // ✅ Payment failed/cancelled state
  if (paymentData && !paymentData.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment {paymentData.status}</h1>
          <p className="text-gray-600 mb-6">
            Your payment could not be completed. Please try again.
          </p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Order Ref:</span> {paymentData.orderRef}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Amount:</span> {paymentData.currency} {paymentData.amount}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Status:</span> {paymentData.status}
            </p>
          </div>
          
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

  // ✅ Payment success state
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

        {/* Payment Details */}
        <div className="bg-[#fef9f3] rounded-2xl p-8 shadow-sm border border-[#f0e5d8] mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#B95E82] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Payment Confirmed</h3>
                <p className="text-sm text-gray-600">Your payment has been processed successfully</p>
                {paymentData && (
                  <p className="text-xs text-gray-500 mt-2">
                    Order: {paymentData.orderRef} | Amount: {paymentData.currency} {paymentData.amount}
                  </p>
                )}
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
          <button 
            className="flex-1 bg-[#B95E82] hover:bg-[#a16685] text-white py-4 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button 
            className="flex-1 bg-white border-2 border-[#B95E82] text-[#B95E82] hover:bg-[#fef9f3] py-4 px-4 rounded-full transition-all flex items-center justify-center gap-2 text-lg"
            onClick={() => router.push("/dashboard")}
          >
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