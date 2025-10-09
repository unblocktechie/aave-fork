import React from 'react';

export const Bag = (props: JSX.IntrinsicElements['svg']) => {
  return (
    <svg
      {...props}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle opacity="0.1" cx="18" cy="18" r="18" fill="#3377FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 11.25C9 10.8358 9.33579 10.5 9.75 10.5H26.25C26.6642 10.5 27 10.8358 27 11.25V15C27 15.4142 26.6642 15.75 26.25 15.75H25.5V24.75C25.5 25.1642 25.1642 25.5 24.75 25.5H11.25C10.8358 25.5 10.5 25.1642 10.5 24.75V15.75H9.75C9.33579 15.75 9 15.4142 9 15V11.25ZM24 24V15.75H12V24H24ZM25.5 14.25H24.75H11.25H10.5V12H25.5V14.25ZM16.5 17.25C16.0858 17.25 15.75 17.5858 15.75 18C15.75 18.4142 16.0858 18.75 16.5 18.75H19.5C19.9142 18.75 20.25 18.4142 20.25 18C20.25 17.5858 19.9142 17.25 19.5 17.25H16.5Z"
        fill="#3377FF"
      />
    </svg>
  );
};
