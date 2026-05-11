"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

type DialogType = "info" | "success" | "warning" | "error";

interface DialogOptions {
  title?: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface DialogContextType {
  showAlert: (options: DialogOptions | string) => void;
  showConfirm: (options: DialogOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showAlert = useCallback((opts: DialogOptions | string) => {
    const defaultOptions: DialogOptions = typeof opts === "string"
      ? { message: opts, type: "info" }
      : { ...opts, type: opts.type || "info" };

    setOptions(defaultOptions);
    setIsOpen(true);
    setResolvePromise(null);
  }, []);

  const showConfirm = useCallback((opts: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions({ ...opts, showCancel: true });
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(false);
  }, [resolvePromise]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (options?.onConfirm) options.onConfirm();
    if (resolvePromise) resolvePromise(true);
  }, [options, resolvePromise]);

  const Icon = () => {
    const className = "w-12 h-12 mb-4";
    switch (options?.type) {
      case "success":
        return (
          <svg className={`${className} text-green-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case "warning":
        return (
          <svg className={`${className} text-yellow-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "error":
        return (
          <svg className={`${className} text-red-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      default:
        return (
          <svg className={`${className} text-blue-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        size="sm"
        title={options?.title || (options?.type === 'error' ? '發生錯誤' : options?.type === 'success' ? '完成' : '提示')}
        footer={
          <div className="flex w-full gap-3 mt-2">
            {options?.showCancel && (
              <Button 
                variant="outline" 
                className="flex-1 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors" 
                onClick={handleClose}
              >
                {options.cancelText || "取消"}
              </Button>
            )}
            <Button 
              className={`flex-1 border-none shadow-sm transition-all active:scale-[0.98] ${
                options?.type === 'error' 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : options?.type === 'success'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
              }`}
              onClick={handleConfirm}
            >
              {options?.confirmText || "確定"}
            </Button>
          </div>
        }
      >
        <div className={`flex flex-col items-center text-center py-6 px-4 rounded-xl ${
          options?.type === 'error' ? 'bg-rose-50/50 dark:bg-rose-950/10' : 
          options?.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-950/10' : 
          'bg-zinc-50/80 dark:bg-zinc-800/20'
        }`}>
          <div className={`mb-3 scale-125 ${
            options?.type === 'error' ? 'text-rose-500' : 
            options?.type === 'success' ? 'text-emerald-500' : 
            'text-zinc-400'
          }`}>
            <Icon />
          </div>
          <p className="text-zinc-700 dark:text-zinc-200 font-medium whitespace-pre-wrap leading-relaxed">
            {options?.message}
          </p>
        </div>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useAlert must be used within a DialogProvider");
  return context;
};
