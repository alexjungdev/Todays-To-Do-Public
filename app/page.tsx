import Image from "next/image";

export default function Home() {
  return (
    <main className="w-screen flex items-center justify-center">
      <div className="flex flex-col justify-center">
        <text className="text-4xl font-bold">오늘의 할일</text>
        <div className="mt-4 flex flex-col justify-center">
          <div className="flex flex-col justify-center">
            <input
              className="border-4"
              placeholder="입력하세요..."
            />
            <button
              className="btn btn-normal"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
