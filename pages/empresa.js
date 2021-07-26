import { getSession } from "next-auth/client";
import { connectToDatabase } from "../util/mongodb";

import HeaderCompany from "../components/HeaderCompany";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import CompanyEmployees from "../components/CompanyEmployees";

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

export default function Empresa({ user, jobs, employees }) {
  if (!user.code) {
    return <OnboardingCode />;
  }

  return (
    <>
      <div className="relative bg-gray-50 overflow-hidden min-h-screen">
        <HeaderCompany page="empresa" />
        <div className=" mx-auto mt-10 max-w-5xl">
          <CompanyEmployees employees={employees} jobs={jobs} />
          <div className="flex items-center justify-between space-x-6 mx-4 lg:mx-0 mt-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm text-center  leading-7 text-gray-600 sm:text-base  sm:truncate">
                Solicita a tus empleados que se unan a Horario.io con el código
                de empresa {user.code}
              </h2>
            </div>
          </div>
        </div>
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
    .find({ code: user.code })
    .sort({ date: 1 })
    .toArray();

  const employees = await db
    .collection("users")
    .find({ code: user.code })
    .toArray();

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      jobs: JSON.parse(JSON.stringify(jobs)),
      employees: JSON.parse(JSON.stringify(employees)),
    },
  };
}
