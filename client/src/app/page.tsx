import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "./(ui)/loginbutton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }
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
