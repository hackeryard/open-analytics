"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Mail,
  Search,
  Filter,
  RefreshCw,
  User,
  CreditCard,
  Calendar,
  Layers,
  FileText,
  Check,
  X,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import PlatformHeader from "@/components/PlatformHeader";
import { usePlatform } from "@/components/PlatformContext";

interface SubscriptionRequestItem {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  tier: "pro" | "enterprise";
  billingInterval: "monthly" | "annual";
  price: number;
  currency: string;
  status: "requested" | "contacted" | "payment_pending" | "completed" | "rejected" | "cancelled";
  message?: string;
  adminNotes?: string;
  createdAt: string;
  subscriptionId?: any;
  paymentId?: any;
}

export default function AdminSubscriptionsPage() {
  const { currentUser } = usePlatform();
  const [requests, setRequests] = useState<SubscriptionRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({ requested: 0, paymentPending: 0, completed: 0 });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Selected Request Modal State
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionRequestItem | null>(null);
  const [modalAction, setModalAction] = useState<"contact" | "pending" | "activate" | "reject" | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [actionAmount, setActionAmount] = useState<number>(0);
  const [providerPaymentId, setProviderPaymentId] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Audit Logs modal
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/subscription-requests", window.location.origin);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      if (searchQuery) url.searchParams.set("search", searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const d = await res.json();
        setRequests(d.requests || []);
        if (d.counts) setCounts(d.counts);
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Failed to load requests" });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Failed to load requests" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch("/api/admin/subscription-audit-logs");
      if (res.ok) {
        const d = await res.json();
        setAuditLogs(d.logs || []);
      }
    } catch (e) {
      console.error("Failed to load audit logs:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleOpenActionModal = (
    reqItem: SubscriptionRequestItem,
    action: "contact" | "pending" | "activate" | "reject"
  ) => {
    setSelectedRequest(reqItem);
    setModalAction(action);
    setActionNotes(reqItem.adminNotes || "");
    setActionAmount(reqItem.price);
    setProviderPaymentId(`man_wire_${Date.now().toString().slice(-6)}`);
  };

  const handleExecuteAction = async () => {
    if (!selectedRequest || !modalAction) return;
    setSubmittingAction(true);
    setMessage(null);

    try {
      if (modalAction === "activate") {
        // Record Verified Payment & Activate Subscription
        const res = await fetch("/api/admin/subscriptions/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: selectedRequest._id,
            amount: Number(actionAmount),
            paymentNotes: actionNotes || "Verified manual wire/bank transfer received.",
            providerPaymentId,
          }),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "Activation failed");

        setMessage({
          type: "success",
          text: `Subscription activated for ${selectedRequest.userEmail}! User tier is now ${selectedRequest.tier.toUpperCase()}.`,
        });
      } else {
        // Update request status (contacted, payment_pending, rejected)
        const targetStatus =
          modalAction === "contact"
            ? "contacted"
            : modalAction === "pending"
            ? "payment_pending"
            : "rejected";

        const res = await fetch(`/api/admin/subscription-requests/${selectedRequest._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: targetStatus,
            adminNotes: actionNotes,
          }),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "Status update failed");

        setMessage({
          type: "success",
          text: `Request updated to ${targetStatus.replace("_", " ").toUpperCase()}.`,
        });
      }

      setModalAction(null);
      setSelectedRequest(null);
      await fetchRequests();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to execute action" });
    } finally {
      setSubmittingAction(false);
    }
  };

  const isSuperAdmin = currentUser?.role === "super_admin";

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle size={36} className="text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Super Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          This portal is strictly restricted to Super Administrators for reviewing subscription requests and recording verified payments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      <PlatformHeader
        title="Subscription Requests & Manual Review"
        subtitle="Review user subscription requests, track correspondence, record verified payments, and activate subscription tiers."
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowAuditLogs(true);
              fetchAuditLogs();
            }}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} className="text-cyan-400" />
            <span>Audit Trail</span>
          </button>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition cursor-pointer"
            title="Refresh Requests"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-cyan-400" : ""} />
          </button>
        </div>
      </PlatformHeader>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock size={14} className="text-amber-400" /> New Pending Requests
          </span>
          <p className="text-2xl font-black text-white">{counts.requested}</p>
          <span className="text-[10px] text-slate-500">Require administrator response</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CreditCard size={14} className="text-cyan-400" /> Awaiting Payment Verification
          </span>
          <p className="text-2xl font-black text-white">{counts.paymentPending}</p>
          <span className="text-[10px] text-slate-500">Invoice sent, waiting for bank funds</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" /> Completed Activations
          </span>
          <p className="text-2xl font-black text-white">{counts.completed}</p>
          <span className="text-[10px] text-slate-500">Verified subscriptions active</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0b1020]/90 border border-white/[0.08]">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {[
            { id: "all", label: "All Requests" },
            { id: "requested", label: "Requested" },
            { id: "contacted", label: "Contacted" },
            { id: "payment_pending", label: "Payment Pending" },
            { id: "completed", label: "Completed" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRequests()}
            placeholder="Search email, name, plan..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#0b1020]/90 border border-white/[0.08] shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <RefreshCw size={20} className="animate-spin text-cyan-400 mx-auto" />
            <p>Loading subscription requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <CheckCircle2 size={24} className="text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">No subscription requests found</p>
            <p className="text-[11px] text-slate-500">
              {statusFilter !== "all" ? `No requests matching "${statusFilter}" filter.` : "Incoming user subscription requests will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                  <th className="py-3 px-3">User & Contact</th>
                  <th className="py-3 px-3">Plan Requested</th>
                  <th className="py-3 px-3">Billing & Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Requested Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {requests.map((r) => {
                  const isCompleted = r.status === "completed";
                  const isRejected = r.status === "rejected" || r.status === "cancelled";

                  return (
                    <tr key={r._id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          <span>{r.userName}</span>
                        </div>
                        <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
                          <a href={`mailto:${r.userEmail}?subject=Open Analytics ${r.planName} Subscription`} className="hover:underline flex items-center gap-1">
                            <Mail size={11} /> {r.userEmail}
                          </a>
                        </div>
                        {r.message && (
                          <div className="text-[10px] text-slate-400 mt-1 italic max-w-xs truncate" title={r.message}>
                            "{r.message}"
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-black text-xs uppercase px-2.5 py-0.5 rounded-full ${
                            r.tier === "enterprise"
                              ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                              : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          }`}
                        >
                          {r.planName}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white font-mono">
                          ₹{r.price.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">
                          {r.billingInterval}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            r.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : r.status === "payment_pending"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : r.status === "contacted"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : r.status === "rejected" || r.status === "cancelled"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {r.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-[11px] text-slate-400 font-mono">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {!isCompleted && !isRejected && (
                            <>
                              <button
                                onClick={() => handleOpenActionModal(r, "contact")}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition cursor-pointer"
                                title="Mark as contacted with instructions"
                              >
                                Contacted
                              </button>

                              <button
                                onClick={() => handleOpenActionModal(r, "pending")}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition cursor-pointer"
                                title="Mark invoice/payment pending"
                              >
                                Payment Pending
                              </button>

                              <button
                                onClick={() => handleOpenActionModal(r, "activate")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition cursor-pointer shadow-sm shadow-emerald-500/20"
                                title="Record verified payment and activate"
                              >
                                Verify & Activate
                              </button>

                              <button
                                onClick={() => handleOpenActionModal(r, "reject")}
                                className="px-2 py-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-[11px] font-semibold transition cursor-pointer"
                                title="Reject request"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 size={13} /> Active
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Execution Modal */}
      {modalAction && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0c1222] border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 sm:space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {modalAction === "activate"
                    ? "Record Verified Payment & Activate"
                    : modalAction === "contact"
                    ? "Mark Request as Contacted"
                    : modalAction === "pending"
                    ? "Mark Payment Pending"
                    : "Reject Subscription Request"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  User: <span className="text-cyan-300 font-mono">{selectedRequest.userEmail}</span> ({selectedRequest.planName})
                </p>
              </div>
              <button
                onClick={() => setModalAction(null)}
                className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {modalAction === "activate" && (
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <p className="font-semibold text-white">Legitimate Payment Verification Requirement:</p>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Ensure funds have actually been received and confirmed in your bank account before proceeding. This will immediately activate user entitlements for <strong>{selectedRequest.tier.toUpperCase()}</strong> and lift all Free plan limits.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Verified Amount (₹)</label>
                    <input
                      type="number"
                      value={actionAmount}
                      onChange={(e) => setActionAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Payment Reference ID</label>
                    <input
                      type="text"
                      value={providerPaymentId}
                      onChange={(e) => setProviderPaymentId(e.target.value)}
                      placeholder="e.g. UTR / Wire ref / Bank Ref"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {modalAction === "activate" ? "Payment Verification Notes" : "Administrator Notes"}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={
                  modalAction === "activate"
                    ? "E.g. Bank transfer UTR confirmed via HDFC, invoiced on 17 Sep..."
                    : "E.g. Sent email with wire details, awaiting confirmation..."
                }
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalAction(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={submittingAction}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  modalAction === "activate"
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                    : modalAction === "reject"
                    ? "bg-rose-500 hover:bg-rose-400 text-white"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                }`}
              >
                {submittingAction ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirm {modalAction === "activate" ? "Payment & Activate" : "Update"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#0c1222] border border-white/[0.1] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-3 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-cyan-400" />
                  Subscription Audit Trail
                </h3>
                <p className="text-xs text-slate-400">
                  Immutable record of all administrator subscription and payment actions.
                </p>
              </div>
              <button
                onClick={() => setShowAuditLogs(false)}
                className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingLogs ? (
                <div className="py-12 text-center text-xs text-slate-400">Loading audit history...</div>
              ) : auditLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No audit logs recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-cyan-300 uppercase text-[11px]">
                        {log.action.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      User: <span className="text-white font-mono">{log.affectedUserEmail}</span>
                    </div>
                    {log.adminEmail && (
                      <div className="text-slate-400 text-[11px]">
                        Admin: <span className="font-mono text-slate-300">{log.adminEmail}</span>
                      </div>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <pre className="p-2 rounded-lg bg-black/40 text-[10px] text-slate-400 font-mono overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
