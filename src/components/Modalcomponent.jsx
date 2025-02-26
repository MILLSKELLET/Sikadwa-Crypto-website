import React, { useState, useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  // footer,
  maxWidth = "md",
  closeOnOutsideClick = true,
}) => {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Define max-width classes based on size prop
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOutsideClick ? onClose : undefined}
      ></div>

      {/* Modal Panel */}
      <div
        className={`relative z-10 bg-foreground rounded-lg shadow-xl transform transition-all p-4 w-full ${
          maxWidthClasses[maxWidth] || "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between pb-3 border-b">
            <h3 className="text-lg font-medium text-copy">{title}</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="py-4">{children}</div>

        {/* Footer */}
        {
          <div className="pt-3 border-t flex justify-end space-x-3">
            {/* {footer} */}
            <>
              <button
                onClick={() => onClose()}
                className="px-4 py-2 border border-gray-300 rounded text-copy hover:bg-copy-light"
              >
                Cancel
              </button>

            </>
          </div>
        }
      </div>
    </div>
  );
};

export default Modal;
