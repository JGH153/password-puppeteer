import { levels } from "@/lib/levels";
import { Game } from "./Game";

export default function Home() {
  const levelsNoPassword = levels.map((level) => {
    const { password, ...levelNoPassword } = level;
    return {
      ...levelNoPassword,
    };
  });

  return (
    <main className="flex justify-center">
      <section className="max-w-2xl flex-1 m-4">
        <h1 className="text-5xl text-center mb-4">Password Puppeteer</h1>
        <Game levels={levelsNoPassword} />
        <p className="text-center mt-8">Made by Jan Greger Hemb</p>
      </section>
    </main>
  );
}
