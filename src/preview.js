import { createToolbar } from './features/toolbar/toolbar.js'
const toolbar = createToolbar()

for (const id of [
  'bulk-delete-selected',
  'bulk-open-extension-settings',
]) {
  const button = toolbar.querySelector(`#${id}`)

  if (button) {
    const previewButton = button.cloneNode(true)
    button.replaceWith(previewButton)

    previewButton.addEventListener('click', () => {
      const message =
        id === 'bulk-delete-selected'
          ? 'A exclusão está desativada no preview.'
          : 'Configurações indisponíveis no preview.'

      toolbar.querySelector('#bulk-delete-status').textContent = message
    })
  }
}