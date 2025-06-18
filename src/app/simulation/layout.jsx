// app/layout.jsx
import { Suspense } from 'react';

export const metadata = {
    title: 'Select your plan',
    description: 'A simple PWA calculator built with Next.js by warda',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
     
        <body>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </body>
      </html>
    );
  }