"use client"
import { CheckCircle, Calendar, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Confirmation() {
    const router = useRouter();
  return (
    <div className="animate-fade-in min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="mb-8 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-[#b97d9f] rounded-full blur-2xl opacity-20 animate-pulse" />
            <CheckCircle className="w-32 h-32 text-[#b97d9f] relative animate-scale-in" />
          </div>
        </div>

        <h1 className="mb-3 text-4xl text-gray-800">{`You're All Set`} 🎉</h1>
        <p className="text-xl text-gray-600 mb-12">Welcome to Skyborne. Your wellness journey begins now.</p>

        <div className="bg-[#fef9f3] rounded-2xl p-8 shadow-sm border border-[#f0e5d8] mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#b97d9f] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Payment Confirmed</h3>
                <p className="text-sm text-gray-600">Your payment has been processed successfully</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#b97d9f] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Account Activated</h3>
                <p className="text-sm text-gray-600">Your membership is now active</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-[#b97d9f] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1 text-gray-800">Welcome Email Sent</h3>
                <p className="text-sm text-gray-600">Check your inbox for next steps and class scheduling</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="flex-1 bg-[#b97d9f] hover:bg-[#a16685] text-white py-4 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg"
          onClick={()=>router.push("/dashboard")}>
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button className="flex-1 bg-white border-2 border-[#b97d9f] text-[#b97d9f] hover:bg-[#fef9f3] py-4 px-4 rounded-full transition-all flex items-center justify-center gap-2 text-lg"
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