"use client";

import { useState, useEffect } from "react";

interface Props {
  onGenerate: (data: string) => void;
}

export default function SmsForm({ onGenerate }: Props) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    const smsString = message ? `SMSTO:${phone}:${message}` : `SMSTO:${phone}`;
    if (!phone) {
      onGenerate("");
    }
    onGenerate(smsString.trim());
  }, [phone, message]);

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 234 567 8900"
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Message (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          rows={3}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
   
    </form>
  );
}
