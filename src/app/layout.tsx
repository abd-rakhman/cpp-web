import React from 'react'
import { Metadata } from 'next';

import '@src/styles/reset.css';
import '@src/styles/global.scss';
import "../styles/global.scss";
import { Providers } from './providers';
import { CodeforcesService } from '@src/services/codeforces';

export const metadata: Metadata = {
  title: 'Online C++ Editor',
  description: 'An online C++ editor to solve CP problems',
}

const getProblem = async () => {
  await CodeforcesService.getProblem(1973, 'A');
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  getProblem();
  return (
    <html lang="en">
      <body>
        <div id="root">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}