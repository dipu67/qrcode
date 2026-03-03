"use client";

import { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import TextUrlForm from "./forms/TextUrlForm";
import WiFiForm from "./forms/WiFiForm";
import ContactForm from "./forms/ContactForm";
import SmsForm from "./forms/SmsForm";
import TelForm from "./forms/TelForm";
import MailtoForm from "./forms/MailtoForm";
import GeoForm from "./forms/GeoForm";
import CalendarForm from "./forms/CalendarForm";

const TABS = [
  { id: "text", label: "Text / URL", icon: "🔗" },
  { id: "wifi", label: "Wi‑Fi", icon: "📶" },
  { id: "contact", label: "Contact", icon: "👤" },
  { id: "sms", label: "SMS", icon: "💬" },
  { id: "tel", label: "Tel", icon: "📞" },
  { id: "mailto", label: "Mailto", icon: "✉️" },
  { id: "geo", label: "Geo", icon: "📍" },
  { id: "calendar", label: "Calendar", icon: "📅" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState<TabId>("text");
  const [qrData, setQrData] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");

  // Customization state
  const [qrSize, setQrSize] = useState(400);
  const [qrMargin, setQrMargin] = useState(2);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [showCustomize, setShowCustomize] = useState(false);

  const generateQR = useCallback(async (data: string) => {
    setQrData(data);
    if (!data) {
      setQrImage("");
      setError("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(data, {
        width: qrSize,
        margin: qrMargin,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
      });
      setQrImage(url);
      setError("");
    } catch (err) {
      setError("Failed to generate QR code");
      setQrImage("");
      console.error(err);
    }
  }, [qrSize, qrMargin, fgColor, bgColor, ecLevel]);

  // Re-generate when customization changes and there's existing data
  useEffect(() => {
    if (qrData) {
      generateQR(qrData);
    }
  }, [qrSize, qrMargin, fgColor, bgColor, ecLevel, qrData, generateQR]);
  useEffect(() => {
    setQrData("");
    setQrImage("");
    setError("");
  }, [activeTab]);

  const handleDownload = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.download = `qr-${activeTab}-${Date.now()}.png`;
    link.href = qrImage;
    link.click();
  };

  const renderForm = () => {
    switch (activeTab) {
      case "text":
        return <TextUrlForm onGenerate={generateQR} />;
      case "wifi":
        return <WiFiForm onGenerate={generateQR} />;
      case "contact":
        return <ContactForm onGenerate={generateQR} />;
      case "sms":
        return <SmsForm onGenerate={generateQR} />;
      case "tel":
        return <TelForm onGenerate={generateQR} />;
      case "mailto":
        return <MailtoForm onGenerate={generateQR} />;
      case "geo":
        return <GeoForm onGenerate={generateQR} />;
      case "calendar":
        return <CalendarForm onGenerate={generateQR} />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            QR Code Generator
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            Generate QR codes for text, URLs, Wi‑Fi, contacts, and more
          </p>
        </header>

        {/* Tabs */}
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25 dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Form Panel */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                {TABS.find((t) => t.id === activeTab)?.icon}{" "}
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
              {renderForm()}
            </div>

            {/* Customize Panel */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <button
                type="button"
                onClick={() => setShowCustomize(!showCustomize)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  🎨 Customize QR Code
                </span>
                <svg
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    showCustomize ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showCustomize && (
                <div className="space-y-5 border-t border-slate-200 px-5 pb-5 pt-4 dark:border-slate-700">
                  {/* Size */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Size</label>
                      <span className="text-xs tabular-nums text-slate-500">{qrSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={1000}
                      step={50}
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full accent-slate-900 dark:accent-blue-400"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                      <span>100</span><span>1000</span>
                    </div>
                  </div>

                  {/* Margin */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Margin</label>
                      <span className="text-xs tabular-nums text-slate-500">{qrMargin} modules</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={1}
                      value={qrMargin}
                      onChange={(e) => setQrMargin(Number(e.target.value))}
                      className="w-full accent-slate-900 dark:accent-blue-400"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                      <span>0</span><span>10</span>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Foreground
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded-lg border border-slate-300 p-0.5 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 font-mono text-xs text-slate-900 uppercase focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded-lg border border-slate-300 p-0.5 dark:border-slate-600"
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 font-mono text-xs text-slate-900 uppercase focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Error Correction
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["L", "M", "Q", "H"] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setEcLevel(level)}
                          className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                            ecLevel === level
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                          }`}
                        >
                          {level === "L" && "Low (7%)"}
                          {level === "M" && "Med (15%)"}
                          {level === "Q" && "High (25%)"}
                          {level === "H" && "Max (30%)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={() => {
                      setQrSize(400);
                      setQrMargin(2);
                      setFgColor("#000000");
                      setBgColor("#ffffff");
                      setEcLevel("M");
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                  >
                    Reset to Defaults
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* QR Preview Panel */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            <h2 className="mb-5 w-full text-lg font-semibold text-slate-900 dark:text-white">
              Preview
            </h2>
            <div className="flex flex-1 flex-col items-center justify-center">
              {qrImage ? (
                <>
                  <div className="rounded-xl bg-white  shadow-inner">
                    <img
                      src={qrImage}
                      alt="Generated QR Code"
                      className={`w-[${qrSize}px]`}
                    />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download PNG
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                  <svg
                    className="h-20 w-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={0.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                    />
                  </svg>
                  <p className="text-sm">
                    Fill in the form and click Generate
                  </p>
                </div>
              )}
              {error && (
                <p className="mt-4 text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
