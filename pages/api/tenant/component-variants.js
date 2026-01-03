import ComponentVariant from "@/models/ComponentVariant";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  const { componentType, data } = req.body;

  if (req.method === "POST") {
    const variant = await ComponentVariant.findOneAndUpdate(
      { componentType },
      { data },
      { upsert: true, new: true },
    );
    return res.status(200).json(variant);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
