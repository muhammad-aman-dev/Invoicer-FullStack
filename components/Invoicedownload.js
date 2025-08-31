"use client";

import { useState,useEffect } from 'react'

export default function InvoiceDownload({ number }) {
 const [isDownloading, setisDownloading] = useState(false)
  const handleDownload = async () => {
    setisDownloading(true);
    const mod = await import("html2pdf.js");
    const html2pdf = mod.default || mod;

    const element = document.getElementById("invoice");
    const cName= document.getElementById("customerName").innerText.slice(6);
    if (!element) {
      console.log('alert')
      alert("Invoice element not found");
     setisDownloading(false);
      return;
    }

    const options = {
        margin: 0,
        filename: `invoice-${cName}-${number}.pdf`,
        image: { type: "jpeg", quality: 1.00 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      };
      

      html2pdf().set(options).from(element).save().catch(err => {
        console.error("html2pdf error:", err);
      });
setisDownloading(false);
  };

  return (
    <button
      onClick={handleDownload} disabled={isDownloading} className={`fixed bottom-10 right-10 px-6 py-2 rounded-lg ${isDownloading?"bg-blue-300 text-white":"bg-white text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white"} shadow-md duration-150`}
    >
      {isDownloading?"Downloading...":"Download PDF"}
    </button>
  );
}


