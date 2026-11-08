import * as Toast from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import "./Toast.css";

interface ToastContextType {
  showToast: (title: string, message: string, duration?: number) => void;
}

interface ToastData {
  id: number;
  title: string;
  message: string;
  duration: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [nextId, setNextId] = useState(0);

  const showToast = useCallback(
    (title: string, message: string, duration: number = 3000) => {
      setNextId((id) => {
        const newId = id + 1;

        setToast({
          id: newId,
          title,
          message,
          duration,
        });

        return newId;
      });
    },
    [],
  );

  const toastLayer = (
    <Toast.Provider swipeDirection="right">
      {toast && (
        <Toast.Root
          key={toast.id}
          className="toast-root"
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setToast(null);
            }
          }}
          duration={toast.duration}
        >
          <div className="toast-content">
            <Toast.Title className="toast-title">{toast.title}</Toast.Title>

            <Toast.Description className="toast-description">
              {toast.message}
            </Toast.Description>
          </div>

          <Toast.Close className="toast-close" aria-label="Close notification">
            Close
          </Toast.Close>
        </Toast.Root>
      )}

      <Toast.Viewport className="toast-viewport" />
    </Toast.Provider>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {typeof document !== "undefined" &&
        createPortal(toastLayer, document.body)}
    </ToastContext.Provider>
  );
};
