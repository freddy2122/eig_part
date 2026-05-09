"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { BellRing, Copy, GripVertical, Link as LinkIcon, MousePointerClick, TrendingUp, UserCheck, Users } from "lucide-react";

type DashboardResponse = {
  kpis?: {
    clicks: number;
    leads: number;
    validated_enrollments: number;
    total_commission: number;
  };
};

type ReferralLinkResponse = {
  referral_link?: {
    code?: string;
    url?: string;
    destination_url?: string;
  };
  code?: string;
  url?: string;
};

type ReferralsResponse = {
  leads?: Array<{ full_name?: string; created_at?: string }>;
};

type CommissionsResponse = {
  commissions?: Array<{ status?: string; gross_amount?: number; created_at?: string }>;
};

type WidgetKey = "kpis" | "chart" | "referral" | "goal" | "notifications";
const DEFAULT_WIDGET_ORDER: WidgetKey[] = ["kpis", "chart", "referral", "goal", "notifications"];
const WIDGET_ORDER_EVENT = "dashboard-widget-order-change";
let cachedWidgetOrderRaw: string | null = null;
let cachedWidgetOrderValue: WidgetKey[] = DEFAULT_WIDGET_ORDER;

function readWidgetOrderSnapshot(): WidgetKey[] {
  const stored = window.localStorage.getItem("dashboard_widget_order");
  if (!stored) {
    cachedWidgetOrderRaw = null;
    cachedWidgetOrderValue = DEFAULT_WIDGET_ORDER;
    return cachedWidgetOrderValue;
  }
  if (stored === cachedWidgetOrderRaw) {
    return cachedWidgetOrderValue;
  }

  try {
    const parsed = JSON.parse(stored) as WidgetKey[];
    cachedWidgetOrderRaw = stored;
    cachedWidgetOrderValue = parsed.length ? parsed : DEFAULT_WIDGET_ORDER;
    return cachedWidgetOrderValue;
  } catch {
    cachedWidgetOrderRaw = stored;
    cachedWidgetOrderValue = DEFAULT_WIDGET_ORDER;
    return cachedWidgetOrderValue;
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [referralUrl, setReferralUrl] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const widgetOrder = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(WIDGET_ORDER_EVENT, onStoreChange as EventListener);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(WIDGET_ORDER_EVENT, onStoreChange as EventListener);
      };
    },
    readWidgetOrderSnapshot,
    () => DEFAULT_WIDGET_ORDER,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest<DashboardResponse>("/me/dashboard", {}, true),
      apiRequest<ReferralLinkResponse>("/me/referral-link", {}, true),
      apiRequest<ReferralsResponse>("/me/referrals?per_page=5", {}, true),
      apiRequest<CommissionsResponse>("/me/commissions?per_page=5", {}, true),
    ]).then(([dashboardRes, referralRes]) => {
      if (dashboardRes.error) {
        setError(dashboardRes.error);
      } else {
        setData(dashboardRes.data ?? null);
      }

      if (!referralRes.error && referralRes.data) {
        const code = referralRes.data.referral_link?.code ?? referralRes.data.code;
        if (code) {
          setReferralCode(code);
          const url = new URL("/formations", window.location.origin);
          url.searchParams.set("ref", code);
          setReferralUrl(url.toString());
        } else {
          setReferralUrl(`${window.location.origin}/formations`);
        }
      }
    }).then(async () => {
      const [recentLeads, recentCommissions] = await Promise.all([
        apiRequest<ReferralsResponse>("/me/referrals?per_page=5", {}, true),
        apiRequest<CommissionsResponse>("/me/commissions?per_page=5", {}, true),
      ]);

      const items: string[] = [];
      (recentLeads.data?.leads ?? []).slice(0, 3).forEach((lead) => {
        items.push(`Nouveau lead: ${lead.full_name ?? "Prospect"} (${formatDate(lead.created_at)})`);
      });
      (recentCommissions.data?.commissions ?? []).slice(0, 2).forEach((c) => {
        items.push(`Commission ${c.status ?? "en attente"}: ${(c.gross_amount ?? 0).toLocaleString("fr-FR")} FCFA`);
      });
      setNotifications(items);
    });
  }, []);

  const clicks = data?.kpis?.clicks ?? 0;
  const leads = data?.kpis?.leads ?? 0;
  const validated = data?.kpis?.validated_enrollments ?? 0;
  const commission = data?.kpis?.total_commission ?? 0;
  const conversionRate = leads > 0 ? Math.round((validated / leads) * 100) : 0;
  const monthlyGoal = 30;
  const goalProgress = Math.min(100, Math.round((validated / monthlyGoal) * 100));
  const chartData = [
    { label: "Clics", value: clicks, color: "bg-[#16aee5]" },
    { label: "Leads", value: leads, color: "bg-[#0b2e7a]" },
    { label: "Validés", value: validated, color: "bg-[#22c55e]" },
  ];
  const maxChartValue = Math.max(...chartData.map((x) => x.value), 1);

  const moveWidget = (index: number, direction: -1 | 1) => {
    const next = [...widgetOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    window.localStorage.setItem("dashboard_widget_order", JSON.stringify(next));
    window.dispatchEvent(new Event(WIDGET_ORDER_EVENT));
  };

  const widgetMap: Record<WidgetKey, React.ReactNode> = {
    kpis: (
      <section key="kpis" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Clics générés" value={String(clicks)} hint="Trafic entrant" icon={<MousePointerClick size={17} />} />
        <StatCard title="Leads collectés" value={String(leads)} hint="Prospects qualifiés" icon={<Users size={17} />} />
        <StatCard title="Inscriptions validées" value={String(validated)} hint="Conversions" icon={<UserCheck size={17} />} />
        <StatCard title="Commissions" value={`${commission}`} hint="Montant cumulé" icon={<TrendingUp size={17} />} />
      </section>
    ),
    chart: (
      <section key="chart" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-[#0b2e7a]">Évolution rapide</h3>
        <div className="mt-4 space-y-3">
          {chartData.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full ${item.color}`} style={{ width: `${Math.round((item.value / maxChartValue) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    referral: (
      <section key="referral" className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#0b2e7a]">Lien de parrainage</h3>
          <Link href="/dashboard/leads" className="text-sm font-medium text-[#0b2e7a] hover:underline">
            Voir mes leads
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Ce lien envoie directement vers les formations. Le filleul choisit sa formation puis complète une inscription multi-step.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex min-h-11 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
            <LinkIcon size={16} className="text-slate-400" />
            <span className="truncate">{referralUrl || "Lien en cours de chargement..."}</span>
          </div>
          <button
            type="button"
            disabled={!referralUrl}
            onClick={async () => {
              if (!referralUrl) return;
              await navigator.clipboard.writeText(referralUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b2e7a] px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Copy size={16} />
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full border border-[#cfe4ff] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#0b2e7a]">
            Code: {referralCode || "N/A"}
          </span>
        </div>
      </section>
    ),
    goal: (
      <section key="goal" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-[#0b2e7a]">Objectif mensuel</h3>
        <p className="mt-1 text-sm text-slate-600">
          {validated} / {monthlyGoal} inscriptions validées
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-[#0b2e7a]" style={{ width: `${goalProgress}%` }} />
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-500">{goalProgress}% atteint</p>
      </section>
    ),
    notifications: (
      <section key="notifications" className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <BellRing size={17} className="text-[#0b2e7a]" />
          <h3 className="text-base font-bold text-[#0b2e7a]">Centre de notifications</h3>
        </div>
        <div className="mt-3 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-600">Aucune nouvelle notification.</p>
          ) : (
            notifications.map((note, idx) => (
              <div key={`${note}-${idx}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {note}
              </div>
            ))
          )}
        </div>
      </section>
    ),
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#0b2e7a] to-[#1144a6] p-6 text-white">
        <p className="text-sm text-blue-100">Bienvenue sur votre espace partenaire</p>
        <h2 className="mt-1 text-2xl font-bold">Suivez vos performances en temps réel</h2>
        <p className="mt-2 max-w-2xl text-sm text-blue-100">
          Analysez vos clics, vos leads et vos commissions, puis partagez votre lien de parrainage pour accélérer vos conversions.
        </p>
      </section>

      {error ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</section>
      ) : null}

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
        <GripVertical size={14} />
        Widgets réordonnables (utilisez les boutons monter/descendre)
      </div>

      {widgetOrder.map((key, index) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => moveWidget(index, -1)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
            >
              Monter
            </button>
            <button
              type="button"
              onClick={() => moveWidget(index, 1)}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
            >
              Descendre
            </button>
          </div>
          {widgetMap[key]}
        </div>
      ))}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-[#0b2e7a]">Performance rapide</h3>
        <div className="mt-4 space-y-3">
          <MetricLine label="Taux de conversion" value={`${conversionRate}%`} />
          <MetricLine label="Leads / clic" value={clicks > 0 ? `${Math.round((leads / clicks) * 100)}%` : "0%"} />
          <MetricLine label="Validation / leads" value={leads > 0 ? `${conversionRate}%` : "0%"} />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/dashboard/commissions"
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Détails commissions
          </Link>
          <Link
            href="/dashboard/paiements"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#0b2e7a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#092563]"
          >
            Retrait des commissions (FedaPay)
          </Link>
        </div>
      </section>

      {!data?.kpis ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Chargement des statistiques...
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#0b2e7a]">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#e8f8ff] text-[#0b2e7a]">{icon}</div>
      </div>
    </article>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-[#0b2e7a]">{value}</span>
    </div>
  );
}

function formatDate(input?: string) {
  if (!input) return "date inconnue";
  return new Date(input).toLocaleDateString("fr-FR");
}
