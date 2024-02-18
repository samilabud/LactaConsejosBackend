import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
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
        {children}
      </div>
    </main>
  );
}
