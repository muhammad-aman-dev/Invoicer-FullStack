import axios from "axios";
import InvoiceDownload from "@/components/Invoicedownload";
import Link from "next/link";

export const metadata = {
  title: "Invoice Details",
  description: "View Invoice Details and Download Invoice in Pdf format...",
};

export default async function InvoicePage({ params }) {
  const { number } = await params;
  let invoice;
  try {
    const res = await axios.get(`${process.env.URI}/api/invoicedetail?id=${number}`);
    invoice = res.data.invoicedetail;
  } catch (err) {
    invoice = {
      customerName: "Not Found!!!",
      customerPhone: "Not Found!!!",
      products: [
        {
          name: "Not Found",
          quantity: "Not Found",
          priceforone: "Not Found",
          totalPOP: "Not Found",
        },
      ],
      createdAt: "Not Found",
    };
  }

  return (
    <div
      style={{
        backgroundColor: "#2b7fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Invoice Container */}
      <div
        id="invoice"
        style={{
          backgroundColor: "white",
          width: "794px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ddd",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <h1
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "28px",
            color: "white",
            padding: "20px",
            backgroundColor: "#2b7fff",
          }}
        >
          SHOP NAME
        </h1>

        {/* Date & Invoice Number */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h1 style={{ fontWeight: "bold", fontSize: "20px", color: "#333" }}>
            Invoice Number: {number}
          </h1>
          <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#666" }}>
            Date: {new Date(invoice.createdAt).toLocaleDateString()}
          </h4>
        </div>

        {/* Customer Info */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "15px 20px",
            fontSize: "18px",
            color: "#333",
            borderBottom: "1px solid #ddd",
          }}
        >
          <h2 id="customerName" style={{ fontWeight: "600" }}>Name: {invoice.customerName}</h2>
          <h2 style={{ fontWeight: "600" }}>Phone: {invoice.customerPhone}</h2>
        </div>

        {/* Products */}
        <h1
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "22px",
            margin: "20px 0 10px",
            color: "#333",
          }}
        >
          --- Products ---
        </h1>
        <div style={{ width: "100%" }}>
          {invoice.products.map((product, index) => (
            <div
              key={index}
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  color: "#444",
                }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <h3 style={{ fontWeight: "600" }}>Name:</h3>
                  <p>{product.name}</p>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <h3 style={{ fontWeight: "600" }}>Quantity:</h3>
                  <p>{product.quantity}</p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#444",
                }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  <h3 style={{ fontWeight: "600" }}>Price/Piece:</h3>
                  <p>${product.priceforone}</p>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <h3 style={{ fontWeight: "600" }}>Total:</h3>
                  <p>${product.totalPOP}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            borderTop: "1px solid #ddd",
            color: "#333",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>
              Paid Amount
            </h3>
            <h4>${invoice.paidAmount}</h4>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>
              Total Amount
            </h3>
            <h4>${invoice.totalAmount}</h4>
          </div>
        </div>

        {/* Status Circle */}
        <div
          style={{
            width: "140px",
            height: "140px",
            backgroundColor: "#2b7fff",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "30px 0",
          }}
        >
          <h1
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "22px",
              textDecoration: "underline",
              transform: "skewX(12deg) skewY(-9deg)",
            }}
            className="mb-6"
          >
            {invoice.status}
          </h1>
        </div>
      </div>

      <div style={{position:"fixed"}} className=" bottom-10 right-[200px] flex gap-4">
        <Link
          href={`/editinvoice/${number}`}
          target="_blank"
          className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition"
        >
          Edit Invoice
        </Link>
        <InvoiceDownload number={number} />
      </div>
    </div>
  );
}
