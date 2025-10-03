// routes/success.jsx
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export async function loader({ request }) {
  let url = new URL(request.url);
  // just return empty, session is used for checkoutId
  return {};
}

export default function Success() {
  let navigate = useNavigate();
  let [status, setStatus] = useState("pending");
  let [details, setDetails] = useState(null);

  useEffect(() => {
    let timer = setInterval(async () => {
      let res = await fetch("/payment-status");
      let data = await res.json();

      if (data?.resultCode === 0) {
        setStatus("success");
        setDetails(data);
        clearInterval(timer);
      } else if (data?.resultCode) {
        setStatus("failed");
        setDetails(data);
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  if (status === "pending") {
    return (
      <p className="p-6 text-lg">⏳ Waiting for payment confirmation...</p>
    );
  }

  if (status === "success") {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">✅ Payment Successful</h2>
        <p>Amount: {details.amount}</p>
        <p>Receipt: {details.receipt}</p>
        <p>Transaction Date: {details.txDate}</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">❌ Payment Failed</h2>
        <p>{details.resultDesc}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
}
