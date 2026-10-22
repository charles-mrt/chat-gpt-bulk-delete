import {
  findConversationLink,
  getConversationTitle,
} from '../conversations/conversation-dom.js'
import {
  deleteOneConversation,
} from '../conversations/conversation-deletion.js'
import {
  getSelectedConversationIds,
  removeSelectedConversation,
  setDeletionInProgress,
} from '../conversations/conversation-selection.js'
import {
  showDeleteConfirmation,
} from '../toolbar/confirmation-modal.js'

let bulkDeletionRunning = false

function setStatus(message, type = 'info') {
  const status = document.querySelector('#bulk-delete-status')

  if (!status) {
    return
  }

  status.textContent = message
  status.dataset.type = type
}

function setToolbarDisabled(disabled) {
  const toolbar = document.querySelector('#bulk-delete-toolbar')

  if (toolbar) {
    toolbar.querySelectorAll('button').forEach((button) => {
      button.disabled = disabled
    })
  }

  document.querySelectorAll('.bulk-delete-checkbox').forEach((checkbox) => {
    checkbox.disabled = disabled
  })
}

export function isBulkDeletionRunning() {
  return bulkDeletionRunning
}

export async function deleteSelectedConversations() {
  if (bulkDeletionRunning) {
    return
  }

  const selectedIds = getSelectedConversationIds()

 if (selectedIds.length === 0) {
  setStatus(
    'Selecione ao menos uma conversa para excluir.',
    'warning',
  )
  return
}
  const availableIds = []
  let unavailableCount = 0

  for (const id of selectedIds) {
    if (findConversationLink(id)) {
      availableIds.push(id)
    } else {
      unavailableCount += 1
    }
  }

  if (availableIds.length === 0) {
    setStatus(
    'Nenhuma das conversas selecionadas está disponível na lista.',
    'warning',
    )
    return
}

  bulkDeletionRunning = true
  setDeletionInProgress(true)
  setToolbarDisabled(true)

  try {
    const confirmed = await showDeleteConfirmation(
      availableIds.length,
      unavailableCount,
    )

    if (!confirmed) {
      setStatus('Exclusão cancelada.', 'neutral')
      return
    }

    let deletedCount = 0
    let failedTitle = null
    let failedMessage = null

    for (const [index, id] of availableIds.entries()) {
      const link = findConversationLink(id)
      const title = link ? getConversationTitle(link) : id

      setStatus(
        `Excluindo conversa ${index + 1} de ${availableIds.length}: ${title}`,
      )

      try {
        const deletedConversation = await deleteOneConversation(id)

        removeSelectedConversation(id)
        deletedCount += 1

        setStatus(
          `Excluídas ${deletedCount} de ${availableIds.length}. ` +
            `Última: ${deletedConversation.title}`,
        )
      } catch (error) {
        failedTitle = title
        failedMessage =
          error instanceof Error ? error.message : String(error)

        break
      }
    }

    if (failedTitle) {
      setStatus(
        `Exclusão interrompida. ${deletedCount} conversa(s) excluída(s). ` +
          `Falha em "${failedTitle}": ${failedMessage}`,
      )
    } else {
      const unavailableMessage =
        unavailableCount > 0
          ? ` ${unavailableCount} conversa(s) indisponível(is) foram ignoradas.`
          : ''

      setStatus(
        `${deletedCount} conversa(s) excluída(s) com sucesso.${unavailableMessage}`,
      )
    }
  } finally {
    bulkDeletionRunning = false
    setDeletionInProgress(false)
    setToolbarDisabled(false)

    document.dispatchEvent(new CustomEvent('bulk-delete:finished'))
  }
}