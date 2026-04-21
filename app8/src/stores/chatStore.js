import { defineStore } from "pinia";
import { reactive, ref, computed } from 'vue'
import { useUserStore } from './userStore'

export const useChatStore = defineStore('chatStore', () => {
  const userStore = useUserStore()

  const chats = ref([])
  const activeChatId = ref(null)
  const messages = reactive({})
  const invitations = ref([])

  const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

  
  async function loadChats() {
    if (!userStore.user.authToken) return

    try {
      const response = await fetch(`${host}/user`, { headers: userStore.authHeaders() })
      if (!response.ok) return

      const userData = await response.json()

      
      invitations.value = userData.requests.filter(req => req.kind === 'ChatInvite')

      
      const chatDetails = await Promise.all(
        (userData.chat_sessions || []).map(id => getChatData(id))
      )
      chats.value = chatDetails.filter(c => c !== null)
    } catch (e) {
      console.error('Error loading chats:', e)
    }
  }

  async function getChatData(chatId) {
    try {
      const response = await fetch(`${host}/chat/${chatId}`, { headers: userStore.authHeaders() })
      if (!response.ok) return null
      return await response.json()
    } catch (e) {
      console.error('Error getting chat data:', e)
      return null
    }
  }

  async function createGroupChat(groupName) {
    try {
      const response = await fetch(`${host}/chat`, {
        method: 'POST',
        headers: userStore.authHeaders(),
        body: JSON.stringify({ group_name: groupName, chat_type: 'group' })
      })
      if (response.ok) {
        await loadChats()
        return { success: true }
      }
      return { success: false, message: 'Failed to create chat' }
    } catch (e) {
      console.error('Error creating chat:', e)
      return { success: false, message: 'Network error' }
    }
  }

  async function getMessages(chatId) {
    try {
      const response = await fetch(`${host}/chat/${chatId}/messages`, { headers: userStore.authHeaders() })
      if (response.ok) {
        const result = await response.json()
        messages[chatId] = Array.isArray(result) ? result : []
      }
    } catch (e) {
      console.error('Error getting messages:', e)
    }
  }

  async function postMessage(text) {
    if (!activeChatId.value || !text.trim()) return

    try {
      const response = await fetch(`${host}/chat/${activeChatId.value}/message`, {
        method: 'POST',
        headers: userStore.authHeaders(),
        body: JSON.stringify({ message: text.trim() })
      })
      if (response.ok) {
        await getMessages(activeChatId.value)
      }
    } catch (e) {
      console.error('Error posting message:', e)
    }
  }

  async function inviteUser(username) {
    if (!activeChatId.value || !username) return { success: false, message: 'Invalid active chat or user' }

    
    const users = await userStore.searchUsers(username)
    const targetUser = users.find(u => u.username === username)

    if (!targetUser) return { success: false, message: 'User not found' }

    return await sendInvite(activeChatId.value, targetUser._id)
  }

  async function sendInvite(chatId, userId) {
    try {
      const response = await fetch(`${host}/chat/${chatId}/invitation/${userId}`, {
        method: 'POST',
        headers: userStore.authHeaders()
      })
      if (response.ok) return { success: true }
      if (response.status === 409) return { success: false, message: 'User already in chat or invited' }
      return { success: false, message: 'Failed to invite user' }
    } catch (e) {
      console.error('Error sending invite:', e)
      return { success: false, message: 'Network error' }
    }
  }

  async function respondToInvite(requestId, acceptStatus) {
    try {
      
      const invite = invitations.value.find(i => i._id === requestId)
      if (!invite) return { success: false, message: 'Invitation not found' }

      const response = await fetch(`${host}/chat/${invite.chat.chatId}/invitation/${requestId}?accept=${acceptStatus}`, {
        method: 'PATCH',
        headers: userStore.authHeaders()
      })
      if (response.ok) {
        await loadChats()
        return { success: true }
      }
      return { success: false, message: 'Failed to process invitation' }
    } catch (e) {
      console.error('Error responding to invite:', e)
      return { success: false, message: 'Network error' }
    }
  }

  async function leaveChat() {
    if (!activeChatId.value) return

    try {
      const response = await fetch(`${host}/chat/${activeChatId.value}/membership`, {
        method: 'DELETE',
        headers: userStore.authHeaders()
      })
      if (response.ok) {
        const idToRemove = activeChatId.value
        activeChatId.value = null
        chats.value = chats.value.filter(c => c._id !== idToRemove)
        return { success: true }
      }
      return { success: false, message: 'Failed to leave chat' }
    } catch (e) {
      console.error('Error leaving chat:', e)
      return { success: false, message: 'Network error' }
    }
  }

  const activeChatDetails = computed(() => {
    if (!activeChatId.value) return null
    return chats.value.find(c => c._id === activeChatId.value) || null
  })

  
  let pollInterval = null
  function startPolling() {
      if (pollInterval) clearInterval(pollInterval)
      pollInterval = setInterval(async () => {
          if (activeChatId.value) {
              await getMessages(activeChatId.value)
          }
      }, 5000)
  }

  function stopPolling() {
      if (pollInterval) {
          clearInterval(pollInterval)
          pollInterval = null
      }
  }

  return {
    chats,
    activeChatId,
    messages,
    invitations,
    activeChatDetails,
    loadChats,
    createGroupChat,
    getChatData,
    getMessages,
    postMessage,
    inviteUser,
    respondToInvite,
    leaveChat,
    startPolling,
    stopPolling
  }
})
