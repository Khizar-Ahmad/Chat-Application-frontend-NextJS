
import { AppProvider } from "../context-provider/context_Provider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <>
      {/* <body className='text-green-400'>{children}</body> */}
      <AppProvider>
    {children}
    </AppProvider>
</>
    // </html>
  );
}