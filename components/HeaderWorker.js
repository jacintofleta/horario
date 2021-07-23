/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import { BellIcon, LogoutIcon } from "@heroicons/react/outline";

import { signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";

export default function HeaderWorker() {
  const [session, loading] = useSession();

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
              <div className="ml-6 flex items-center truncate">
                {session ? (
                  <p className="text-gray-600 mr-4 truncate">
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
