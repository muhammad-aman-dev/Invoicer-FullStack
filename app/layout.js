import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Invoicer",
  description: "Generate and maintain Invoices. See Last 12 Months data plus all revenue and pendings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>  
        {children}
        <ToastContainer
          position="top-center"
          closeOnClick
          hideProgressBar
          autoClose={2000}
          draggable
          style={{ fontSize: "14px" }}
        />
      </body>
    </html>
  );
}
