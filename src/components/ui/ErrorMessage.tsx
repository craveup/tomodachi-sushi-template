import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  message: string;
  className?: string;
  onClick?: any;
}

const ErrorMessage: React.FC<ErrorProps> = ({
  message,
  className = "",
  onClick,
}) => {
  return (
    <div className='text-center'>
      <div
        className={`flex items-center justify-center rounded-md border border-red-400 bg-red-100 p-4 text-red-700 shadow-md ${className}`}
      >
        <svg
          className='mr-2 h-6 w-6 fill-current'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-16a1 1 0 00-1 1v6a1 1 0 002 0V7a1 1 0 00-1-1zm0 10a1 1 0 100 2 1 1 0 000-2z' />
        </svg>
        <span>{message}</span>
      </div>
      {onClick && (
        <Button onClick={onClick} className='mt-2 text-base'>
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
