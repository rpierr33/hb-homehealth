type StripeRequestOptions = {
  method?: "GET" | "POST";
  body?: URLSearchParams;
};

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

async function stripeRequest<T>(
  path: string,
  options: StripeRequestOptions = {}
): Promise<T> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: options.body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error?.message || `Stripe request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export type StripeCustomer = {
  id: string;
};

export type StripeSetupIntent = {
  id: string;
  client_secret: string;
  status: string;
  customer: string;
  payment_method?: string | StripePaymentMethod | null;
};

export type StripePaymentMethod = {
  id: string;
  card?: {
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  };
};

export async function createStripeCustomer(input: {
  name: string;
  email: string;
  phone?: string;
}) {
  const body = new URLSearchParams();
  body.set("name", input.name);
  body.set("email", input.email);
  if (input.phone) body.set("phone", input.phone);

  return stripeRequest<StripeCustomer>("/customers", {
    method: "POST",
    body,
  });
}

export async function createCardSetupIntent(input: {
  customerId: string;
  customerEmail: string;
}) {
  const body = new URLSearchParams();
  body.set("customer", input.customerId);
  body.set("payment_method_types[]", "card");
  body.set("usage", "off_session");
  body.set("metadata[source]", "hb_card_capture_page");
  body.set("metadata[customer_email]", input.customerEmail);

  return stripeRequest<StripeSetupIntent>("/setup_intents", {
    method: "POST",
    body,
  });
}

export async function retrieveSetupIntent(setupIntentId: string) {
  const params = new URLSearchParams();
  params.set("expand[]", "payment_method");
  return stripeRequest<StripeSetupIntent>(
    `/setup_intents/${setupIntentId}?${params.toString()}`
  );
}
