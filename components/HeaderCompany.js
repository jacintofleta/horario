/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import { LogoutIcon } from "@heroicons/react/outline";

import { signOut, useSession } from "next-auth/client";
import Link from "next/link";

export default function HeaderWorker({ page }) {
  const [session, loading] = useSession();

  console.log(page);

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center text-lg font-bold">
                  <Link href="/">Horario.io</Link>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-start items-stretch">
                <div className="flex space-x-8 px-6 sm:px-10">
                  <Link href="/empresa">
                    <a
                      className={
                        page === "empresa"
                          ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      }
                    >
                      Empresa
                    </a>
                  </Link>
                  <Link href="/horario">
                    <a
                      className={
                        page === "horario"
                          ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      }
                    >
                      Tú
                    </a>
                  </Link>
                </div>
              </div>
              <div className="ml-6 flex items-center truncate">
                {session ? (
                  <p className="text-gray-600 mr-4 truncate hidden md:block">
                    {session.user.email}
                  </p>
                ) : null}
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <LogoutIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
