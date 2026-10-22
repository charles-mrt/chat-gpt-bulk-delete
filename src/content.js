import {
  containsConversationLink,
  getConversationId,
  getConversationLinks,
} from './features/conversations/conversation-dom.js'
import {
  isConversationSelected,
  isDeletionInProgress,
  toggleConversationSelection,
} from './features/conversations/conversation-selection.js'
import {
  createToolbar,
  setToolbarDisabled,
  updateCounter,
} from './features/toolbar/toolbar.js'

const CHECKBOX_CLASS = 'bulk-delete-checkbox'
const TOOLBAR_ID = 'bulk-delete-toolbar'

let observerScheduled = false

function addCheckbox(link) {
  if (link.querySelector(`.${CHECKBOX_CLASS}`)) {
    return
  }

  const id = getConversationId(link)

  if (!id) {
    return
  }

  const checkbox = document.createElement('input')

  checkbox.type = 'checkbox'
  checkbox.className = CHECKBOX_CLASS
  checkbox.dataset.conversationId = id
  checkbox.checked = isConversationSelected(id)
  checkbox.disabled = isDeletionInProgress()
  checkbox.setAttribute('aria-label', 'Selecionar conversa')

  checkbox.addEventListener('click', (event) => {
    event.stopPropagation()
  })

  checkbox.addEventListener('change', () => {
    if (isDeletionInProgress()) {
      checkbox.checked = isConversationSelected(id)
      return
    }

    toggleConversationSelection(id, checkbox.checked)
    updateCounter()
  })

  link.prepend(checkbox)
}

function refreshCheckboxes() {
  getConversationLinks().forEach((link) => {
    addCheckbox(link)

    const checkbox = link.querySelector(`.${CHECKBOX_CLASS}`)
    const id = getConversationId(link)

    if (checkbox && id) {
      checkbox.dataset.conversationId = id
      checkbox.checked = isConversationSelected(id)
      checkbox.disabled = isDeletionInProgress()
    }
  })

  updateCounter()
}

function scheduleRefresh() {
  if (observerScheduled) {
    return
  }

  observerScheduled = true

  requestAnimationFrame(() => {
    observerScheduled = false

    if (!document.body) {
      return
    }

    createToolbar()
    refreshCheckboxes()
  })
}

function registerAudiowideFont() {
  const font = new FontFace(
    'Audiowide',
    `url("${chrome.runtime.getURL('assets/fonts/audiowide-regular.woff2')}")`,
    {
      weight: '400',
      style: 'normal',
    },
  )

  font.load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont)
    })
    .catch((error) => {
      console.error('Erro ao carregar Audiowide:', error)
    })
}

function initialize() {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', initialize, {
      once: true,
    })

    return
  }

  createToolbar()
  refreshCheckboxes()

  document.addEventListener('bulk-delete:selection-changed', () => {
    refreshCheckboxes()
  })

  document.addEventListener('bulk-delete:finished', () => {
    setToolbarDisabled(false)
    refreshCheckboxes()
  })

  const observer = new MutationObserver((mutations) => {
    const toolbarMissing = !document.getElementById(TOOLBAR_ID)

    const conversationListChanged = mutations.some((mutation) => {
      const changedNodes = [
        ...mutation.addedNodes,
        ...mutation.removedNodes,
      ]

      return changedNodes.some((node) => {
        if (!(node instanceof Element)) {
          return false
        }

        if (node.closest(`#${TOOLBAR_ID}`)) {
          return false
        }

        if (node.matches(`.${CHECKBOX_CLASS}`)) {
          return false
        }

        return containsConversationLink(node)
      })
    })

    if (toolbarMissing || conversationListChanged) {
      scheduleRefresh()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

registerAudiowideFont()
initialize()