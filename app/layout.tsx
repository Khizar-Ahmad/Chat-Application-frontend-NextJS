"use client";

import "@/app/ui/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/chat_top_icon_new.png" type="image/png" />
      </head>
      <body className="text-green-400">{children}</body>
    </html>
  );
}
