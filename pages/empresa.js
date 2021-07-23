import { signIn, signOut, getSession } from "next-auth/client";
import { connectToDatabase } from "../util/mongodb";

import HeaderWorker from "../components/HeaderWorker";
import HeaderCompany from "../components/HeaderCompany";

import clientAxios from "../config/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "en %s",
    past: "hace %s",
    s: "pocos segundos",
    m: "1 minuto",
    mm: "%d minutos",
    h: "una hora",
    hh: "%d horas",
    d: "1 día",
    dd: "%d días",
    M: "1 mes",
    MM: "%d meses",
    y: "1 año",
    yy: "%d años",
  },
});

import OnboardingCode from "../components/OnboardingCode";

import { FingerPrintIcon } from "@heroicons/react/solid";

export default function Empresa({ user, jobs }) {
  if (!user.code) {
    return <OnboardingCode />;
  }

  return (
    <>
      <div className="relative bg-gray-50 overflow-hidden min-h-screen">
        {user.company ? <HeaderCompany page="empresa" /> : <HeaderWorker />}
        <div className=" text-center mx-auto mt-36 max-w-lg">hola</div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const { db } = await connectToDatabase();

  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  const jobs = await db
    .collection("jobs")
    .find({ email: session.user.email })
    .sort({ date: 1 })
    .toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      jobs: JSON.parse(JSON.stringify(jobs)),
    },
  };
}
