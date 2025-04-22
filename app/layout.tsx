import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '{{TITLE}}',
  description: '{{DESCRIPTION}}',
  keywords: ['{{KEYWORDS}}'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
