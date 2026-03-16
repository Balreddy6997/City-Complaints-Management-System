import { useEffect } from "react";

let toastTimeout;

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    toastTimeout = setTimeout(onClose, 3000);
    return () => clearTimeout(toastTimeout);
  }, []);

  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
};

export default Toast;