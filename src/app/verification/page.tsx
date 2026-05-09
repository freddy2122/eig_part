"use client";

import { FormEvent, useState } from "react";
import { apiRequest, setToken } from "@/lib/api";
import { useClientSearchParamsSnapshot } from "@/lib/useClientSearchParamsSnapshot";

type VerifyResponse = {
  token?: string;
  message?: string;
};

export default function VerificationPage() {
  const searchParams = useClientSearchParamsSnapshot();
  const emailFromUrl = searchParams.get("email") ?? "";
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await apiRequest<VerifyResponse>("/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    if (res.error) {
      setMessage(res.error);
      return;
    }
    if (res.data?.token) {
      setToken(res.data.token);
      setMessage("Compte valide, token enregistre. Va sur /dashboard.");
    } else {
      setMessage(res.data?.message ?? "Verification terminee.");
    }
  }

  return (
    <div className="max-w-md rounded-xl bg-white border border-slate-200 p-6">
      <h1 className="text-xl font-semibold">Verification du compte</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded px-3 py-2" type="email" value={email || emailFromUrl} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Code 6 chiffres" value={code} onChange={(e) => setCode(e.target.value)} required />
        <button className="rounded bg-indigo-600 text-white px-4 py-2" type="submit">
          Verifier
        </button>
      </form>
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
    </div>
  );
}
