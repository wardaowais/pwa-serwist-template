// app/layout.jsx
export const metadata = {
    title: 'Select your plan',
    description: 'A simple PWA calculator built with Next.js by warda',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        {/* <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0070f3" />
          <link rel="icon" href="/icons/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head> */}
        <body>{children}</body>
      </html>
    );
  }