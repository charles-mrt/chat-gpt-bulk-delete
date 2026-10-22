const icons = {
  bot: `
    <path d="M12 6V2H8" />
    <path d="M15 11v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    <path d="M9 11v2" />
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
  close: `
  <path d="M18 6 6 18" />
  <path d="m6 6 12 12" />
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