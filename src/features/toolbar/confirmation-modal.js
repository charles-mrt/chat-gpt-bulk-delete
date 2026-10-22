import { lucideIcon } from '../../shared/icons.js'

let closeActiveModal = null

export function showDeleteConfirmation(
  count,
  unavailableCount = 0,
) {
  closeActiveModal?.(false)

  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.id = 'bulk-delete-modal'
    overlay.className = 'bd-modal-overlay'

    overlay.innerHTML = `
      <section
        class="bd-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="bd-modal-title"
        aria-describedby="bd-modal-description"
        tabindex="-1"
      >
        <div class="bd-modal-header">
          <div class="bd-modal-icon">
            ${lucideIcon('trash', 23)}
          </div>

          <h2 id="bd-modal-title">Excluir conversas?</h2>
        </div>

          <button
            type="button"
            class="bd-modal-close"
            aria-label="Cancelar e fechar"
          >
            ${lucideIcon('x', 18)}
          </button>

          <p id="bd-modal-description">
            Esta ação excluirá permanentemente as conversas
            selecionadas. Não será possível desfazê-la.
          </p>

        <div class="bd-modal-summary">
          <div class="bd-modal-summary-icon">
            ${lucideIcon('messages', 19)}
          </div>

          <div class="bd-modal-summary-copy">
            <strong>Conversas selecionadas</strong>
            <span>Confira a quantidade antes de continuar</span>
          </div>

          <strong class="bd-modal-count">${count}</strong>
        </div>

        ${
          unavailableCount > 0
            ? `
              <p class="bd-modal-warning">
                ${unavailableCount} conversa(s) indisponível(is)
                serão ignoradas.
              </p>
            `
            : ''
        }

        <div class="bd-modal-warning">
          ${lucideIcon('alert', 17)}
          <span>A exclusão é permanente.</span>
        </div>

        <div class="bd-modal-actions">
          <button type="button" class="bd-modal-cancel">
            Cancelar
          </button>

          <button type="button" class="bd-modal-confirm">
            ${lucideIcon('trash', 16)}
            Excluir ${count} ${count === 1 ? 'conversa' : 'conversas'}
          </button>
        </div>
      </section>
    `

    const modal = overlay.querySelector('.bd-modal')
    const cancelButton = overlay.querySelector('.bd-modal-cancel')
    const confirmButton = overlay.querySelector('.bd-modal-confirm')
    const closeButton = overlay.querySelector('.bd-modal-close')

    let finished = false

    function finish(confirmed) {
      if (finished) {
        return
      }

      finished = true
      document.removeEventListener('keydown', onKeyDown)

      if (closeActiveModal === finish) {
        closeActiveModal = null
      }

      overlay.remove()
      resolve(confirmed)
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish(false)
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = [
        cancelButton,
        confirmButton,
        closeButton,
      ]

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    cancelButton.addEventListener('click', () => finish(false))
    closeButton.addEventListener('click', () => finish(false))
    confirmButton.addEventListener('click', () => finish(true))

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        finish(false)
      }
    })

    closeActiveModal = finish

    document.addEventListener('keydown', onKeyDown)
    document.body.appendChild(overlay)

    modal.focus()
  })
}