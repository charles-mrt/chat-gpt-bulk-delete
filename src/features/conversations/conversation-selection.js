const selectedConversations = new Set()

let deletionInProgress = false

export function getSelectedConversations() {
  return new Set(selectedConversations)
}

export function getSelectedConversationIds() {
  return Array.from(selectedConversations)
}

export function getSelectedConversationCount() {
  return selectedConversations.size
}

export function isConversationSelected(id) {
  return selectedConversations.has(id)
}

export function selectConversation(id) {
  if (deletionInProgress || !id) {
    return false
  }

  selectedConversations.add(id)

  return true
}

export function deselectConversation(id) {
  if (deletionInProgress || !id) {
    return false
  }

  selectedConversations.delete(id)

  return true
}

export function toggleConversationSelection(id, checked) {
  if (deletionInProgress || !id) {
    return false
  }

  if (checked) {
    selectedConversations.add(id)
  } else {
    selectedConversations.delete(id)
  }

  return true
}

export function selectConversations(ids) {
  if (deletionInProgress) {
    return false
  }

  for (const id of ids) {
    if (id) {
      selectedConversations.add(id)
    }
  }

  return true
}

export function clearSelection() {
  if (deletionInProgress) {
    return false
  }

  selectedConversations.clear()

  return true
}

export function removeSelectedConversation(id) {
  selectedConversations.delete(id)
}

export function setDeletionInProgress(value) {
  deletionInProgress = Boolean(value)
}

export function isDeletionInProgress() {
  return deletionInProgress
}