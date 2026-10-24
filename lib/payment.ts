import { pricing } from "@/data/site"
import type { ApplicationInput } from "@/lib/validations/apply"

type PaymentRequest = {
  applicationId: string
  applicant: Pick<ApplicationInput, "fullName" | "email" | "phone">
}

/**
 * ============================================================
 *  PLACEHOLDER — Razorpay checkout goes here.
 * ============================================================
 *
 * Right now this resolves immediately so the flow can be tested
 * end to end. To integrate Razorpay:
 *
 * 1. Server: add a route (e.g. /api/payments/order) that creates an
 *    order with the Razorpay Node SDK using RAZORPAY_KEY_ID /
 *    RAZORPAY_KEY_SECRET. Amount is in paise:
 *      razorpay.orders.create({ amount: pricing.price * 100, currency: "INR", receipt: applicationId })
 *
 * 2. Client: load https://checkout.razorpay.com/v1/checkout.js
 *    (e.g. with next/script) and open checkout here:
 *      const rzp = new window.Razorpay({
 *        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
 *        order_id,
 *        amount: pricing.price * 100,
 *        currency: "INR",
 *        name: "Devio Tech",
 *        prefill: { name: applicant.fullName, email: applicant.email, contact: applicant.phone },
 *        handler: (response) => { ...step 3... },
 *      })
 *      rzp.open()
 *
 * 3. Server: verify razorpay_signature (HMAC SHA256 of
 *    `${order_id}|${payment_id}` with the key secret) before marking
 *    the application as paid. Never trust the client alone.
 *
 * Reject the returned promise if the user dismisses checkout or the
 * payment fails, so the form can show an error toast.
 */
export async function handlePayment({ applicationId, applicant }: PaymentRequest): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[handlePayment] placeholder — skipping Razorpay checkout", {
      applicationId,
      email: applicant.email,
      amount: pricing.price,
    })
  }
}
