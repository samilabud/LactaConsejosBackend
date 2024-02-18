"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/app/(ui)/button";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function Home() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-72ß text-white text-2xl">
            Administración Lacta Consejos
          </div>
          <Image
            src="/lactaconsejoslogo.png"
            width={80}
            height={80}
            alt="Lacta Consejos Logo Image"
            className="rounded-lg"
          />
        </div>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`mb-3 text-2xl`}>
            Por favor, inicie sesión para continuar.
          </h1>
          <LoginButton />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          ></div>
        </div>
      </div>
    </main>
  );
}
function LoginButton() {
  return (
    <Button className="mt-4 w-full" onClick={() => signIn()}>
      <span>Iniciar sesión</span>
      <KeyboardArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
