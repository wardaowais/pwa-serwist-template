'use client';

import { useEffect, useState } from "react";
import i18n from "../i18n";
declare const localStorage: Storage;

interface Storage {
  length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const storage: Storage = localStorage; // 👈 Explicit type
    const savedLang = storage.getItem("lang") || "en";
    setLang(savedLang);
    i18n.changeLanguage(savedLang);
  }, []);

  return (
    <div lang={lang}>
      {children}
    </div>
  );
}
