const icons = {
  bot: `
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  `,
  messages: `
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  `,
  checkSquare: `
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="m9 12 2 2 4-4" />
  `,
  listChecks: `
    <path d="m3 5 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
    <path d="m3 11 2 2 4-4" />
    <path d="m3 17 2 2 4-4" />
  `,
  trash: `
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m19 6-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  `,
  rotate: `
    <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
    <path d="M8 16H3v5" />
  `,
  alert: `
    <path d="m10.29 3.86-8.3 14.36A2 2 0 0 0 3.72 21h16.56a2 2 0 0 0 1.73-2.78l-8.3-14.36a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  `,
  x: `
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  `,
  arrowRight: `
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  `,
}

export function lucideIcon(name, size = 18) {
  const paths = icons[name]

  if (!paths) {
    return ''
  }

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      ${paths}
    </svg>
  `
}