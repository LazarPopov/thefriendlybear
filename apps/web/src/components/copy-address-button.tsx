"use client";

import { useState } from "react";

type CopyAddressButtonProps = {
  address: string;
  label: string;
  copiedLabel: string;
};

export function CopyAddressButton({ address, label, copiedLabel }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="copy-address-button" onClick={handleCopy}>
      {copied ? copiedLabel : label}
    </button>
  );
}
