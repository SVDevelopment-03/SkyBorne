/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGetInvoiceDetailsQuery, useDownloadInvoicePDFMutation } from "@/store/api/InvoiceApi";

interface InvoiceViewerModalProps {
  isOpen: boolean;
  invoiceId: string | null;
  onClose: () => void;
}

export function InvoiceViewerModal({
  isOpen,
  invoiceId,
  onClose,
}: InvoiceViewerModalProps) {
  const [downloadInvoicePDF, { isLoading: isDownloading }] = useDownloadInvoicePDFMutation();

  // Fetch invoice details
  const {
    data: invoiceData,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useGetInvoiceDetailsQuery(
    { invoiceId: invoiceId || "" },
    { skip: !isOpen || !invoiceId }
  );

  const invoice = invoiceData?.invoice;

  const handleDownload = async () => {
    if (!invoiceId) return;

    try {
      const fileData = await downloadInvoicePDF({ invoiceId }).unwrap();
      const blob =
        fileData instanceof Blob
          ? fileData
          : new Blob([fileData as BlobPart], { type: "application/pdf" });

      // Create blob URL and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error?.data?.message || "Failed to download invoice");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Invoice Details
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#b95e82]" />
          </div>
        ) : detailsError ? (
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Failed to load invoice</p>
              <p className="text-sm text-red-700">
                {(detailsError as any)?.data?.message ||
                  "Please try again later"}
              </p>
            </div>
          </div>
        ) : invoice ? (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Invoice ID
                  </h3>
                  <p className="font-mono font-semibold text-gray-900">
                    {invoice.invoiceId}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Status
                  </h3>
                  <div className="flex items-center justify-end gap-2">
                    {invoice.status === "COMPLETED" && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                          Completed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Bill To
                </h4>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {invoice.userName}
                  </p>
                  <p className="text-sm text-gray-600">{invoice.userEmail}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  From
                </h4>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">SKYBORNE</p>
                  <p className="text-sm text-gray-600">
                    Skyborne Drop and Tech Investments LLC
                  </p>
                  <p className="text-sm text-gray-600">
                    Meydan Freezone, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Reference</p>
                <p className="font-mono font-semibold text-gray-900">
                  {invoice.orderRef}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(invoice.date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Plan</p>
                <p className="font-semibold text-gray-900">{invoice.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Billing Type</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {invoice.billingType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900 uppercase">
                  {invoice.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Subscription Ends</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(invoice.subscriptionEndDate)}
                </p>
              </div>
            </div>

            {/* Amount Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold text-gray-900">
                  {invoice.currency} 0.00
                </span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-[#b95e82]">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !invoiceId}
                className="flex-1 flex items-center justify-center gap-2"
                variant="themeRegular"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download PDF
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
