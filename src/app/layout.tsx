import React from 'react'
import { Metadata } from 'next';

import '@src/styles/reset.css';
import '@src/styles/global.scss';
import "../styles/global.scss";

export const metadata: Metadata = {
  title: 'Online C++ Editor',
  description: 'An online C++ editor to solve CP problems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}