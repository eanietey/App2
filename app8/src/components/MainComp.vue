<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useMessageStore } from '@/stores/messageStore'
import { useChatStore } from '@/stores/chatStore'

const userStore = useUserStore()
const friendMessageStore = useMessageStore()
const chatStore = useChatStore()

const newFriendMessage = ref('')

const newGroupMessage = ref('')
const newInviteUsername = ref('')
const isInviting = ref(false)

const selectedFriend = computed(() => userStore.selectedFriend)
const activeChatId = computed(() => chatStore.activeChatId)
const activeGroupDetails = computed(() => chatStore.activeChatDetails)

const displayFriendMessages = computed(() => {
  if (!selectedFriend.value) return []
  return friendMessageStore.messages.filter(msg => {
    return (msg.username === userStore.user.username || msg.username === selectedFriend.value)
  })
})

function sendFriendMessage() {
  const text = newFriendMessage.value.trim()
  if (text && userStore.user.username && selectedFriend.value) {
    friendMessageStore.addMessage(userStore.user.username, userStore.user.username, '', text)
    newFriendMessage.value = ''
  }
}

function isOwnFriendMsg(msg) {
  return msg.username === userStore.user.username
}


const displayGroupMessages = computed(() => {
  if (!activeChatId.value) return []
  return chatStore.messages[activeChatId.value] || []
})

function isOwnGroupMsg(msg) {
  return msg.sender === userStore.user.userId
}

function getSenderName(msg) {
  if (msg.sender === userStore.user.userId) return userStore.user.username
  if (activeGroupDetails.value && activeGroupDetails.value.users) {
     const u = activeGroupDetails.value.users.find(u => u.user_id === msg.sender)
     if (u) return u.username
  }
  return 'Unknown'
}

async function sendGroupMessage() {
  const text = newGroupMessage.value.trim()
  if (text && activeChatId.value) {
    await chatStore.postMessage(text)
    newGroupMessage.value = ''
  }
}

async function handleInviteUser() {
  const username = newInviteUsername.value.trim()
  if (!username) return
  isInviting.value = true
  const res = await chatStore.inviteUser(username)
  if (res.success) {
    newInviteUsername.value = ''
    alert(`Invite sent to ${username}`)
  } else {
    alert(res.message)
  }
  isInviting.value = false
}

async function handleLeaveGroup() {
  if (confirm("Are you sure you want to leave this group chat?")) {
    const res = await chatStore.leaveChat()
    if (!res.success) alert(res.message)
  }
}

watch(activeChatId, (newId) => {
  if (newId) {
    chatStore.getMessages(newId)
  }
})

onMounted(() => {
  chatStore.startPolling()
})
onUnmounted(() => {
  chatStore.stopPolling()
})

</script>

<template>
  <div class="display">
    
    <div v-if="selectedFriend" class="messenger-page">
      <header class="messenger-header">
        <div class="header-left">
          <h2>Chat with {{ selectedFriend }}</h2>
        </div>
      </header>

      <div class="messages-container">
        <div
          v-for="(msg, index) in displayFriendMessages"
          :key="index"
          class="message-row"
          :class="{ own: isOwnFriendMsg(msg), other: !isOwnFriendMsg(msg) }"
        >
          <div class="message-bubble">
            <div class="message-author">{{ msg.firstName }}</div>
            <div class="message-text">
              <template v-if="msg.redacted">
                <span class="redacted-text">message redacted</span>
              </template>
              <template v-else>
                {{ msg.message }}
              </template>
            </div>
            <div class="message-timestamp" v-if="msg.createdAt">
              {{ new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
            </div>
          </div>
        </div>
      </div>

      <div class="input-bar">
        <input
          v-model="newFriendMessage"
          type="text"
          placeholder="Type a message..."
          @keyup.enter="sendFriendMessage"
        />
        <button class="send-btn" :disabled="!newFriendMessage.trim()" @click="sendFriendMessage">
          Send
        </button>
      </div>
    </div>


    <div v-else-if="activeChatId && activeGroupDetails" class="messenger-page">
      <header class="messenger-header">
        <div class="header-left">
          <div class="group-icon">{{ activeGroupDetails.group_name.charAt(0).toUpperCase() }}</div>
          <div>
            <h2>{{ activeGroupDetails.group_name }}</h2>
            <p class="members-subtitle">{{ activeGroupDetails.users.length }} Members</p>
          </div>
        </div>
        
        <div class="header-right">
          <div class="invite-container">
            <input 
              v-model="newInviteUsername" 
              placeholder="Username to invite..." 
              @keyup.enter="handleInviteUser"
              :disabled="isInviting"
            />
            <button @click="handleInviteUser" :disabled="isInviting" class="btn-invite">Invite</button>
          </div>
          <button @click="handleLeaveGroup" class="btn-leave">Leave</button>
        </div>
      </header>

      <div class="messages-container custom-scrollbar">
        <div
          v-for="msg in displayGroupMessages"
          :key="msg._id"
          class="message-row"
          :class="{ own: isOwnGroupMsg(msg), other: !isOwnGroupMsg(msg) }"
        >
          <div class="message-bubble group-bubble">
            <div class="message-author">{{ getSenderName(msg) }}</div>
            <div class="message-text">
              {{ msg.content }}
            </div>
            <div class="message-timestamp" v-if="msg.createdAt">
              {{ new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
            </div>
          </div>
        </div>
        <p v-if="displayGroupMessages.length === 0" class="empty-messages">Send a message to start the conversation!</p>
      </div>

      <div class="input-bar">
        <input
          v-model="newGroupMessage"
          type="text"
          placeholder="Message group..."
          @keyup.enter="sendGroupMessage"
        />
        <button class="send-btn" :disabled="!newGroupMessage.trim()" @click="sendGroupMessage">
          Send
        </button>
      </div>
    </div>


    <div v-else class="no-selection">
      <h2>Welcome {{ userStore.user.username }}</h2>
      <p>Select a friend or a group chat to start chatting.</p>
    </div>
  </div>
</template>

<style scoped>
.display {
  flex: 1;
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0 12px 12px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 2px 0 10px rgba(0,0,0,0.03);
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 1.1rem;
  background-color: #f8fafc;
}

.no-selection h2 {
  color: #334155;
  margin-bottom: 8px;
  font-size: 24px;
}

.messenger-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f1f5f9;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.messenger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #0ea5e9;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.members-subtitle {
  margin: 2px 0 0 0;
  font-size: 13px;
  opacity: 0.8;
}

.group-icon {
  width: 40px;
  height: 40px;
  background: white;
  color: #0ea5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.invite-container {
  display: flex;
  gap: 6px;
  background: rgba(255,255,255,0.1);
  padding: 4px;
  border-radius: 8px;
}

.invite-container input {
  padding: 6px 10px;
  border: none;
  background: rgba(255,255,255,0.8);
  border-radius: 4px;
  font-size: 13px;
  width: 140px;
}

.btn-invite {
  background: white;
  color: #0ea5e9;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
}

.btn-leave {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;
}
.btn-leave:hover {
  background: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 0.8);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-messages {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  margin: auto;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.own {
  justify-content: flex-end;
}

.message-row.other {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 65%;
  padding: 12px 18px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.group-bubble {
  display: flex;
  flex-direction: column;
}

.message-row.own .message-bubble {
  background: #0ea5e9;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-row.other .message-bubble {
  background: white;
  color: #334155;
  border-bottom-left-radius: 4px;
}

.message-author {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  opacity: 0.8;
}

.message-row.own .message-author {
  display: none;
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
}

.message-timestamp {
  font-size: 10px;
  opacity: 0.7;
  align-self: flex-end;
  margin-top: 6px;
}

.input-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.input-bar input {
  flex: 1;
  padding: 14px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  font-size: 15px;
  color: #334155;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #f8fafc;
}

.input-bar input:focus {
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.send-btn {
  padding: 14px 28px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>
