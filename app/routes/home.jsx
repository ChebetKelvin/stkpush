import { Form, redirect } from "react-router"; // Fixed import
import { stkPush, normalizePhone } from "../.server/stkpush";
import { getSession, commitSession } from "../.server/session";
import { addPayments } from "../model/payment";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let phone = normalizePhone(formData.get("phone"));
  let amount = formData.get("amount");

  let safResonse = await stkPush({ phone, amount }); // Moved inside function

  if (safResonse.errorCode) return redirect("/home");

  session.set("phone", phone);
  session.set("amount", amount);
  session.set("checkoutId", safResonse.CheckoutRequestID);

  // Optionally add payment record
  await addPayments({
    phone,
    amount,
    checkoutId: safResonse.CheckoutRequestID,
    createdAt: new Date(),
    status: "pending",
  });

  return redirect("/success", {
    headers: {
      "Set-Cookie": await commitSession(session), // Fixed commitSession usage
    },
  });
}

export default function onlinePayment() {
  return (
    <main className="max-w-5xl mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl text-green-400 font-bold underline">
        Online Payment
      </h1>
      <div className="flex flex-col items-center justify-center mt-8">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMPGxi5WoE0uLWHpT-C-km3qDaueN7WpTVlQ&s"
          alt="mpesa logo"
          className="w-full h-32 mb-4 rounded-lg"
        />

        <Form method="post" className="w-full max-w-md">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="number"
            name="phone"
            required
            placeholder="Enter mobile number"
            className="px-2 py-1 border border-gray-300  text-black rounded mb-4 w-full"
          />

          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            required
            placeholder="Enter amount"
            className="px-2 py-1 border border-gray-300 text-black rounded mb-4 w-full"
          />

          <button
            type="submit"
            className="w-full px-2 py-1 text-blue-50 bg-green-500 hover:bg-black hover:text-white rounded-2xl hover:border-2 hover:border-green-500 transition duration-300 ease-in-out"
          >
            Pay
          </button>
        </Form>
      </div>
    </main>
  );
}
