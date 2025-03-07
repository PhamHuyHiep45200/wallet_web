/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { connectTokenPublic, createWalletPublic } from '../service/api'

const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
const buttonClass = "text-white mt-5 block text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
export default function Home() {
  const [craeteWallet, setsetCreateWallet] = useState(false);
  const [userCalbee, setUserCalbee] = useState("");
  const [log, setLog] = useState("");
  const [clientApp, setClientApp] = useState("");
  const [callBackApp, setCallBackApp] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()

  const paramsQuery = useMemo(() => {
    const resultQuery = {
      clientId: searchParams.get("clientId"),
      code: searchParams.get("code"),
      external_user_id: searchParams.get("external_user_id"),
      success: searchParams.get("success"),
    }
    setLog(JSON.stringify(resultQuery))
    return resultQuery
  }, [searchParams]);

  console.log("paramsQuery", paramsQuery)

  const createWalletHandle = async () => {
    setLoading(true);
    try {
      if (paramsQuery.success || paramsQuery.success === "true") {
        const dataConnect = {
          client_id: paramsQuery.clientId,
          client_secret: "AYaHghveYSftDkALO/Wmovr4cc0n7/o7lA95tAvccrQ=",
          grant_type: "client_credentials",
          scope: "create_wallet nft_issue wallet_detail",
          code: paramsQuery.code,
          external_user_id: paramsQuery.external_user_id,
        };
        const data: any = await connectTokenPublic(dataConnect);
        localStorage.setItem("access_token", data.access_token);
        const dataCreateWallet = {
          client_id: paramsQuery.clientId,
          external_user_id: paramsQuery.external_user_id,
        };
        await createWalletPublic(dataCreateWallet);
        alert("Create Wallet Success");
      } else {
        alert("error url");
      }
    } catch (error) {
      console.log(error);

      alert("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user_calbee")) {
      setUserCalbee(localStorage.getItem("user_calbee") as string);
    } else {
      const newUser = `asdf-ghfg-tyug-${Math.floor(Math.random() * 1000000)}`;
      localStorage.setItem("user_calbee", newUser);
      setUserCalbee(newUser);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("clientId")) {
      setsetCreateWallet(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mt-10">User ID: {userCalbee}</div>
      <button
        className="mb-10"
        onClick={() => {
          const newUser = `asdf-ghfg-tyug-${Math.floor(
            Math.random() * 1000000
          )}`;
          localStorage.setItem("user_calbee", newUser);
          setUserCalbee(newUser);
          setsetCreateWallet(false);
          alert("set user success");
        }}
      >
        Set Random User
      </button>
      {craeteWallet ? (
        <button onClick={createWalletHandle} className={buttonClass}>
          <span className="mr-4">Create Wallet</span>
          {loading && <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
          </svg>}
        </button>
      ) : (
        <div>
          <div className="flex items-center space-x-4">
            <span>clientId:</span>
            <input
              value={clientApp}
              onChange={(e) => {
                setClientApp(e.target.value);
              }}
              className={inputClass}
            />
          </div>
          <br />
          <div className="flex items-center space-x-4">
            <span>callbackUrl:</span>
            <input
              value={callBackApp}
              onChange={(e) => setCallBackApp(e.target.value)}
              className={inputClass}
            />
          </div>
          <Link className={buttonClass} href={`jrewallet://?clientId=${clientApp}&callbackUrl=${callBackApp}&external_user_id=${userCalbee}`}>
            Redirect To JRE
          </Link>
        </div>
      )}
      <div className="max-w-[400px] overflow-x-auto overflow-y-auto max-h-[100px]">
        {log}
      </div>
    </div>
  );
}
