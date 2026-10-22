import {
  findConversationLink,
  getConversationRow,
  getConversationTitle,
} from './conversation-dom.js'

function normalizeText(value) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function waitForElement(
  getElement,
  timeout = 5000,
  description = 'elemento',
) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    function checkElement() {
      const element = getElement()

      if (element) {
        resolve(element)
        return
      }

      if (Date.now() - startTime >= timeout) {
        reject(
          new Error(`Tempo limite aguardando: ${description}.`),
        )
        return
      }

      setTimeout(checkElement, 100)
    }

    checkElement()
  })
}

function getOpenMenuForButton(actionButton) {
  if (actionButton.getAttribute('data-state') !== 'open') {
    return null
  }

  return (
    Array.from(
      document.querySelectorAll('[role="menu"][data-state="open"]'),
    ).find((menu) => {
      const rect = menu.getBoundingClientRect()

      return rect.width > 0 && rect.height > 0
    }) ?? null
  )
}

function getDeleteMenuItem(menu) {
  return (
    Array.from(menu.querySelectorAll('[role="menuitem"]')).find(
      (item) => normalizeText(item.textContent) === 'excluir',
    ) ?? null
  )
}

function getConfirmationForm() {
  return (
    Array.from(document.querySelectorAll('form')).find((form) => {
      const text = normalizeText(form.innerText)

      return (
        text.includes('excluir chat?') &&
        text.includes('nao sera possivel desfazer')
      )
    }) ?? null
  )
}

function getConfirmationButton(form) {
  return (
    Array.from(form.querySelectorAll('button[type="submit"]')).find(
      (button) => normalizeText(button.textContent) === 'excluir chat',
    ) ?? null
  )
}

function getCancelButton(form) {
  return (
    Array.from(form.querySelectorAll('button')).find(
      (button) => normalizeText(button.textContent) === 'cancelar',
    ) ?? null
  )
}

export async function deleteOneConversation(id) {
  const link = findConversationLink(id)

  if (!link) {
    throw new Error(
      'A conversa não está disponível na barra lateral. Ela não foi excluída.',
    )
  }

  const title = getConversationTitle(link)

  if (!title) {
    throw new Error(
      'Não foi possível identificar o título da conversa. Exclusão interrompida.',
    )
  }

  const row = getConversationRow(link)
  const actionButton = row?.querySelector(
    'button[aria-label="Ações do chat"]',
  )

  if (!actionButton) {
    throw new Error(
      `Não foi possível encontrar o botão de ações da conversa "${title}".`,
    )
  }

  if (
    document.querySelector('[role="menu"][data-state="open"]')
  ) {
    throw new Error(
      'Já existe um menu aberto. Feche-o antes de continuar.',
    )
  }

  actionButton.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: 1,
    }),
  )

  const menu = await waitForElement(
    () => getOpenMenuForButton(actionButton),
    5000,
    `menu de ações da conversa "${title}"`,
  )

  const deleteMenuItem = await waitForElement(
    () => getDeleteMenuItem(menu),
    5000,
    `opção Excluir da conversa "${title}"`,
  )

  deleteMenuItem.click()

  const confirmationForm = await waitForElement(
    getConfirmationForm,
    5000,
    'diálogo "Excluir chat?"',
  )

  const confirmationText = normalizeText(confirmationForm.innerText)
  const normalizedTitle = normalizeText(title)

  if (!confirmationText.includes(normalizedTitle)) {
    getCancelButton(confirmationForm)?.click()

    throw new Error(
      `O título no diálogo não corresponde a "${title}". A operação foi interrompida.`,
    )
  }

  const confirmationButton = await waitForElement(
    () => getConfirmationButton(confirmationForm),
    5000,
    `botão de confirmação da conversa "${title}"`,
  )

  confirmationButton.click()

  await waitForElement(
    () => (findConversationLink(id) ? null : true),
    10000,
    `desaparecimento da conversa "${title}"`,
  )

  return { id, title }
}