import { data } from "react-router";
import { getPaymentByCheckoutId } from "../model/payment.js";
import { getSession } from "../.server/session.js";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let checkoutId = session.get("checkoutId");

  if (!checkoutId) {
    return data({ error: "Missing checkoutId" }, { status: 400 });
  }

  let payment = await getPaymentByCheckoutId(checkoutId);
  return data(payment || { status: "pending" });
}
