import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  const { componentType, data, id } = req.body;

  if (req.method === "PUT") {
    const user = await User.findOneAndUpdate(
      { username: id }, // Filter to find the document
      { $set: { [`components.${componentType}`]: data } }, // Update operation
      { new: true }, // Option to return the updated document
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
