import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image
          src="/logo.svg"
          alt="BizMate"
          width={120}
          height={32}
          priority
          className="h-8 w-auto"
        />
      </div>
      {children}
    </div>
  );
}
