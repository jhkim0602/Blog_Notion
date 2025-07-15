import * as React from "react";

export function Baekjoon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      {...props}
    >
      <circle cx="20" cy="20" r="20" fill="#0098FF" />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontFamily="Arial"
        dy=".3em"
      >
        B
      </text>
    </svg>
  );
}
