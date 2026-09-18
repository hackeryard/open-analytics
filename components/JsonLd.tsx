import React from "react";

interface JsonLdProps {
  data?: Record<string, any> | Array<Record<string, any>>;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ data, schema }: JsonLdProps) {
  const content = data || schema;
  if (!content) return null;

  // Sanitize to prevent HTML parser from terminating the <script> block prematurely
  const jsonString = JSON.stringify(content)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
