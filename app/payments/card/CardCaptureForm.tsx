"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";

type StripeLike = {
  elements: (options: { clientSecret: string; appearance?: object }) => ElementsLike;
  confirmSetup: (options: {
    elements: ElementsLike;
    clientSecret: string;
    confirmParams: {
      return_url: string;
      payment_method_data?: {
        billing_details?: {
          name?: string;
          email?: string;
          phone?: string;
        };
      };
    };
    redirect: "if_required";
  }) => Promise<{ error?: { message?: string }; setupIntent?: { id: string } }>;
};

type ElementsLike = {
  create: (type: "payment", options?: object) => StripeElementLike;
  submit: () => Promise<{ error?: { message?: string } }>;
};

type StripeElementLike = {
  mount: (selector: string) => void;
  unmount: () => void;
  on: (event: "ready" | "loaderror", handler: (event?: { error?: { message?: string } }) => void) => void;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeLike;
  }
}

function loadStripeJs() {
  return new Promise<void>((resolve, reject) => {
    if (window.Stripe) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.stripe.com/v3/"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Stripe.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Stripe."));
    document.head.appendChild(script);
  });
}

export default function CardCaptureForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCard, setSavedCard] = useState<{
    brand: string;
    last4: string;
    expMonth: number | null;
    expYear: number | null;
  } | null>(null);
  const stripeRef = useRef<StripeLike | null>(null);
  const elementsRef = useRef<ElementsLike | null>(null);
  const paymentElementRef = useRef<StripeElementLike | null>(null);
  const clientSecretRef = useRef("");
  const setupIntentIdRef = useRef("");

  useEffect(() => {
    if (!ready || !elementsRef.current || paymentElementRef.current) return;

    const paymentElement = elementsRef.current.create("payment", {
      layout: "tabs",
      fields: {
        billingDetails: {
          name: "never",
          email: "never",
          phone: "never",
        },
      },
    });
    paymentElementRef.current = paymentElement;
    paymentElement.on("ready", () => setPaymentElementReady(true));
    paymentElement.on("loaderror", (event) => {
      setError(event?.error?.message || "Could not load the secure card form.");
    });
    paymentElement.mount("#payment-element");

    return () => {
      paymentElement.unmount();
      paymentElementRef.current = null;
      setPaymentElementReady(false);
    };
  }, [ready]);

  const startCardCapture = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/payments/setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Could not start card validation.");
      }

      await loadStripeJs();
      if (!window.Stripe) throw new Error("Stripe did not load.");

      const stripe = window.Stripe(body.publishableKey);
      const elements = stripe.elements({
        clientSecret: body.clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#E8476C",
            borderRadius: "8px",
          },
        },
      });

      stripeRef.current = stripe;
      elementsRef.current = elements;
      clientSecretRef.current = body.clientSecret;
      setupIntentIdRef.current = body.setupIntentId;
      setPaymentElementReady(false);
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start card validation.");
    } finally {
      setLoading(false);
    }
  };

  const saveCard = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const stripe = stripeRef.current;
      const elements = elementsRef.current;
      if (!stripe || !elements) {
        throw new Error("Card form is not ready yet.");
      }

      const submitResult = await elements.submit();
      if (submitResult.error) {
        throw new Error(submitResult.error.message || "Please check the card details.");
      }

      const result = await stripe.confirmSetup({
        elements,
        clientSecret: clientSecretRef.current,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              name,
              email,
              phone: phone || undefined,
            },
          },
        },
        redirect: "if_required",
      });

      if (result.error) {
        throw new Error(result.error.message || "Card validation failed.");
      }

      const setupIntentId = result.setupIntent?.id || setupIntentIdRef.current;
      const res = await fetch("/api/payments/setup-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupIntentId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Card validated, but could not be saved.");
      }
      setSavedCard(body.card);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save card.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8476C]/10 text-[#E8476C]">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E8476C]">
              Secure card validation
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-neutral-dark">
              Save a card on file
            </h1>
            <p className="mt-1 text-sm text-neutral-mid">
              This validates the card with Stripe and stores the saved payment
              method reference. No charge is made.
            </p>
          </div>
        </div>

        {savedCard ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} />
              Card saved
            </div>
            <p className="mt-1 text-sm">
              {savedCard.brand.toUpperCase()} ending in {savedCard.last4}
              {savedCard.expMonth && savedCard.expYear
                ? ` · expires ${savedCard.expMonth}/${savedCard.expYear}`
                : ""}
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={startCardCapture} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-dark">
                    Name on account
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={ready}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C] disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-dark">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={ready}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C] disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-dark">
                    Phone
                  </label>
                  <input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={ready}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C] disabled:bg-gray-50"
                  />
                </div>
              </div>

              {!ready && (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E8476C] py-3 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:opacity-50"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Preparing secure card form..." : "Continue to card"}
                </button>
              )}
            </form>

            {ready && (
              <form onSubmit={saveCard} className="mt-6 space-y-4">
                <div
                  id="payment-element"
                  className="min-h-[220px] rounded-lg border border-gray-200 p-3"
                />
                {!paymentElementReady && (
                  <p className="flex items-center gap-2 text-sm text-neutral-mid">
                    <Loader2 size={14} className="animate-spin" />
                    Loading secure card fields...
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving || !paymentElementReady}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E8476C] py-3 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Validating card..." : "Validate and save card"}
                </button>
              </form>
            )}
          </>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-start gap-2 border-t border-gray-100 pt-4 text-xs text-neutral-mid">
          <ShieldCheck size={15} className="mt-0.5 text-[#E8476C]" />
          <p>
            Card numbers and CVC codes are entered directly into Stripe. Humanity
            &amp; Blessings stores only the safe payment method reference and card summary.
          </p>
        </div>
      </div>
    </main>
  );
}
