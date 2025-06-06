import { ImagesForm } from "@/components";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 px-4">
      <main className="w-full max-w-3xl bg-white rounded-lg shadow-md py-10 px-6 sm:px-8 my-10">
        <h1 className="text-3xl text-center mb-1 sm:mb-5 sm:text-4xl font-bold ">Convertidor de imágenes</h1>
        <ImagesForm />
      </main>
    </div>
  );
}
