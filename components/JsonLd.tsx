import React from "react";

interface JsonLdProps {
  data?: Record<string, any> | Array<Record<string, any>>;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ data, schema }: JsonLdProps) {
  const content = data || schema;
  if (!content) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }}
    />
  );
}
