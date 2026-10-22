export function getConversationLinks() {
  return Array.from(document.querySelectorAll('a[href*="/c/"]')).filter(
    (link) => {
      const url = new URL(link.href, window.location.origin)

      return (
        url.origin === window.location.origin &&
        /^\/c\/[^/]+$/.test(url.pathname)
      )
    },
  )
}

export function getConversationId(link) {
  const url = new URL(link.href, window.location.origin)

  return url.pathname.match(/^\/c\/([^/]+)$/)?.[1] ?? null
}

export function getConversationRow(link) {
  let element = link.parentElement

  while (element && element !== document.body) {
    const containsLink = element.contains(link)

    const actionButtons = [
      ...element.querySelectorAll('button[aria-label="Ações do chat"]'),
    ]

    if (containsLink && actionButtons.length === 1) {
      return element
    }

    element = element.parentElement
  }

  return null
}

export function getConversationTitle(link) {
  return link?.innerText?.trim() ?? ''
}

export function findConversationLink(id) {
  return (
    getConversationLinks().find((link) => {
      const rect = link.getBoundingClientRect()

      return (
        getConversationId(link) === id &&
        rect.width > 0 &&
        getConversationRow(link) !== null
      )
    }) ?? null
  )
}

export function containsConversationLink(node) {
  if (!(node instanceof Element)) {
    return false
  }

  return (
    node.matches('a[href*="/c/"]') ||
    node.querySelector('a[href*="/c/"]') !== null
  )
}