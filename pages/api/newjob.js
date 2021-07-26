import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/mongodb";

export default async function newjob(req, res) {
  const {
    body: { mode },
  } = req;

  if (!mode || (mode !== "start" && mode !== "stop")) {
    return res.status(403).json({ message: "Set up a mode (start or stop)" });
  }

  const session = await getSession({ req });
  if (!session) {
    // Not Signed in
    return res.status(401).json({ message: "You are not singed in" });
  }

  const { db } = await connectToDatabase();

  let user;
  try {
    user = await db.collection("users").findOne({ email: session.user.email });
    if (!user || !user.code) {
      return res
        .status(403)
        .json({ message: "User not found or doesnt have a company code" });
    }
  } catch (error) {
    return res.status(403).json({ message: "User not found" });
  }

  const newJob = await db.collection("jobs").insertOne({
    email: session.user.email,
    date: new Date(),
    mode,
    code: user.code,
  });

  res.status(200).json({ newJob });
}
