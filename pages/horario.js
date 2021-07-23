import { signIn, signOut, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { connectToDatabase } from "../util/mongodb";
import { useState, useEffect } from "react";

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

export default function Horario({ user, jobs }) {
  const router = useRouter();

  let lastJob = jobs ? jobs[jobs.length - 1] : null;

  const [isWorking, setIsWorking] = useState(
    lastJob?.mode === "start" ? true : false
  );
  const [loading, setLoading] = useState(false);

  const [lastTime, setLastTime] = useState(lastJob?.date);

  const [timeWorking, setTimeWorking] = useState(dayjs(lastTime).fromNow());

  useEffect(() => {
    setTimeWorking(dayjs(lastTime).fromNow());
    const interval = setInterval(() => {
      setTimeWorking(dayjs(lastTime).fromNow());
    }, 1000);
    return () => clearInterval(interval);
  }, [lastTime]);

  if (!user.code) {
    return <OnboardingCode />;
  }

  let newJob = async (mode) => {
    try {
      setLoading(true);
      let response = await clientAxios.post("api/newjob", { mode });
      setLastTime(new Date());
      setIsWorking(!isWorking);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="relative bg-gray-50 overflow-hidden min-h-screen">
        {user.company ? <HeaderCompany page="horario" /> : <HeaderWorker />}
        <div className=" text-center mx-auto mt-36 max-w-lg">
          {loading ? (
            <button
              type="button"
              className=" inline-flex items-center px-12 py-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-400"
            >
              <FingerPrintIcon className="text-white h-6" />
            </button>
          ) : (
            <>
              {!isWorking ? (
                <>
                  <button
                    onClick={() => newJob("start")}
                    type="button"
                    className=" inline-flex items-center px-12 py-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Empezar a trabajar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => newJob("stop")}
                    type="button"
                    className="animate-pulse inline-flex items-center px-12 py-6 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Trabajando
                  </button>
                  <p className="mt-8 text-gray-600">
                    Empezaste esta sesión {timeWorking}
                  </p>
                </>
              )}
            </>
          )}
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
