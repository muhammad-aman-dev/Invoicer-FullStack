"use client";

export default function InvoiceDownload({ number }) {
  const handleDownload = async () => {
    const mod = await import("html2pdf.js");
    const html2pdf = mod.default || mod;

    const element = document.getElementById("invoice");
    const cName= document.getElementById("customerName").innerText.slice(6);
    if (!element) {
      console.log('alert')
      alert("Invoice element not found");
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
  };

  return (
    <button
      onClick={handleDownload}
      className="fixed bottom-10 right-10 px-6 py-2 bg-white text-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 hover:text-white duration-150"
    >
      Download PDF
    </button>
  );
}


