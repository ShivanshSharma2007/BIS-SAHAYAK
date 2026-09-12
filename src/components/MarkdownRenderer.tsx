"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse markdown into structured blocks
  const renderFormattedText = (text: string) => {
    // Split by bold (**text**)
    const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {inner}
          </strong>
        );
      }
      // Parse inline code (`code`)
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cPart, cIdx) => {
        if (cPart.startsWith("`") && cPart.endsWith("`")) {
          return (
            <code
              key={`${idx}-${cIdx}`}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 text-xs font-mono font-medium"
            >
              {cPart.slice(1, -1)}
            </code>
          );
        }
        return <span key={`${idx}-${cIdx}`}>{cPart}</span>;
      });
    });
  };

  // Preprocess text: if inline bullets like "text * **item** * **item2**" exist, convert to newlines
  const formattedContent = content.replace(/\s+\*\s+(\*\*|[A-Za-z])/g, "\n* $1");
  const lines = formattedContent.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === "ul") {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-4 list-disc marker:text-emerald-500">
          {currentList.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-700">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-4 list-decimal marker:text-emerald-600 font-medium">
          {currentList.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-700 font-normal">
              {renderFormattedText(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={i} className="font-bold text-sm text-slate-900 mt-3 mb-1">
          {renderFormattedText(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={i} className="font-bold text-base text-slate-900 mt-3 mb-1.5">
          {renderFormattedText(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h2 key={i} className="font-bold text-lg text-slate-900 mt-4 mb-2">
          {renderFormattedText(trimmed.replace(/^#\s+/, ""))}
        </h2>
      );
      continue;
    }

    // Bullet items: starts with * or -
    const bulletMatch = trimmed.match(/^(\*|-)\s+(.*)/);
    if (bulletMatch) {
      if (currentList && currentList.type !== "ul") {
        flushList();
      }
      if (!currentList) {
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[2]);
      continue;
    }

    // Numbered list items: starts with 1. or 2.
    const numMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      if (currentList && currentList.type !== "ol") {
        flushList();
      }
      if (!currentList) {
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numMatch[1]);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={i} className="text-sm leading-relaxed text-slate-700 mb-2 last:mb-0">
        {renderFormattedText(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
}
