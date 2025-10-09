export const GradientButtonBg = (props: JSX.IntrinsicElements['svg']) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="193"
      height="42"
      viewBox="0 0 193 42"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_b_0_3104)">
        <path
          d="M0 10C0 4.47715 4.47715 0 10 0H183C188.523 0 193 4.47715 193 10V32C193 37.5228 188.523 42 183 42H10C4.47715 42 0 37.5228 0 32V10Z"
          fill="url(#paint0_linear_0_3104)"
          fillOpacity="0.25"
        />
        <path
          d="M1 10C1 5.02944 5.02944 1 10 1H183C187.971 1 192 5.02944 192 10V32C192 36.9706 187.971 41 183 41H10C5.02944 41 1 36.9706 1 32V10Z"
          stroke="url(#paint1_linear_0_3104)"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_0_3104"
          x="-17"
          y="-17"
          width="227"
          height="76"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="8.5" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_0_3104" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_0_3104"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_0_3104"
          x1="1.63144e-06"
          y1="13.9995"
          x2="181.572"
          y2="13.9995"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3377FF" />
          <stop offset="1" stopColor="#33B6FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_0_3104"
          x1="1.63144e-06"
          y1="13.9995"
          x2="181.572"
          y2="13.9995"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#333AFF" />
          <stop offset="1" stopColor="#33B6FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
