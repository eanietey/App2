<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useMessageStore } from '@/stores/messageStore'

const userStore = useUserStore()
const store = useMessageStore()

const newMessageText = ref('')

const selectedFriend = computed(() => userStore.selectedFriend)


const finalFilteredMessages = computed(() => {
  if (!selectedFriend.value) return []

  return store.messages.filter(msg => {
    return (
      msg.username === userStore.user.username ||
      msg.username === selectedFriend.value
    )
  })
})


const displayMessages = computed(() => {
   if (!selectedFriend.value) return []
   return finalFilteredMessages.value
})

function sendMessage() {
  const text = newMessageText.value.trim()
  if (text && userStore.user.username && selectedFriend.value) {
    store.addMessage(userStore.user.username, userStore.user.username, '', text)
    newMessageText.value = ''
  }
}


function isOwn(msg) {
  return msg.username === userStore.user.username
}
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
          v-for="(msg, index) in displayMessages"
          :key="index"
          class="message-row"
          :class="{ own: isOwn(msg), other: !isOwn(msg) }"
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
            <div v-if="isOwn(msg)" class="message-actions">
            </div>
          </div>
        </div>
      </div>

      <div class="input-bar">
        <input
          v-model="newMessageText"
          type="text"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" :disabled="!newMessageText.trim()" @click="sendMessage">
          Send
        </button>
      </div>
    </div>

    <div v-else class="no-selection">
      <h2>Welcome {{ userStore.user.username }}</h2>
      <p>Select a friend from the sidebar to start chatting.</p>
    </div>
  </div>
</template>

<style scoped>
.display {
  width: 75%;
  height: inherit;
  border: 1px solid #cbd5e1;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 1.2rem;
  background-color: #f1f5f9;
}

.messenger-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.messenger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #0ea5e9;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  z-index: 10;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-row {
  display: flex;
}

.message-row.own {
  justify-content: flex-end;
}

.message-row.other {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 65%;
  padding: 10px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.message-author {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  opacity: 0.8;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
}

.redacted-text {
  opacity: 0.5;
  letter-spacing: 2px;
}

.message-actions {
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.15s;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.redact-btn {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.unredact-btn {
  background: rgba(255, 255, 255, 0.25);
  color: white;
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
  padding: 12px 18px;
  border: 1px solid #cbd5e1;
  border-radius: 24px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-bar input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.send-btn {
  padding: 12px 24px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
