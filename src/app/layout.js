import 'src/public/styles/globals.css'
import 'src/public/styles/reset.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import Navbar from 'src/public/components/Navbar';
import DateOfToday from 'src/public/components/DateOfToday';
import { DataProvider } from "context/data";
import AuthStateChanged from 'hooks/AuthStateChanged';

export const metadata = {
  title: '전산프로그램',
  description: '안산의 모든 채용정보를 한눈에, 안산가로수',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body style={{backgroundColor:"rgb(255, 244, 227)"}}>
        <DataProvider>
          <AuthStateChanged>
            <DateOfToday />
            <Navbar />
            <div style={{padding: "10px 15px"}} className={inter.className}>{children}</div>
          </AuthStateChanged>
        </DataProvider>
      </body>
    </html>
  )
}

