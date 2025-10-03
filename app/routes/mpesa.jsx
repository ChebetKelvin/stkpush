import { data } from "react-router";
import { updateLatestPayment } from "../model/payment";

export async function action({ request }) {
  console.log(" M-PESA Callback Hit");

  let body = await request.json();
  console.log("Body received:", JSON.stringify(body, null, 2));

  let stk = body?.Body?.stkCallback;
  if (!stk) return data({ status: "ignored" });

  let { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = stk;
  let checkoutId = stk.CheckoutRequestID;

  let phone, amount, receipt, txDate;
  if (CallbackMetadata?.Item) {
    // Extract metadata
    CallbackMetadata.Item.forEach((item) => {
      if (item.Name === "PhoneNumber") phone = item.Value?.toString();
      if (item.Name === "Amount") amount = item.Value?.toString();
      if (item.Name === "MpesaReceiptNumber") receipt = item.Value;
      if (item.Name === "TransactionDate") txDate = formatTxDate(item.Value);
    });
  }
  function formatTxDate(raw) {
    if (!raw) return null;
    let str = raw.toString();
    let year = str.slice(0, 4);
    let month = str.slice(4, 6);
    let day = str.slice(6, 8);
    let hour = str.slice(8, 10);
    let minute = str.slice(10, 12);
    let second = str.slice(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // ToDo: the logs and updates arent running
  console.log("Updating payment with:", {
    phone,
    amount,
    receipt,
    txDate,
    resultCode: ResultCode,
    resultDesc: ResultDesc,
  });

  if (!checkoutId) {
    console.error("No CheckoutRequestID present in callback. Aborting update.");
    return data({ status: "missing_checkout_id" }, { status: 400 });
  }
  // Update pending payment
  let updateData = {
    checkoutId,
    phone,
    amount,
    receipt,
    txDate,
    resultCode: ResultCode,
    resultDesc: ResultDesc,
  };
  let result = await updateLatestPayment(checkoutId, updateData);
  console.log(" Mongo Update Result:", result);
  console.log(` Payment updated for ${phone}`);
  console.log(` Payment updated for ${CheckoutRequestID}`);
  return data({ status: "ok" });
}
