import { useEffect } from "react";

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const toastTimeout = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(toastTimeout);
  }, [onClose]);

  if (!msg) return null;

  return <div className={`toast ${type}`}>{msg}</div>;
};

export default Toast;