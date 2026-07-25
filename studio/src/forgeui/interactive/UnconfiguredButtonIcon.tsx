import React from 'react'

type UnconfiguredButtonIconProps = {
  width: number
  height: number
}

const UnconfiguredButtonIcon = ({
  width,
  height,
}: UnconfiguredButtonIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-testid="unconfigured-button-icon"
    style={{
      display: 'block',
      pointerEvents: 'none',
      width: `${width}px`,
      height: `${height}px`,
      minWidth: `${width}px`,
      minHeight: `${height}px`,
      maxWidth: 'none',
      maxHeight: 'none',
      flexShrink: 0,
    }}
  >
    <rect
      x="5"
      y="8"
      width="82"
      height="32"
      rx="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect
      x="13"
      y="15"
      width="66"
      height="18"
      rx="7"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.72"
    />
    <path
      d="M91 3V11M87 7H95"
      stroke="#67E8F9"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M95 14V18M93 16H97"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
)

export default UnconfiguredButtonIcon
