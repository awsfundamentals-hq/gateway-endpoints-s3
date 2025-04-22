import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gateway Endpoints for S3',
  description: '🔑 Securely Connecting to Managed Services like S3 from within VPCs',
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
