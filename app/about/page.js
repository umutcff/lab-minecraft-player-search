export const metadata = {
  title: "About | Minecraft Player Search",
  description: "Learn more about the Minecraft Player Search app.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center p-6 bg-zinc-50 dark:bg-black font-sans">
      <div className="w-full max-w-2xl mt-12">
        <h1 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">About</h1>
        
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
          <p className="lead text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Minecraft Player Search is a fast and simple tool to look up any Minecraft player's profile and skin just by their username.
          </p>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">How it works</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Simply head over to the Search page, type in a Minecraft username, select the edition (Java or Bedrock), and hit search. The app will fetch the player's unique identifier (UUID) and render their current in-game skin in real-time.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              This app is built using Next.js App Router, demonstrating the power of Client and Server components working seamlessly together.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-900 dark:text-emerald-100">Credits</h2>
            <p className="text-emerald-800 dark:text-emerald-200">
              This application is powered by the fantastic and free API provided by{" "}
              <a 
                href="https://mc-api.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                mc-api.io
              </a>
              . They handle all the heavy lifting of communicating with Mojang's servers and decoding the player textures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
