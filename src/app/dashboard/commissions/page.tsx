"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type CommissionItem = {
  period_month?: string;
  gross_amount?: number;
  validated_enrollments?: number;
  status?: string;
  created_at?: string;
};

type CommissionsResponse = {
  commissions?: CommissionItem[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
};

export default function CommissionsPage() {
  const [payload, setPayload] = useState<CommissionsResponse | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiRequest<CommissionsResponse>(`/me/commissions?page=${page}&per_page=10`, {}, true).then((res) => {
      if (res.error) setError(res.error);
      else setPayload(res.data ?? null);
    });
  }, [page]);

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6">
      <h1 className="text-xl font-semibold text-[#0b2e7a]">Commissions</h1>
      <p className="mt-1 text-sm text-slate-600">Total enregistrements: {payload?.meta?.total ?? 0}</p>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-3">Période</th>
              <th className="py-2 pr-3">Montant brut</th>
              <th className="py-2 pr-3">Inscriptions validées</th>
              <th className="py-2 pr-3">Statut</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {(payload?.commissions ?? []).map((item, index) => (
              <tr key={`${item.period_month ?? "period"}-${index}`} className="border-b border-slate-100">
                <td className="py-2 pr-3">{item.period_month || "-"}</td>
                <td className="py-2 pr-3">{(item.gross_amount ?? 0).toLocaleString("fr-FR")} FCFA</td>
                <td className="py-2 pr-3">{item.validated_enrollments ?? 0}</td>
                <td className="py-2 pr-3 capitalize">{item.status || "-"}</td>
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
      {(payload?.commissions?.length ?? 0) === 0 ? <p className="mt-3 text-sm text-slate-600">Aucune commission pour le moment.</p> : null}
    </div>
  );
}
