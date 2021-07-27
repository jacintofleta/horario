import clientAxios from "../config/axios";
import { useState } from "react";
import { useRouter } from "next/router";

const OnboardingCode = () => {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  let newCompany = async () => {
    setIsLoadingCompany(true);
    try {
      let response = await clientAxios.post("api/newcompany");
      router.push("/empresa");
    } catch (error) {
      setIsLoadingCompany(false);
      console.log(error);
    }
  };

  //on Submit
  let updateCode = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!code || code.length !== 4) {
      setErrorMessage("Código incorrecto");
      return;
    }
    try {
      let response = await clientAxios.post("api/updatecode", { code });
      router.push("/horario");
    } catch (error) {
      let message = error.response?.data?.message;
      if (message) {
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="relative pt-6 pb-16 sm:pb-24 bg-gray-50 overflow-hidden min-h-screen px-4">
      <div className="bg-white shadow sm:rounded-lg mt-16 mx-auto sm:mt-24 max-w-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Introduce el código de tu empresa
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Tu empresa te ha de proporcionar un código de 4 dígitos</p>
          </div>
          <form onSubmit={updateCode} className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="code" className="sr-only">
                Código
              </label>
              <input
                type="text"
                maxLength="4"
                name="code"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Código"
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Entrar
            </button>
          </form>
          {errorMessage ? (
            <p className="mt-4 text-red-600">{errorMessage}</p>
          ) : null}
        </div>
      </div>
      <div className="max-w-lg mx-auto text-center">
        {isLoadingCompany ? (
          <button
            disabled
            type="button"
            className="mt-12 animate-pulse border border-transparent text-xs font-medium text-indigo-700"
          >
            Cargando
          </button>
        ) : (
          <button
            onClick={() => newCompany()}
            type="button"
            className="mt-12 border border-transparent text-xs font-medium text-indigo-700"
          >
            O crea una nueva empresa
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingCode;
