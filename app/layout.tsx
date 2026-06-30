import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <title>Science Co-op</title>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Prompt:wght@400;600;700;800&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}