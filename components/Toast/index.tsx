import React from "react";
import Image from "next/image";
import { Toast } from "react-hot-toast";

interface CustomToastProps {
  t: Toast;
  title: string;
  message: string;
  onClose: () => void;
  icon: string;
  bgColor: string;
  textColor: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
  t,
  title,
  message,
  onClose,
  icon,
  bgColor,
  textColor,
}) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Image
              width={40}
              height={40}
              className="h-10 w-10 rounded-full "
              src={icon}
              alt="아이콘"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium" style={{ color: textColor }}>
              {title}
            </p>
            <p className="mt-1 text-sm" style={{ color: textColor }}>
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium"
          style={{ color: textColor }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
