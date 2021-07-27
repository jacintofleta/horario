import { signIn, signOut, useSession } from "next-auth/client";
import { getCsrfToken } from "next-auth/client";
import Link from "next/link";

import { LogoutIcon } from "@heroicons/react/outline";
import { useState } from "react";

export default function Home({ csrfToken }) {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative bg-gray-50 overflow-hidden min-h-screen">
      <div
        className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
        aria-hidden="true"
      >
        <div className="relative h-full max-w-7xl mx-auto">
          <svg
            className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
            width={404}
            height={784}
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={784}
              fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
            />
          </svg>
          <svg
            className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
            width={404}
            height={784}
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern
                id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={784}
              fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
            />
          </svg>
        </div>
      </div>

      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block inline">Control horario</span>{" "}
              <span className="block text-indigo-600 inline">fácil</span>
            </h1>

            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Lleva el control horario de forma sencilla y gratuita
            </p>
            <div className="mt-5 max-w-md mx-auto flex justify-center md:mt-8">
              <form
                method="post"
                action="/api/auth/signin/email"
                className="mt-8 max-w-lg w-full sm:flex"
                onSubmit={() => setIsLoading(true)}
              >
                {session ? (
                  <>
                    <div className="min-w-0 flex-1">
                      <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                      />

                      <label htmlFor="hero-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="hero-email"
                        type="email"
                        name="email"
                        disabled="disabled"
                        className="block w-full border border-gray-300 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm bg-gray-200 focus:border-rose-500 focus:ring-rose-500"
                        placeholder={session.user.email}
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-3 mx-auto">
                      {isLoading ? (
                        <button
                          type="text"
                          disabled
                          className="bg-indigo-400 block w-full rounded-md border border-transparent px-5 py-3 bg-rose-500 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                        >
                          Loading
                        </button>
                      ) : (
                        <Link href="/horario" passHref>
                          <button
                            onClick={() => setIsLoading(true)}
                            type="text"
                            className="bg-indigo-600 block w-full rounded-md border border-transparent px-5 py-3 bg-rose-500 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                          >
                            Entrar
                          </button>
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                      />

                      <label htmlFor="hero-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="hero-email"
                        type="email"
                        name="email"
                        required
                        className="block w-full border border-gray-300 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-3">
                      {isLoading ? (
                        <button
                          disabled
                          type="button"
                          className="bg-indigo-400 block w-full rounded-md border border-transparent px-5 py-3 bg-rose-500 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                        >
                          Loading
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="bg-indigo-600 block w-full rounded-md border border-transparent px-5 py-3 bg-rose-500 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                        >
                          Entrar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </form>
            </div>

            {session ? (
              <div className="mt-10 mx-auto">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex-row inline-flex p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none "
                >
                  Cerrar sesión
                  <LogoutIcon className="h-6 w-6 ml-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);

  return {
    props: { csrfToken },
  };
}
