import React from 'react';

export const ArrowIcon = (props: JSX.IntrinsicElements['svg']) => {
  return (
    <svg
      {...props}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_0_1763)">
        <path
          d="M19.85 11.6125L15 16.4625L10.15 11.6125C9.66248 11.125 8.87498 11.125 8.38748 11.6125C7.89998 12.1 7.89998 12.8875 8.38748 13.375L14.125 19.1125C14.6125 19.6 15.4 19.6 15.8875 19.1125L21.625 13.375C22.1125 12.8875 22.1125 12.1 21.625 11.6125C21.1375 11.1375 20.3375 11.125 19.85 11.6125Z"
          fill="#9FB1E8"
        />
      </g>
      <defs>
        <clipPath id="clip0_0_1763">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
