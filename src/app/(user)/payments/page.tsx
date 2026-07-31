/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  Plus,
  XCircle,
  Loader2,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  useCreateCardPortalSessionMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentStatsQuery,
} from '@/store/api/paymentApi';
import { useGetPlansQuery } from '@/store/api/publicApi';
import { useSelector } from 'react-redux';
import useGetUser from '@/hooks/useGetUser';
// import { handleDeleteTrainer } from '@/utils/handleDeleteAlert';
// import Swal from 'sweetalert2';
// import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import CancelSubscriptionModal from "@/utils/CancelSubscriptionAlert";
import { InvoiceViewerModal } from "@/components/pages/admin/payment-management/InvoiceViewerModal";

export interface Payment {
  _id: string;
  orderRef: string;
  reference: string;
  amount: number;
  localAmount?: number;
  currency: string;
  plan: string;
  status: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
}

const FIXED_PLAN_NAME_MAP: Record<string, string> = {
  "gold-yoga": "Gold Package",
  "gold-zumba": "Gold Package",
  "gold-mixed": "Gold Package",
  diamond: "Diamond Package",
  platinum: "Platinum Package",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function UserPayments() {
    // const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const router = useRouter();

  // Get userId from Redux or auth state
  const userId = useSelector((state: any) => state.auth.user?._id);
  const { user } = useGetUser();

    // const [cancelSubscription] = useCancelSubscriptionMutation();


  // RTK Query hooks
  const { data: plansData } = useGetPlansQuery(undefined);
  const { data: paymentHistoryData, isLoading: isLoadingHistory } = useGetPaymentHistoryQuery(userId, {
    skip: !userId,
  });
  const { data: paymentStatsData, isLoading: isLoadingStats } = useGetPaymentStatsQuery(userId, {
    skip: !userId,
  });
  const [createCardPortalSession, { isLoading: isOpeningStripeCardPage }] =
    useCreateCardPortalSessionMutation();

  // Parse data from API responses
  const payments = useMemo(() => paymentHistoryData?.payments || [], [paymentHistoryData]);
  const stats = useMemo(() => paymentStatsData?.stats || {}, [paymentStatsData]);
  const plans = useMemo(() => plansData?.data || [], [plansData]);
  
  // Get subscription from user object
  const subscription = useMemo(() => user?.subscription || {}, [user]);
  const plan = useMemo(() => user?.plan || '', [user]);
  const canEditCard = subscription?.status === 'active';
  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!subscription?.endDate) return 0;
    const endDate = new Date(subscription.endDate).getTime();
    const now = new Date().getTime();
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  };

  const daysRemaining = calculateDaysRemaining();

  // Format date utility
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency utility
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format plan name utility
  const formatPlanName = (planName: string) => {
    if (!planName) return '';

    const raw = String(planName).trim();
    const normalized = raw.toLowerCase();

    if (FIXED_PLAN_NAME_MAP[normalized]) {
      return FIXED_PLAN_NAME_MAP[normalized];
    }

    const matchedPlan = plans.find((plan: any) => {
      const keys = [
        String(plan?.uuid || "").toLowerCase(),
        String(plan?.planId || "").toLowerCase(),
        String(plan?._id || "").toLowerCase(),
        String(plan?.name || "").trim().toLowerCase(),
        slugify(String(plan?.name || "")),
      ].filter(Boolean);

      return keys.includes(normalized);
    });

    if (matchedPlan?.name) {
      return toTitleCase(String(matchedPlan.name));
    }

    const looksLikeId =
      /^[0-9a-f]{24}$/i.test(raw) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        raw,
      ) ||
      (/[0-9a-f]{8,}/i.test(raw) && /\d/.test(raw) && raw.length > 20);

    if (looksLikeId) {
      return "Custom Plan";
    }

    return toTitleCase(raw.replace(/-/g, " "));
  };

  // Define table columns
  // const columns: ColumnDef<Payment>[] = [
  //   {
  //     accessorKey: 'createdAt',
  //     header: 'Date',
  //     cell: ({ row }) => formatDate(row.original.createdAt),
  //   },
  //   {
  //     accessorKey: 'plan',
  //     header: 'Description',
  //     cell: ({ row }) => (
  //       <div className="text-sm text-[#1A1A1A]">
  //         {formatPlanName(row.original.plan)} - Monthly Subscription
  //       </div>
  //     ),
  //   },
  //   // {
  //   //   accessorKey: 'paymentMethod',
  //   //   header: 'Method',
  //   //   cell: ({ row }) => (
  //   //     <div className="text-sm text-[#6B6B6B]">
  //   //       {row.original.reference ? `Visa ****${String(row.original.reference).slice(-4)}` : 'N/A'}
  //   //     </div>
  //   //   ),
  //   // },
  //   {
  //     accessorKey: 'amount',
  //     header: 'Amount',
  //     cell: ({ row }) => (
  //       <div className="text-sm text-[#1A1A1A] font-semibold">
  //         {formatCurrency(row.original.amount, "USD")}
  //       </div>
  //     ),
  //   },
  //   {
  //     accessorKey: 'status',
  //     header: 'Status',
  //     cell: ({ row }) => {
  //       const status = row.original.status.toLowerCase();
  //       const isCompleted = status === 'completed';

  //       return (
  //         <Badge
  //           className={`py-1! ${
  //             isCompleted
  //               ? 'bg-[#27AE60]/10 text-[#27AE60]'
  //               : status === 'failed'
  //               ? 'bg-[#e74c3c]/10 text-[#e74c3c]'
  //               : 'bg-[#f4b942]/10 text-[#f4b942]'
  //           }`}
  //           style={{ borderRadius: '8px' }}
  //         >
  //           {isCompleted ? (
  //             <CheckCircle className="w-3 h-3 mr-1" />
  //           ) : status === 'failed' ? (
  //             <XCircle className="w-3 h-3 mr-1" />
  //           ) : (
  //             <Clock className="w-3 h-3 mr-1" />
  //           )}
  //           {status.charAt(0).toUpperCase() + status.slice(1)}
  //         </Badge>
  //       );
  //     },
  //   },
  //   // {
  //   //   accessorKey: 'invoiceId',
  //   //   header: 'Invoice',
  //   //   cell: ({ row }) => (
  //   //     <Button
  //   //       size="sm"
  //   //       variant="ghost"
  //   //       className="text-[#b95e82] hover:bg-[#b95e82]/10"
  //   //       onClick={() => {
  //   //         console.log('Download invoice:', row.original.invoiceId);
  //   //       }}
  //   //     >
  //   //       <Download className="w-4 h-4 mr-2" />
  //   //       {row.original.invoiceId || 'N/A'}
  //   //     </Button>
  //   //   ),
  //   // },
  // ];

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'date',
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'plan',
      accessorKey: 'plan',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A]">
          {formatPlanName(row.original.plan)} - Monthly Subscription
        </div>
      ),
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-semibold">
          {formatCurrency(row.original.amount, "USD")}
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status.toLowerCase();
        const isCompleted = status === 'completed';

        return (
          <Badge
            className={`py-1! ${
              isCompleted
                ? 'bg-[#27AE60]/10 text-[#27AE60]'
                : status === 'failed'
                ? 'bg-[#e74c3c]/10 text-[#e74c3c]'
                : 'bg-[#f4b942]/10 text-[#f4b942]'
            }`}
            style={{ borderRadius: '8px' }}
          >
            {isCompleted ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : status === 'failed' ? (
              <XCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.invoiceId ? (
            <Button
              onClick={() => {
                setSelectedInvoiceId(row.original.invoiceId!);
                setIsInvoiceModalOpen(true);
              }}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-[#b95e82] hover:bg-[#b95e82]/10 h-8"
              title="View Invoice"
            >
              <Eye className="w-4 h-4" />
              <span className="text-xs">View</span>
            </Button>
          ) : (
            <span className="text-xs text-[#929292]">No Invoice</span>
          )}
        </div>
      ),
    },
  ];

  const handleOpenStripeCardPage = async () => {
    try {
      const returnUrl =
        typeof window !== "undefined" ? `${window.location.origin}/payments` : undefined;
      const resp = await createCardPortalSession({ returnUrl }).unwrap();
      const portalUrl = resp?.data?.url;
      if (portalUrl && typeof window !== "undefined") {
        window.location.href = portalUrl;
      }
    } catch (error) {
      console.error("Failed to open Stripe card update page", error);
    }
  };

    // Handle cancel subscription
  // const handleCancelSubscription = async () => {
  //   const confirmDelete = await Swal.fire({
  //     title: "Cancel Subscription?",
  //     html: `
  //       <p class="text-center mb-3">
  //         Are you sure you want to cancel your <strong>${formatPlanName(plan)}</strong> subscription?
  //       </p>
  //       <p class="text-sm text-gray-600 text-center">
  //         You will lose access to premium features after <strong>${formatDate(subscription.endDate || new Date().toISOString())}</strong>.
  //       </p>
  //     `,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Cancel Subscription",
  //     cancelButtonText: "Keep Subscription",
  //     buttonsStyling: false,
  //     customClass: {
  //       confirmButton: "swal-confirm-btn px-6 py-2 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600",
  //       cancelButton: "swal-cancel-btn px-6 py-2 rounded-md font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 ml-3",
  //     },
  //     allowOutsideClick: false,
  //   });

  //   if (confirmDelete.isConfirmed) {
  //     try {
  //       setIsCancellingSubscription(true);
        
  //       await cancelSubscription(userId).unwrap();
        
  //       toast.success('Subscription cancelled successfully');
        
  //       // Refetch user data to update subscription status
  //       // await refetchUser();
  //     } catch (error) {
  //       console.error('Error cancelling subscription:', error);
  //       const errorMessage =
  //         error instanceof Error ? error.message : 'Failed to cancel subscription';
  //       toast.error(errorMessage);
  //     } finally {
  //       setIsCancellingSubscription(false);
  //     }
  //   }
  // };


  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1A1A1A] mb-2">Payments</h1>
        <p className="text-[#6B6B6B]">Manage your payment methods and view transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Spent */}
        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Total Spent</p>
                <p className="text-3xl text-[#1A1A1A]">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats.totalSpent || 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">This Month</p>
                <p className="text-3xl">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats.thisMonth || 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Payment */}
        <Card className="border-[#e5e5e5]" style={{ borderRadius: '20px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1">Next Payment</p>
                <p className="text-3xl">
                  {isLoadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    formatCurrency(stats.nextPaymentAmount ?? stats.lastPaymentAmount ?? 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payment - Show when subscription is active */}
      {subscription && subscription.status === 'active' && (
        <div className="space-y-4">
          <Card
            className="border-none"
            style={{
              borderRadius: '24px',
              background: '#B95E82',
            }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1 font-satoshi-500">Next Payment Due</h3>
                    <p className="text-white/90 mb-3">
                      {formatPlanName(plan)} - Monthly Subscription
                    </p>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(stats.nextPaymentAmount ?? stats.lastPaymentAmount ?? 0)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{daysRemaining} days remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2 max-[320px]:w-full max-[320px]:flex-col max-[320px]:items- max-[320px]:gap-3">
                  {canEditCard && (
                    <Button
                      className="bg-white text-[#B95E82] font-semibold  w-full md:w-auto max-[320px]:w-full max-[320px]:px-2 max-[320px]:text-xs max-[320px]:h-auto"
                      style={{ borderRadius: '12px' }}
                      onClick={handleOpenStripeCardPage}
                      disabled={isOpeningStripeCardPage}
                    >
                      {isOpeningStripeCardPage ? 'Opening...' : 'Edit Card'}
                    </Button>
                  )}
                  <Button
                    className="bg-white text-[#B95E82] font-semibold max-[320px]:w-full max-[320px]:px-3 max-[320px]:leading-snug max-[320px]:text-xs max-[320px]:whitespace-normal max-[320px]:break-words max-[320px]:text-center max-[320px]:h-auto max-[320px]:py-2"
                    style={{ borderRadius: '12px' }}
                    onClick={() => setShowCancelModal(true)}
                  >
                    Request Cancellation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show message when subscription is not active */}
      {(!subscription || subscription.status !== 'active') && (
        <Card
          className="border-2 border-dashed border-[#f4b942]"
          style={{
            borderRadius: '24px',
            background: '#fef9f5',
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-[#f4b942]" />
                <div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">No Active Subscription</h3>
                  <p className="text-sm text-[#6B6B6B]">
                    {subscription?.status === 'suspended' && 'Your subscription is currently suspended.'}
                    {subscription?.status === 'cancelled' && 'Your subscription has been cancelled.'}
                    {subscription?.status === 'expired' && 'Your subscription has expired.'}
                    {!subscription?.status && 'You don\'t have an active subscription yet.'}
                  </p>
                </div>
              </div>
              <Button
                variant={"theme"}
                style={{ borderRadius: '12px' }}
                onClick={() => {
                  router.push('/user-packages');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card className="border-[#e5e5e5]" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#1A1A1A]">Transaction History</CardTitle>
              <p className="text-sm text-[#6B6B6B] mt-1">View all your past transactions</p>
            </div>
            {/* <Button
              size="sm"
              variant="outline"
              className="border-[#b95e82] text-[#b95e82] hover:bg-[#b95e82]/10"
              style={{ borderRadius: '12px' }}
              onClick={() => {
                console.log('Export all payments');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            isLoadingData={isLoadingHistory}
          />
        </CardContent>
      </Card>
      <CancelSubscriptionModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
      <InvoiceViewerModal
        isOpen={isInvoiceModalOpen}
        invoiceId={selectedInvoiceId}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceId(null);
        }}
      />
    </div>
  );
}

export default UserPayments;
