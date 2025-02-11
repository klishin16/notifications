import React from "react";

const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: string;
  onClose: () => void;
}) => {
  const getColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={`fixed z-100 right-4 bottom-4 rounded-lg p-4 text-white ${getColor()}`}
    >
      {message}
      <button onClick={onClose} className="ml-4">
        &times;
      </button>
    </div>
  );
};

export default Notification;
