"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  Search,
  Filter,
  Tag,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Sliders,
  MousePointer,
  FileText,
  Download,
  DollarSign,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Activity,
  Code2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Compass,
  Laptop,
} from "lucide-react";
import { usePlatform } from "@/components/PlatformContext";
import { AnalyticsData, formatExactTime, formatExactDate, timeAgo } from "@/lib/analyticsTypes";

interface CustomEventRule {
  id: string;
  name: string;
  triggerType: "click" | "form_submit" | "pageview" | "scroll_depth" | "file_download" | "outbound_link";
  selector?: string;
  textMatch?: string;
  textMatchType?: "contains" | "exact" | "starts_with";
  pathPattern?: string;
  pathMatchType?: "exact" | "contains" | "starts_with" | "any";
  value?: number;
  properties?: Record<string, any>;
  enabled: boolean;
  createdAt: string | Date;
}

export default function EventsSection({ data: propData }: { data?: AnalyticsData }) {
  const { data: platformData, activeProjectId, currentUser } = usePlatform();
  const data = propData || platformData;

  const [activeTab, setActiveTab] = useState<"stream" | "rules">("stream");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // No-Code Event Rules State
  const [rules, setRules] = useState<CustomEventRule[]>([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savingRule, setSavingRule] = useState(false);
  const [ruleMessage, setRuleMessage] = useState<string | null>(null);

  // New Rule Form State
  const [formName, setFormName] = useState("");
  const [formTriggerType, setFormTriggerType] = useState<CustomEventRule["triggerType"]>("click");
  const [formSelector, setFormSelector] = useState("");
  const [formTextMatch, setFormTextMatch] = useState("");
  const [formTextMatchType, setFormTextMatchType] = useState<"contains" | "exact" | "starts_with">("contains");
  const [formPathPattern, setFormPathPattern] = useState("*");
  const [formValue, setFormValue] = useState<string>("0");

  const fetchRules = async () => {
    if (!activeProjectId) return;
    setLoadingRules(true);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/event-rules`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.eventRules)) {
          setRules(json.eventRules);
        }
      }
    } catch (e) {
      console.error("Failed to load event rules:", e);
    } finally {
      setLoadingRules(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [activeProjectId]);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !activeProjectId) return;

    setSavingRule(true);
    setRuleMessage(null);
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/event-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          triggerType: formTriggerType,
          selector: formSelector.trim(),
          textMatch: formTextMatch.trim(),
          textMatchType: formTextMatchType,
          pathPattern: formPathPattern.trim() || "*",
          value: parseFloat(formValue) || 0,
        }),
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setRules(json.eventRules || []);
        setShowCreateModal(false);
        // Reset form
        setFormName("");
        setFormSelector("");
        setFormTextMatch("");
        setFormPathPattern("*");
        setFormValue("0");
        setRuleMessage("No-code event rule created and deployed instantly.");
        setTimeout(() => setRuleMessage(null), 4000);
      } else {
        alert(json.error || "Failed to create event rule.");
      }
    } catch (err: any) {
      alert(err.message || "Network error creating rule.");
    } finally {
      setSavingRule(false);
    }
  };

  const handleToggleRule = async (ruleId: string, currentEnabled: boolean) => {
    if (!activeProjectId) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/event-rules`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId,
          enabled: !currentEnabled,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.eventRules) {
          setRules(json.eventRules);
        }
      }
    } catch (e) {
      console.error("Failed to toggle rule:", e);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!activeProjectId || !confirm("Are you sure you want to delete this custom event rule?")) return;
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/event-rules`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.eventRules) {
          setRules(json.eventRules);
        }
      }
    } catch (e) {
      console.error("Failed to delete rule:", e);
    }
  };

  const allEvents = data?.recentEvents || [];

  const filteredEvents = allEvents.filter((evt) => {
    const matchesSearch =
      !searchQuery ||
      evt.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.pathname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const isAutotrack = evt.category === "autotrack" || evt.eventName.startsWith("autotrack_");
    const isNoCodeRule = evt.category === "no_code_rule" || evt.properties?.triggerSource === "no_code_dashboard_rule";
    const isSdk = !isAutotrack && !isNoCodeRule;

    if (selectedCategory === "autotrack") return matchesSearch && isAutotrack;
    if (selectedCategory === "rules") return matchesSearch && isNoCodeRule;
    if (selectedCategory === "sdk") return matchesSearch && isSdk;

    return matchesSearch;
  });

  // Calculate KPIs
  const totalEventsCount = allEvents.length;
  const uniqueEventNames = new Set(allEvents.map((e) => e.eventName)).size;
  const totalMonetaryValue = allEvents.reduce((acc, curr) => acc + (typeof curr.value === "number" ? curr.value : 0), 0);
  const activeRulesCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      {/* ── Top Metric KPI Summary Gauges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-black uppercase tracking-wider">
            <span>Total Events</span>
            <Activity size={14} className="text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {totalEventsCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">In active timeframe</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-black uppercase tracking-wider">
            <span>Event Types</span>
            <Layers size={14} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {uniqueEventNames}
          </div>
          <p className="text-[11px] text-muted-foreground">Unique event signatures</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-black uppercase tracking-wider">
            <span>Active No-Code Rules</span>
            <Sliders size={14} className="text-purple-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {activeRulesCount} <span className="text-xs text-muted-foreground font-normal">/ {rules.length}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Zero-code rules running</p>
        </div>

        <div className="p-4 bg-card border border-border rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-black uppercase tracking-wider">
            <span>Conversion Value</span>
            <DollarSign size={14} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono text-emerald-600 dark:text-emerald-400">
            ${totalMonetaryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground">Attributed revenue</p>
        </div>
      </div>

      {ruleMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{ruleMessage}</span>
        </div>
      )}

      {/* ── Main Hub Container ── */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-2 p-1 bg-muted/60 border border-border rounded-2xl">
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "stream"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity size={14} />
              <span>Events Stream ({filteredEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("rules")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "rules"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders size={14} />
              <span>No-Code Event Rules ({rules.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "rules" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition shadow-xs"
              >
                <Plus size={15} />
                <span>Create No-Code Event</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Tab 1: Events Stream ── */}
        {activeTab === "stream" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: "all", label: "All Events" },
                  { id: "autotrack", label: "Autotracked Clicks & Forms" },
                  { id: "rules", label: "No-Code Rules" },
                  { id: "sdk", label: "Programmatic SDK" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategory(pill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      selectedCategory === pill.id
                        ? "bg-muted text-foreground border border-border"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter events, path, signature..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="p-12 text-center text-xs text-muted-foreground space-y-2 border border-dashed border-border rounded-2xl">
                  <Activity size={24} className="mx-auto text-muted-foreground/50" />
                  <p className="font-bold text-foreground">No events recorded matching criteria.</p>
                  <p>Open Analytics autotracks clicks, buttons, forms, and custom rules automatically.</p>
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  const isAutotrack = evt.category === "autotrack" || evt.eventName.startsWith("autotrack_");
                  const isNoCodeRule = evt.category === "no_code_rule" || evt.properties?.triggerSource === "no_code_dashboard_rule";

                  return (
                    <div
                      key={evt._id}
                      className="p-4 bg-muted/20 border border-border rounded-2xl space-y-3 hover:border-border/80 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold font-mono text-xs">
                            {evt.eventName}
                          </span>

                          {isAutotrack && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg font-mono text-[10px] font-bold">
                              Autotrack
                            </span>
                          )}

                          {isNoCodeRule && (
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-lg font-mono text-[10px] font-bold">
                              No-Code Rule
                            </span>
                          )}

                          {!isAutotrack && !isNoCodeRule && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg font-mono text-[10px] font-bold">
                              SDK
                            </span>
                          )}

                          {typeof evt.value === "number" && evt.value > 0 && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono font-bold text-[11px] rounded-lg">
                              +${evt.value.toFixed(2)}
                            </span>
                          )}

                          {evt.pathname && (
                            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                              <span>Path:</span>
                              <code className="text-foreground">{evt.pathname}</code>
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-xs font-bold text-foreground flex items-center gap-1 justify-end">
                            <Clock size={11} className="text-primary" />
                            <span>{formatExactTime(evt.createdAt)}</span>
                          </div>
                          <div className="text-[10px] font-mono text-muted-foreground">
                            <span>{timeAgo(evt.createdAt)}</span> &bull; <span>{formatExactDate(evt.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payload toggle */}
                      {evt.properties && Object.keys(evt.properties).length > 0 && (
                        <div className="pt-1">
                          <button
                            onClick={() =>
                              setExpandedEventId(expandedEventId === evt._id ? null : evt._id)
                            }
                            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>
                              {expandedEventId === evt._id ? "Hide Event Payload" : "Inspect Payload & Metadata"}
                            </span>
                            {expandedEventId === evt._id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>

                          {expandedEventId === evt._id && (
                            <pre className="mt-2 p-3 bg-background border border-border text-foreground font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
                              {JSON.stringify(evt.properties, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── Tab 2: No-Code Event Rules Manager ── */}
        {activeTab === "rules" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Active No-Code Event Trigger Rules
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  These rules are evaluated in real-time on your live website. When a visitor clicks a matching button or submits a form, Open Analytics records the event automatically.
                </p>
              </div>

              <button
                onClick={fetchRules}
                disabled={loadingRules}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-muted-foreground hover:text-foreground transition"
                title="Refresh Rules"
              >
                <RefreshCw size={14} className={loadingRules ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Rules List */}
            {rules.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground space-y-3 border border-dashed border-border rounded-2xl">
                <Sliders size={28} className="mx-auto text-muted-foreground/50" />
                <div className="space-y-1">
                  <p className="font-bold text-foreground">No custom event rules configured yet.</p>
                  <p className="max-w-md mx-auto">
                    Create your first rule to automatically track clicks on buttons (e.g. &quot;Sign Up&quot;, &quot;Buy Now&quot;) or form submissions without modifying any code.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus size={14} />
                  <span>Create First Event Rule</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {rules.map((rule) => {
                  return (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-2xl border transition ${
                        rule.enabled
                          ? "bg-card border-border hover:border-border/80"
                          : "bg-muted/30 border-border/50 opacity-60"
                      } space-y-3`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleRule(rule.id, rule.enabled)}
                            className="text-muted-foreground hover:text-foreground transition"
                            title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                          >
                            {rule.enabled ? (
                              <ToggleRight size={26} className="text-emerald-500" />
                            ) : (
                              <ToggleLeft size={26} className="text-muted-foreground" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-xs text-foreground">
                                {rule.name}
                              </span>
                              <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md font-mono text-[10px] font-bold uppercase">
                                {rule.triggerType.replace("_", " ")}
                              </span>
                              {typeof rule.value === "number" && rule.value > 0 && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md font-mono text-[10px] font-bold">
                                  +${rule.value.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1 flex-wrap">
                              {rule.selector && (
                                <span>
                                  Selector: <code className="text-primary font-mono">{rule.selector}</code>
                                </span>
                              )}
                              {rule.textMatch && (
                                <span>
                                  Text {rule.textMatchType}: <code className="text-foreground font-mono">&quot;{rule.textMatch}&quot;</code>
                                </span>
                              )}
                              <span>
                                Path: <code className="text-muted-foreground font-mono">{rule.pathPattern || "*"}</code>
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition self-end sm:self-center"
                          title="Delete Rule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create No-Code Event Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground">Create No-Code Custom Event</h3>
                  <p className="text-xs text-muted-foreground">Automatically track user actions without changing website code</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              {/* Event Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Event Signature Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. signup_cta_clicked or enterprise_demo_request"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                />
              </div>

              {/* Trigger Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Trigger Event Type:
                </label>
                <select
                  value={formTriggerType}
                  onChange={(e) => setFormTriggerType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
                >
                  <option value="click">Button / Element Click</option>
                  <option value="form_submit">Form Submission</option>
                  <option value="pageview">Specific URL Path Visit</option>
                  <option value="file_download">File Download</option>
                  <option value="scroll_depth">Scroll Depth Reach</option>
                  <option value="outbound_link">Outbound External Link Click</option>
                </select>
              </div>

              {/* Target Matching (CSS Selector & Text) */}
              {formTriggerType === "click" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground block">
                      CSS Selector (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #hero-signup or .btn-cta"
                      value={formSelector}
                      onChange={(e) => setFormSelector(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground block">
                      Button / Label Text:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Start Free Trial"
                      value={formTextMatch}
                      onChange={(e) => setFormTextMatch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {formTriggerType === "form_submit" && (
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    Form ID or CSS Selector:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #newsletter-form or form[action='/api/signup']"
                    value={formSelector}
                    onChange={(e) => setFormSelector(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>
              )}

              {/* Path Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    Target Page Path:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /pricing, /checkout/* or *"
                    value={formPathPattern}
                    onChange={(e) => setFormPathPattern(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    Conversion Value ($ USD):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-2xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRule || !formName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {savingRule ? (
                    <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Deploy Event Rule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
