/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from "@tanstack/react-table";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useGetPaymentHistoryQuery, useGetPaymentStatsQuery } from '@/store/api/paymentApi';
import { useSelector } from 'react-redux';
import useGetUser from '@/hooks/useGetUser';

interface Payment {
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

function UserPayments() {
  // Get userId from Redux or auth state
  const userId = useSelector((state: any) => state.auth.user?._id);
  const { user } = useGetUser();

  // RTK Query hooks
  const { data: paymentHistoryData, isLoading: isLoadingHistory } = useGetPaymentHistoryQuery(userId, {
    skip: !userId,
  });
  const { data: paymentStatsData, isLoading: isLoadingStats } = useGetPaymentStatsQuery(userId, {
    skip: !userId,
  });

  // Parse data from API responses
  const payments = useMemo(() => paymentHistoryData?.payments || [], [paymentHistoryData]);
  const stats = useMemo(() => paymentStatsData?.stats || {}, [paymentStatsData]);
  
  // Get subscription from user object
  const subscription = useMemo(() => user?.subscription || {}, [user]);
  const plan = useMemo(() => user?.plan || '', [user]);

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
    return planName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Define table columns
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'plan',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A]">
          {formatPlanName(row.original.plan)} - Monthly Subscription
        </div>
      ),
    },
    // {
    //   accessorKey: 'paymentMethod',
    //   header: 'Method',
    //   cell: ({ row }) => (
    //     <div className="text-sm text-[#6B6B6B]">
    //       {row.original.reference ? `Visa ****${String(row.original.reference).slice(-4)}` : 'N/A'}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-sm text-[#1A1A1A] font-semibold">
          {formatCurrency(row.original.amount, "USD")}
        </div>
      ),
    },
    {
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
      accessorKey: 'invoiceId',
      header: 'Invoice',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          className="text-[#b95e82] hover:bg-[#b95e82]/10"
          onClick={() => {
            console.log('Download invoice:', row.original.invoiceId);
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          {row.original.invoiceId || 'N/A'}
        </Button>
      ),
    },
  ];

  const isLoading = isLoadingHistory || isLoadingStats;

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
                    formatCurrency(stats.lastPaymentAmount || 0)
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
                      <span>{formatCurrency(stats.lastPaymentAmount || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{daysRemaining} days remaining</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* <Button
                className="bg-white text-[#5eb9b4] hover:bg-gray-100 font-semibold"
                style={{ borderRadius: '12px' }}
                onClick={() => {
                  console.log('Manage subscription');
                }}
              >
                Manage Subscription
              </Button> */}
            </div>
          </CardContent>
        </Card>
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
                className="bg-[#5eb9b4] text-white hover:bg-[#4a9d98]"
                style={{ borderRadius: '12px' }}
                onClick={() => {
                  // TODO: Add navigation to plans page
                  console.log('Navigate to plans');
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
    </div>
  );
}

export default UserPayments;