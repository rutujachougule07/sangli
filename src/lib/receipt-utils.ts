import jsPDF from "jspdf";
import { ORG } from "./site-data";

export const generateReceiptPDF = (data: {
  name: string;
  email: string;
  phone: string;
  amount: number;
  date: string;
  aadhaar?: string;
  pan?: string;
}) => {
  const doc = new jsPDF();
  const primaryColor = "#800000"; // Maroon/Primary

  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(ORG.name, 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DONATION RECEIPT", 105, 30, { align: "center" });

  // Receipt Details Box
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, 190, 50);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Receipt Number:", 20, 65);
  doc.setFont("helvetica", "normal");
  doc.text(`BNP-${Date.now().toString().slice(-6)}`, 60, 65);

  doc.setFont("helvetica", "bold");
  doc.text("Date:", 140, 65);
  doc.setFont("helvetica", "normal");
  doc.text(data.date, 160, 65);

  // Donor Info
  let boxHeight = 40;
  if (data.aadhaar) boxHeight += 10;
  if (data.pan) boxHeight += 10;

  doc.setFillColor(245, 245, 245);
  doc.rect(20, 75, 170, boxHeight, "F");
  
  let currentY = 85;
  doc.setFont("helvetica", "bold");
  doc.text("Donor Name:", 30, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.name, 70, currentY);
  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Email:", 30, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.email, 70, currentY);
  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Phone:", 30, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(data.phone, 70, currentY);
  currentY += 10;

  if (data.aadhaar) {
    doc.setFont("helvetica", "bold");
    doc.text("Aadhaar No:", 30, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.aadhaar, 70, currentY);
    currentY += 10;
  }

  if (data.pan) {
    doc.setFont("helvetica", "bold");
    doc.text("PAN No:", 30, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(data.pan.toUpperCase(), 70, currentY);
    currentY += 10;
  }

  // Amount Section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Donation Amount:", 20, 75 + boxHeight + 20);
  
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text(`INR ${data.amount.toLocaleString()}/-`, 20, 75 + boxHeight + 35);

  // Footer Message
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const msg = "Thank you for your generous contribution. Your support empowers our community initiatives in Sangli. This is a computer-generated receipt.";
  const splitMsg = doc.splitTextToSize(msg, 170);
  doc.text(splitMsg, 20, 75 + boxHeight + 55);

  // Signature Area
  doc.line(140, 220, 190, 220);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", 145, 225);
  doc.text("BNP Sangli", 155, 232);

  // Bottom Border
  doc.setFillColor(primaryColor);
  doc.rect(0, 287, 210, 10, "F");

  doc.save(`BNP_Receipt_${data.name.replace(/\s+/g, "_")}.pdf`);
};
