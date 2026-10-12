"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export interface FaqAccordionItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqAccordionItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {faqs.map((faq, i) => {
        const isOpen = openFaq === i;
        return (
          <div
            key={i}
            className="rounded-xl bg-[#111218] border border-white/[0.08] overflow-hidden transition"
          >
            <button
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : i)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition"
            >
              <span className="text-sm font-medium text-white">{faq.question}</span>
              <ChevronRight
                size={16}
                className={`text-zinc-500 transition-transform shrink-0 ${isOpen ? "rotate-90 text-white" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
