"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyCodeButtonProps {
  code: string;
  label?: string;
  className?: string;
}

export default function CopyCodeButton({
  code,
  label = "Copy Code",
  className = "flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-medium text-zinc-200 transition cursor-pointer",
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
