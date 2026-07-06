"use client";

import { useMemo, useState } from "react";
import { Download, Loader2, RefreshCcw, Search, Users, Wallet, TrendingUp, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input2 } from "@/components/ui/input";
import CustomPagination from "@/components/ui/CustromPagination";
import {
  useExportCreditReportCsvMutation,
  useGetCreditReportQuery,
} from "@/store/api/adminApi";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(Number(value || 0));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const Reports = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() || undefined,
      status,
    }),
    [page, limit, search, status],
  );

  const { data, isLoading, isFetching, refetch, isError } = useGetCreditReportQuery(queryParams);
  const [exportCreditReportCsv, { isLoading: isExporting }] = useExportCreditReportCsvMutation();

  const report = data?.data;
  const rows = report?.items || [];

  const handleExport = async () => {
    try {
      const blob = await exportCreditReportCsv({
        search: search.trim() || undefined,
        status,
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "credit-report.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export credit report:", error);
    }
  };

  const summaryCards = [
    {
      title: "Users",
      value: formatNumber(report?.summary.totalUsers || 0),
      caption: `${formatNumber(report?.summary.activeUsers || 0)} active users`,
      icon: Users,
    },
    {
      title: "Purchased Credits",
      value: formatNumber(report?.summary.totalPurchasedCredits || 0),
      caption: `${formatNumber(report?.summary.totalRemainingCredits || 0)} remaining credits`,
      icon: Wallet,
    },
    {
      title: "Used Credits",
      value: formatNumber(report?.summary.totalUsedCredits || 0),
      caption: `${formatNumber(report?.summary.pendingPlans || 0)} users with pending plans`,
      icon: TrendingUp,
    },
    {
      title: "Latest Page",
      value: String(report?.pagination.currentPage || 1),
      caption: `${formatNumber(report?.pagination.totalCount || 0)} total records`,
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#FFF7F1_0%,#FFFFFF_55%,#FFF1F6_100%)] p-6 shadow-[0_16px_60px_rgba(185,94,130,0.12)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#FFF0F5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#B95E82]">
              Credit Report
            </p>
            <h1 className="text-3xl font-bold text-[#1F1F1F] md:text-4xl">User Credit Ledger</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666] md:text-base">
              See every user’s purchased credits, credits used,<br /> remaining credits,  and any pending plan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-2xl border border-[#E7DFD9] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#B95E82]" />
              <Input2
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, email, plan..."
                className="min-h-0 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-2xl border border-[#E7DFD9] bg-white px-4 py-3 text-sm text-[#1F1F1F] outline-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button variant="outlineBlackRect" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <Button variant="themeRegular" onClick={handleExport} disabled={isExporting}>
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-red-800">
          Failed to load the credit report.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[24px] border border-[#EDE7E3] bg-white p-5 shadow-[0_12px_30px_rgba(185,94,130,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2F6] text-[#B95E82]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold tracking-wide text-[#777]">{card.title}</p>
              </div>
              <p className="text-3xl font-bold text-[#1F1F1F]">{card.value}</p>
              <p className="mt-2 text-sm text-[#747474]">{card.caption}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-[#EDE7E3] bg-white p-5 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F1F1F]">User credit breakdown</h2>
            <p className="mt-1 text-sm text-[#666]">Purchased, used, remaining, and pending package details.</p>
          </div>
          <div className="rounded-full bg-[#FFF6F9] px-3 py-1 text-xs font-semibold text-[#B95E82]">
            {isFetching || isLoading ? "Loading..." : `${formatNumber(report?.pagination.totalCount || 0)} records`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-[#777]">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Purchased</th>
                <th className="px-4 py-2">Used</th>
                <th className="px-4 py-2">Remaining</th>
                <th className="px-4 py-2">Pending Package</th>
                <th className="px-4 py-2">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#777]">
                    No credit records found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.userId} className="rounded-[20px] bg-[#FAFAFA] text-sm text-[#1F1F1F]">
                    <td className="px-4 py-4">
                      <div className="font-semibold">
                        {row.firstName} {row.lastName}
                      </div>
                      <div className="text-xs text-[#777]">{row.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{row.plan || "—"}</div>
                      <div className="text-xs text-[#777]">Billing: {row.billingType || "monthly"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{formatNumber(row.purchasedCredits.total)}</div>
                      <div className="text-xs text-[#777]">
                        Y {row.purchasedCredits.yoga} / Z {row.purchasedCredits.zumba} / S {row.purchasedCredits.specialty}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-[#B95E82]">{formatNumber(row.usedCredits.total)}</div>
                      <div className="text-xs text-[#777]">
                        Y {row.usedCredits.yoga} / Z {row.usedCredits.zumba} / S {row.usedCredits.specialty}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-[#0B7A57]">{formatNumber(row.remainingCredits.total)}</div>
                      <div className="text-xs text-[#777]">
                        Y {row.remainingCredits.yoga} / Z {row.remainingCredits.zumba} / S {row.remainingCredits.specialty}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{row.pendingPlan || "—"}</div>
                      <div className="text-xs text-[#777]">
                        {row.pendingBillingType || ""}
                        {row.pendingEffectiveDate ? ` • ${new Date(row.pendingEffectiveDate).toLocaleDateString()}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#FFF0F5] px-3 py-1 text-xs font-semibold text-[#B95E82]">
                        {row.subscriptionStatus || "inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <CustomPagination
            totalPages={report?.pagination.totalPages || 1}
            currentPage={report?.pagination.currentPage || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export { Reports };
