import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/mongodb";

export default async function newcompany(req, res) {
  const session = await getSession({ req });
  if (!session) {
    // Not Signed in
    return res.status(401).json({ message: "You are not singed in" });
  }

  const { db } = await connectToDatabase();
  const companyByEmail = await db
    .collection("companies")
    .findOne({ email: session.user.email });

  if (companyByEmail) {
    return res
      .status(403)
      .json({ message: "You cant create more than one company" });
  }

  let options = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "Y",
    "Z",
  ];
  let code;
  let validCode = false;

  while (!validCode) {
    code = "";
    for (let i = 0; i < 4; i++) {
      code = code + options[Math.floor(Math.random() * options.length)];
    }
    const companyByCode = await db.collection("companies").findOne({ code });
    if (!companyByCode) {
      validCode = true;
    }
  }

  await db
    .collection("companies")
    .insertOne({ code, email: session.user.email });

  //The creator of the company is also a worker in the company
  await db.collection("users").updateOne(
    { email: session.user.email },
    {
      $set: { code, company: true },
    }
  );

  res.status(200).json({ code });
}
