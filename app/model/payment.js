import { client } from "../.server/mongo";

let db = client.db("onlinePayment");
let collection = db.collection("payments");

export async function addPayments(payment) {
  return await collection.insertOne(payment);
}

export async function updateLatestPayment(checkoutId, updateData) {
  return await collection.findOneAndUpdate(
    { checkoutId: String(checkoutId) },
    { $set: { ...updateData, updatedAt: new Date() } },
    { sort: { createdAt: -1 }, returnDocument: "after", upsert: true }
  );
}

export async function getPaymentByCheckoutId(checkoutId) {
  return await collection.findOne({ checkoutId: String(checkoutId) });
}
