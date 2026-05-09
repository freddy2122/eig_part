"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type PayoutItem = {
  amount?: number;
  status?: string;
  provider?: string;
  method?: string;
  provider_reference?: string;
  provider_ref?: string;
  created_at?: string;
};

type PayoutsResponse = {
  payouts?: PayoutItem[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
};

type EligibilityResponse = {
  eligible_count?: number;
  eligible_total_xof?: number;
  commissions?: Array<{ id: number; period_month?: string; gross_amount?: number }>;
  blockers?: {
    email_verification_required?: boolean;
    payment_profile_incomplete?: boolean;
  };
};

type RequestPayoutResponse = {
  message?: string;
  count?: number;
};

export default function PaiementsPage() {
  const [payload, setPayload] = useState<PayoutsResponse | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const reloadAll = useCallback(() => {
    apiRequest<PayoutsResponse>(`/me/payouts?page=${page}&per_page=10`, {}, true).then((res) => {
      if (res.error) setError(res.error);
      else {
        setError("");
        setPayload(res.data ?? null);
      }
    });
    apiRequest<EligibilityResponse>("/me/payout-eligibility", {}, true).then((res) => {
      if (!res.error) setEligibility(res.data ?? null);
    });
  }, [page]);

  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  async function requestWithdrawal() {
    setActionMsg("");
    setLoading(true);
    const res = await apiRequest<RequestPayoutResponse>(
      "/me/payout-requests",
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      true,
    );
    setLoading(false);

    if (res.error) {
      setActionMsg(res.error);
      return;
    }
    setActionMsg(res.data?.message ?? "Demande enregistrée.");
    reloadAll();
  }

  const blockers = eligibility?.blockers;
  const blocked =
    (blockers?.email_verification_required ?? false) ||
    (blockers?.payment_profile_incomplete ?? false);

  const canRequest =
    (eligibility?.eligible_count ?? 0) > 0 && !blocked;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-[#0b2e7a]">Retraits & versements commissions</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Lorsque l&apos;administration a{" "}
          <strong className="text-slate-800">approuvé</strong> vos commissions, vous pouvez lancer ici les retraits&nbsp;: le
          système utilise le <strong>même processus automatique que le back-office</strong> (FedaPay — transferts), puis vérifie
          régulièrement le statut côté fournisseur. Vous recevez aussi une notification quand un retrait est confirmé ou
          refusé.
        </p>

        <div className="mt-5 rounded-xl border border-[#d7e7ff] bg-[#f5f9ff] p-4">
          <p className="text-sm font-semibold text-[#0b2e7a]">Solde disponible au retrait</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {(eligibility?.eligible_total_xof ?? 0).toLocaleString("fr-FR")} FCFA
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {eligibility?.eligible_count ?? 0} commission(s) au statut «&nbsp;approuvé&nbsp;» sans paiement encore engagé
          </p>

          {blockers?.email_verification_required ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Vérification obligatoire : confirmez votre adresse e-mail ({""}
              <Link href="/verification" className="font-semibold text-[#0b2e7a] underline">
                page Vérification
              </Link>
              ).
            </p>
          ) : null}

          {blockers?.payment_profile_incomplete ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Complétez votre numéro de téléphone (Mobile Money / FedaPay) dans votre profil partenaire.{" "}
              <Link href="/dashboard/profil" className="font-semibold text-[#0b2e7a] underline">
                Mon profil
              </Link>
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canRequest || loading}
              onClick={requestWithdrawal}
              className="inline-flex items-center justify-center rounded-lg bg-[#0b2e7a] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0b2e7a]/20 hover:bg-[#092563] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Envoi en cours…" : "Demander le retrait (tout le montant disponible)"}
            </button>
            <Link
              href="/dashboard/commissions"
              className="text-sm font-medium text-[#0b2e7a] underline decoration-[#14aee5]/40 underline-offset-2 hover:decoration-[#14aee5]"
            >
              Voir mes commissions (statuts)
            </Link>
          </div>

          {actionMsg ? (
            <p
              role="status"
              className={`mt-4 rounded-lg px-3 py-2 text-sm ${actionMsg.toLowerCase().includes("aucune") || actionMsg.includes("erreur") || actionMsg.length > 200 ? "border border-amber-200 bg-amber-50 text-amber-900" : "border border-emerald-200 bg-emerald-50 text-emerald-900"}`}
            >
              {actionMsg}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-[#0b2e7a]">Historique des virements</h2>
        <p className="mt-1 text-sm text-slate-600">Total enregistré : {payload?.meta?.total ?? 0}</p>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-3">Montant</th>
                <th className="py-2 pr-3">Méthode</th>
                <th className="py-2 pr-3">Référence</th>
                <th className="py-2 pr-3">Statut</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {(payload?.payouts ?? []).map((item, index) => (
                <tr key={`${item.provider_reference ?? item.provider_ref ?? "payout"}-${index}`} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{(item.amount ?? 0).toLocaleString("fr-FR")} FCFA</td>
                  <td className="py-2 pr-3 capitalize">{item.method ?? item.provider ?? "-"}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{item.provider_reference ?? item.provider_ref ?? "-"}</td>
                  <td className="py-2 pr-3 capitalize">{item.status ?? "-"}</td>
                  <td className="py-2">{item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {payload?.meta?.current_page ?? page} / {payload?.meta?.last_page ?? 1}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={(payload?.meta?.current_page ?? page) <= 1}
            >
              Précédent
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={(payload?.meta?.current_page ?? page) >= (payload?.meta?.last_page ?? 1)}
            >
              Suivant
            </button>
          </div>
        </div>
        {(payload?.payouts?.length ?? 0) === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Aucun paiement encore enregistré.</p>
        ) : null}
      </div>
    </div>
  );
}
