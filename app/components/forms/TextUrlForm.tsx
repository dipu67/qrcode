"use client";

import { on } from "events";
import { useEffect, useState } from "react";

interface Props {
  onGenerate: (data: string) => void;
}

export default function TextUrlForm({ onGenerate }: Props) {
  const [text, setText] = useState("");


  useEffect(() => {
    if (!text.trim()) {
      onGenerate("");
    }
    onGenerate(text.trim());
  }, [text]);

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Text or URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL (e.g. https://example.com)"
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
    </form>
  );
}
