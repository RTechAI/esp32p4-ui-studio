import React from 'react'

type UnconfiguredToggleIconProps = {
  size?: number
  width?: number
  height?: number
}

const UnconfiguredToggleIcon = ({
  size = 48,
  width,
  height: requestedHeight,
}: UnconfiguredToggleIconProps) => {
  const renderedWidth = width ?? size
  const height = requestedHeight ??
    Math.round(renderedWidth * 40 / 56)

  return (
    <svg
      width={renderedWidth}
      height={height}
    viewBox="0 0 56 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    data-testid="unconfigured-toggle-icon"
    style={{
      display: 'block',
      pointerEvents: 'none',
      width: `${renderedWidth}px`,
      height: `${height}px`,
      minWidth: `${renderedWidth}px`,
      minHeight: `${height}px`,
      maxWidth: 'none',
      maxHeight: 'none',
      flexShrink: 0,
    }}
  >
    <rect
      x="4"
      y="10"
      width="44"
      height="24"
      rx="8"
      stroke="currentColor"
      strokeWidth="2.6"
    />
    <path
      d="M26 11V33"
      stroke="currentColor"
      strokeWidth="1.9"
      opacity="0.7"
    />
    <circle
      cx="16"
      cy="22"
      r="4"
      stroke="currentColor"
      strokeWidth="1.9"
      opacity="0.85"
    />
    <circle
      cx="37"
      cy="22"
      r="4"
      fill="#78B98C"
    />
    <path
      d="M49 3V9M46 6H52"
      stroke="#67E8F9"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M53 11V14M51.5 12.5H54.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.85"
    />
    </svg>
  )
}

export default UnconfiguredToggleIcon
