import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/mongodb";

export default async function updatecode(req, res) {
  const {
    body: { code },
  } = req;

  if (!code || code.length !== 4) {
    return res.status(403).json({ message: "Código incorrecto" });
  }

  const session = await getSession({ req });
  if (!session) {
    // Not Signed in
    return res.status(401).json({ message: "You are not singed in" });
  }

  const { db } = await connectToDatabase();

  let codeExists = await db.collection("companies").findOne({ code });

  if (!codeExists) {
    return res.status(403).json({ message: "Código incorrecto" });
  }

  let userUpdateCode = await db.collection("users").updateOne(
    { email: session.user.email },
    {
      $set: { code },
    }
  );

  res.status(200).json({ message: "success" });
}
