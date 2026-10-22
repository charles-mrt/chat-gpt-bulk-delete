import {
  getConversationId,
  getConversationLinks,
} from '../conversations/conversation-dom.js'
import {
  clearSelection,
  getSelectedConversationCount,
  isConversationSelected,
  selectConversations,
} from '../conversations/conversation-selection.js'
import { deleteSelectedConversations } from '../bulk-delete/bulk-deletion.js'
import { lucideIcon } from '../../shared/icons.js'

export const TOOLBAR_ID = 'bulk-delete-toolbar'

export function updateCounter() {
  const counter = document.querySelector('#bulk-delete-counter')

  if (counter) {
    counter.textContent = `${getSelectedConversationCount()} selecionada(s)`
  }
}

export function setStatus(message) {
  const status = document.querySelector('#bulk-delete-status')

  if (status) {
    status.textContent = message
  }
}

export function setToolbarDisabled(disabled) {
  const toolbar = document.querySelector(`#${TOOLBAR_ID}`)

  toolbar?.querySelectorAll('button').forEach((button) => {
    button.disabled = disabled
  })

  document.querySelectorAll('.bulk-delete-checkbox').forEach((checkbox) => {
    checkbox.disabled = disabled
  })
}

export function createToolbar() {
  let toolbar = document.querySelector(`#${TOOLBAR_ID}`)

  if (toolbar) {
    updateCounter()
    return toolbar
  }

  toolbar = document.createElement('section')
  toolbar.id = TOOLBAR_ID
  toolbar.setAttribute('aria-label', 'Exclusão de conversas')

  toolbar.innerHTML = `
    <header class="bd-header">
      <div class="bd-brand">
        <div class="bd-brand-icon">
          ${lucideIcon('bot', 21)}
        </div>

        <div class="bd-brand-copy">
          <h2>ChatGPT Bulk Delete</h2>
          <p>Remova vários chats de uma só vez</p>
        </div>
      </div>

      <div class="bd-selection-badge">
        <span class="bd-selection-dot"></span>
        <span id="bulk-delete-counter" aria-live="polite">0 selecionada(s)</span>
      </div>
    </header>

    <div
      class="bd-status"
      id="bulk-delete-status"
      role="status"
      aria-live="polite"
    >
      Selecione as conversas que deseja excluir.
    </div>

    <div class="bd-divider"></div>

    <div class="bd-section-label">
      <span>SELEÇÃO</span>
    </div>

    <div class="bd-actions">
      <button
        type="button"
        id="bulk-select-visible"
        class="bd-button bd-button-secondary bd-button-select"
      >
        ${lucideIcon('checkSquare', 17)}
        <span>Selecionar visíveis</span>
      </button>

      <button
        type="button"
        id="bulk-clear-selection"
        class="bd-button bd-button-icon"
        aria-label="Limpar seleção"
        title="Limpar seleção"
      >
        ${lucideIcon('rotate', 17)}
      </button>
    </div>

    <button
      type="button"
      id="bulk-delete-selected"
      class="bd-button bd-button-danger bd-delete-button"
    >
      ${lucideIcon('trash', 17)}
      <span>Excluir selecionadas</span>
      ${lucideIcon('arrowRight', 17)}
    </button>

    <p class="bd-footer-note">
      ${lucideIcon('alert', 14)}
      <span>A exclusão é permanente.</span>
    </p>

    <div class="bd-footer">
      <small class="bd-footer-version">v1.0.0</small>

      <button
        type="button"
        id="bulk-open-extension-settings"
        class="bd-footer-manage"
      >
        Gerenciar extensão
        ${lucideIcon('arrowRight', 13)}
      </button>
    </div>
  `

  document.body.appendChild(toolbar)

  toolbar
    .querySelector('#bulk-select-visible')
    .addEventListener('click', () => {
      const ids = getConversationLinks()
        .map(getConversationId)
        .filter(Boolean)

      selectConversations(ids)

      document.dispatchEvent(
        new CustomEvent('bulk-delete:selection-changed'),
      )

      setStatus(`${ids.length} conversa(s) visível(is) selecionada(s).`)
    })

  toolbar
    .querySelector('#bulk-clear-selection')
    .addEventListener('click', () => {
      clearSelection()

      document.dispatchEvent(
        new CustomEvent('bulk-delete:selection-changed'),
      )

      setStatus('Seleção limpa.')
    })

  toolbar
    .querySelector('#bulk-delete-selected')
    .addEventListener('click', () => {
      void deleteSelectedConversations()
    })

  toolbar
    .querySelector('#bulk-open-extension-settings')
    .addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'open-extension-settings',
      })
    })

  updateCounter()

  return toolbar
}

export function refreshToolbarCounter() {
  updateCounter()
}

export function syncToolbarSelection() {
  document.querySelectorAll('.bulk-delete-checkbox').forEach((checkbox) => {
    const id = checkbox.dataset.conversationId

    if (id) {
      checkbox.checked = isConversationSelected(id)
    }
  })

  updateCounter()
}