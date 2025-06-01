import { ImagesForm } from "@/components";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <main>
        <div className="mx-auto py-10 px-8 my-10 w-3xl bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center mb-5">Convertidor de imagenes</h1>
          <ImagesForm />
        </div>
      </main>
    </div>
  );
}
