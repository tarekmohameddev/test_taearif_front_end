import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbConnect();

  const { websiteName } = req.body;
  if (!websiteName) {
    return res.status(400).json({ message: "websiteName is required" });
  }

  try {
    const userDoc = await User.findOne({ username: websiteName }).select(
      "-password -phoneNumber",
    );
    if (!userDoc) {
      return res.status(204).json({ message: "Tenant not found" });
    }
    // Return componentSettings directly without creating pages object
    const obj = userDoc.toObject
      ? userDoc.toObject({ flattenMaps: true })
      : userDoc;

    return res.status(200).json(obj);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
