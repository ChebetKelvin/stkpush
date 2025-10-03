import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("payment-status", "routes/payment-status.jsx"),
  route("mpesa", "routes/mpesa.jsx"),
  route("success", "routes/success.jsx"),
];
