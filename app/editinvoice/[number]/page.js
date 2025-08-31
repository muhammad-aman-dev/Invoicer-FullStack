"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Page({ params }) {
  const [invoice, setInvoice] = useState({});
  const [newInvoice, setNewInvoice] = useState({});
  const [notfound, setNotfound] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [Loading, setLoading] = useState(true);
  const { number } = use(params);

  async function getInvoice(number) {
    setLoading(true);
    try {
      const res = await axios.get(`/api/invoicedetail?id=${number}`);
      const data = res.data;
      setInvoice(data.invoicedetail);
      setNewInvoice(data.invoicedetail);
      setLoading(false);
    } catch (err) {
      setNotfound(true);
      setLoading(true);
    }
  }

  function refreshCard() {
    setNewInvoice(JSON.parse(JSON.stringify(invoice)));
  }

  function handleCustomerName(value) {
    setNewInvoice((prev) => ({ ...prev, customerName: value }));
  }

  function handleCustomerPhone(value) {
    setNewInvoice((prev) => ({ ...prev, customerPhone: value }));
  }

  function handleProducts(value, field, index) {
    const updated = [...newInvoice.products];
    updated[index][field] = value;
    updated[index]["totalPOP"] =
      updated[index]["priceforone"] * updated[index]["quantity"];
    setNewInvoice((prev) => ({ ...prev, products: updated }));
  }

  function handleAddProduct() {
    setNewInvoice((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { name: "", quantity: "", priceforone: "", totalPOP: "" },
      ],
    }));
  }

  function handleRemoveProduct() {
    setNewInvoice((prev) => ({
      ...prev,
      products: prev.products.slice(0, -1),
    }));
  }

  function handleStatus(value) {
    setNewInvoice((prev) => ({ ...prev, status: value }));
  }

  function handlePaidAmount(value) {
    setNewInvoice((prev) => ({ ...prev, paidAmount: value }));
  }

  async function handleSubmit() {
    let errors = [];
    if (!newInvoice.customerName?.trim()) {
      errors.push("Customer name is required");
    }
    if (!newInvoice.customerPhone?.trim()) {
      errors.push("Customer phone is required");
    }
    if (!newInvoice.paidAmount || Number(newInvoice.paidAmount) < 0) {
      errors.push("Paid amount must be 0 or greater");
    }
    if (!newInvoice.products || newInvoice.products.length === 0) {
      errors.push("At least one product is required");
    } else {
      newInvoice.products.forEach((p, i) => {
        if (!p.name?.trim()) errors.push(`Product ${i + 1}: name is required`);
        if (!p.quantity || Number(p.quantity) <= 0)
          errors.push(`Product ${i + 1}: quantity must be > 0`);
        if (!p.priceforone || Number(p.priceforone) <= 0)
          errors.push(`Product ${i + 1}: price must be > 0`);
        if (!p.totalPOP || Number(p.totalPOP) <= 0)
          errors.push(`Product ${i + 1}: total price must be > 0`);
      });
    }

    if (errors.length > 0) {
      toast("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    setisSubmitting(true);
    let res = await axios
      .put("/api/invoiceEdit", newInvoice)
      .then((res) => toast(res.data.data))
      .catch((err) => toast(err));
    setisSubmitting(false);
  }

  const totalAmount = newInvoice.products?.reduce(
    (sum, p) => sum + (Number(p.totalPOP) || 0),
    0
  );

  useEffect(() => {
    setNewInvoice((prev) => ({ ...prev, totalAmount: totalAmount }));
  }, [totalAmount]);

  useEffect(() => {
    getInvoice(number);
  }, [number]);

  if (notfound) {
    return <div className="text-center text-4xl text-red-600">Not Found</div>;
  }

  if (Loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <div className="w-10 h-10 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        <h1 className="font-bold text-blue-600 text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-200/50 backdrop-blur-sm fixed z-50 top-0 w-full min-h-screen">
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-[8%] text-gray-800 flex flex-col items-center rounded-xl bg-white w-[80%] h-[520px] overflow-y-auto ml-[10%] sm:ml-[12.5%] sm:w-3/4 shadow-xl transition-all duration-150 opacity-100 scale-100 relative"
      >
        <Image
          src={"/refresh.svg"}
          width={20}
          height={20}
          alt="refresh"
          className="absolute z-10 right-4 top-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            refreshCard();
          }}
        />
        <h1 className="text-2xl font-bold font-serif mt-2 text-blue-600">
          Edit Invoice
        </h1>
        <div className="w-full p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Customer Name */}
            <div className="w-full relative">
              <input
                type="text"
                id="cname1"
                className="w-full border rounded-xl p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
                placeholder=" "
                value={newInvoice.customerName || ""}
                disabled
              />
              <label
                htmlFor="cname1"
                className="absolute left-2 -top-3 text-xs text-gray-500 bg-white px-1"
              >
                Customer Name
              </label>
            </div>

            {/* Customer Phone */}
            <div className="w-full relative">
              <input
                type="text"
                id="cphone1"
                className="w-full border rounded-xl p-2 bg-gray-200 text-gray-600 cursor-not-allowed"
                placeholder=" "
                value={newInvoice.customerPhone || ""}
                disabled
              />
              <label
                htmlFor="cphone1"
                className="absolute left-2 -top-3 text-xs text-gray-500 bg-white px-1"
              >
                Customer Phone
              </label>
            </div>
          </div>

          <h1 className="text-xl font-bold font-serif ml-1 mt-3 text-blue-600">
            Products
          </h1>
          <div className="flex flex-col gap-2">
            {newInvoice.products?.map((product, index) => (
              <div
                className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md border"
                key={index}
              >
                <h1 className="text-center font-bold font-mono text-blue-600">
                  #{index + 1}
                </h1>
                <div className="flex gap-1">
                  {/* Product Name */}
                  <div className="relative w-2/4">
                    <input
                      id={`pname${index}`}
                      type="text"
                      value={product.name}
                      className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Enter Product Name"
                      onChange={(e) =>
                        handleProducts(e.target.value, "name", index)
                      }
                    />
                  </div>

                  {/* Product Quantity */}
                  <div className="relative w-2/4">
                    <input
                      id={`pq${index}`}
                      type="number"
                      value={product.quantity}
                      className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Enter Quantity"
                      onChange={(e) =>
                        handleProducts(e.target.value, "quantity", index)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-1 sm:mt-2">
                  {/* Price for One */}
                  <div className="relative w-2/4">
                    <input
                      id={`pp${index}`}
                      type="number"
                      value={product.priceforone}
                      className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Price per unit"
                      onChange={(e) =>
                        handleProducts(e.target.value, "priceforone", index)
                      }
                    />
                  </div>

                  {/* Total Price */}
                  <div className="relative w-2/4">
                    <input
                      id={`ptotal${index}`}
                      type="number"
                      value={product.totalPOP}
                      className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-600 outline-none"
                      placeholder="Total Price"
                      onChange={(e) =>
                        handleProducts(e.target.value, "totalPOP", index)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm px-3 py-2 text-white cursor-pointer flex gap-2"
              onClick={handleAddProduct}
            >
              Add Product
              <Image
                src="/add.svg"
                priority
                width={20}
                height={20}
                className="h-auto w-auto"
                alt="add"
              />
            </button>
            {newInvoice.products?.length > 1 && (
              <button
                className="bg-red-600 hover:bg-red-700 rounded-xl px-3 py-2 text-sm text-white cursor-pointer flex gap-2"
                onClick={handleRemoveProduct}
              >
                Remove Product
                <Image
                  src="/delete.svg"
                  width={20}
                  height={20}
                  className="h-auto w-auto"
                  alt="delete"
                />
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between w-full px-4 mt-3">
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-gray-700">Total Amount</h1>
            <h1 className="bg-gray-100 w-36 text-center px-5 py-3 rounded-md font-bold text-xl text-blue-600">
              ${totalAmount}
            </h1>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-gray-700">Paid Amount</h1>
            <input
              type="number"
              value={newInvoice.paidAmount || ""}
              onChange={(e) => handlePaidAmount(e.target.value)}
              className="bg-gray-100 px-5 py-3 rounded-md font-bold text-xl w-36 text-center"
              placeholder="0"
            />
          </div>
          <div>
            <h1 className="font-bold text-gray-700">Status</h1>
            <select
              name="status"
              id="status"
              value={newInvoice.status || "Not Paid"}
              className="bg-gray-100 p-2 py-3 text-gray-800 font-bold rounded-md"
              onChange={(e) => handleStatus(e.target.value)}
            >
              <option value="Not Paid">Not Paid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className={`${
            isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          } mb-3 rounded-xl text-md px-3 py-2 text-white cursor-pointer flex justify-center gap-2 mt-4 w-[90%]`}
        >
          {isSubmitting ? "Saving..." : "Save"}
          <Image
            src="/save.svg"
            width={20}
            height={20}
            className="h-auto w-auto"
            alt="save"
          />
        </button>
      </div>
    </div>
  );
}
