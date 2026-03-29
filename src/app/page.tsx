import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">BizMate</h1>
      <p className="text-muted-foreground text-center text-sm max-w-md">
        Task 1.2 moves the landing experience to locale routes with next-intl.
      </p>
      <Link
        className="text-primary text-sm underline underline-offset-4"
        href="/zh"
      >
        /zh
      </Link>
    </main>
  );
}
