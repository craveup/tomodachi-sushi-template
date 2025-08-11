import React from "react";

interface RoundedEdgeProps {
  className?: string;
}

const RoundedEdge = ({ className = "" }: RoundedEdgeProps) => {
  return (
    <div className={`w-6 h-6 ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M0 0H24V24C10.7452 24 0 13.2548 0 0Z"
          fill="var(--backgrounddefault)"
        />
      </svg>
    </div>
  );
};

export default RoundedEdge;
