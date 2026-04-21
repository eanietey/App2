<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useChatStore } from '@/stores/chatStore';

const userStore = useUserStore()
const chatStore = useChatStore()
const currentUser = computed(() => userStore.user.username)

const globalRequests = ref(JSON.parse(localStorage.getItem('friendRequests')) || {})
const allFriends = ref(JSON.parse(localStorage.getItem('friendships')) || {})

watch(globalRequests, (val) => localStorage.setItem('friendRequests', JSON.stringify(val)), { deep: true })
watch(allFriends, (val) => localStorage.setItem('friendships', JSON.stringify(val)), { deep: true })

const friends = computed(() => {
  return allFriends.value[currentUser.value] || []
})

function selectFriend(friend) {
  chatStore.activeChatId = null
  userStore.selectedFriend = friend
}

function selectGroup(chat) {
  userStore.selectedFriend = null
  chatStore.activeChatId = chat._id
}

const incomingRequests = computed(() => {
  return globalRequests.value[currentUser.value] || []
})

function acceptRequest(user) {
  if (globalRequests.value[currentUser.value]) {
    globalRequests.value[currentUser.value] = globalRequests.value[currentUser.value].filter(u => u !== user)
  }

  if (!allFriends.value[currentUser.value]) allFriends.value[currentUser.value] = []
  if (!allFriends.value[user]) allFriends.value[user] = []

  if (!allFriends.value[currentUser.value].includes(user)) {
    allFriends.value[currentUser.value].push(user)
  }
  if (!allFriends.value[user].includes(currentUser.value)) {
    allFriends.value[user].push(currentUser.value)
  }
}

function rejectRequest(user) {
  if (globalRequests.value[currentUser.value]) {
    globalRequests.value[currentUser.value] = globalRequests.value[currentUser.value].filter(u => u !== user)
  }
}

function removeFriend(user) {
  if (allFriends.value[currentUser.value]) {
    allFriends.value[currentUser.value] = allFriends.value[currentUser.value].filter(u => u !== user)
  }
  if (allFriends.value[user]) {
    allFriends.value[user] = allFriends.value[user].filter(u => u !== currentUser.value)
  }
  if (userStore.selectedFriend === user) {
    userStore.selectedFriend = null
  }
}

const searchQuery = ref('')
const searchError = ref('')

function sendFriendRequest() {
  const target = searchQuery.value.trim()
  if (!target) return

  if (target === currentUser.value) {
    searchError.value = "You cannot add yourself"
    return
  }

  if (!globalRequests.value[target]) globalRequests.value[target] = []
  if (!allFriends.value[currentUser.value]) allFriends.value[currentUser.value] = []

  if (!globalRequests.value[target].includes(currentUser.value) && !allFriends.value[currentUser.value].includes(target)) {
    globalRequests.value[target].push(currentUser.value)
    searchError.value = ''
    searchQuery.value = ''
    alert(`Friend request sent to ${target}!`)
  } else {
    searchError.value = "User is already a friend or request already sent"
  }
}


const activeTab = ref('friends')


const newGroupName = ref('')
const isCreatingGroup = ref(false)

onMounted(() => {
  chatStore.loadChats()
})

async function handleCreateGroup() {
  const name = newGroupName.value.trim()
  if (!name) return
  isCreatingGroup.value = true
  const res = await chatStore.createGroupChat(name)
  if (res.success) {
    newGroupName.value = ''
    alert(`Group "${name}" created!`)
  } else {
    alert(res.message)
  }
  isCreatingGroup.value = false
}

async function respondToChatInvite(reqId, accept) {
  const res = await chatStore.respondToInvite(reqId, accept)
  if (!res.success) {
    alert(res.message)
  }
}

</script>

<template>
  <div class="display">
    <div class="tabs">
      <button :class="{ active: activeTab === 'friends' }" @click="activeTab = 'friends'">Friends</button>
      <button :class="{ active: activeTab === 'groups' }" @click="activeTab = 'groups'">Groups</button>
    </div>

    <div v-if="activeTab === 'friends'" class="tab-content">
      <div class="section add-section">
        <h3>Add a Friend</h3>
        <div class="form-row">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Username..."
            @keyup.enter="sendFriendRequest"
          />
          <button @click="sendFriendRequest" class="btn-primary">Add</button>
        </div>
        <p v-if="searchError" class="error-msg">{{ searchError }}</p>
      </div>

      <div class="section list-section">
        <h3>Friend List</h3>
        <p v-if="friends.length === 0" class="empty-placeholder">No friends yet.</p>
        <div
          v-for="friend in friends"
          :key="friend"
          class="list-item"
          :class="{ selected: userStore.selectedFriend === friend }"
          @click="selectFriend(friend)"
        >
          <span class="item-name">{{ friend }}</span>
          <button @click.stop="removeFriend(friend)" class="btn-remove" title="Remove Friend">✕</button>
        </div>
      </div>
      
      <div class="section requests-section">
        <h3>Friend Requests</h3>
        <p v-if="incomingRequests.length === 0" class="empty-placeholder">No pending requests.</p>
        <div v-for="req in incomingRequests" :key="req" class="request-item">
          <span>{{ req }}</span>
          <div class="req-actions">
            <button @click="acceptRequest(req)" class="btn-accept">✔</button>
            <button @click="rejectRequest(req)" class="btn-reject">✖</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'groups'" class="tab-content">
      <div class="section add-section">
        <h3>Create Group</h3>
        <div class="form-row">
          <input
            v-model="newGroupName"
            type="text"
            placeholder="Group name..."
            @keyup.enter="handleCreateGroup"
            :disabled="isCreatingGroup"
          />
          <button @click="handleCreateGroup" class="btn-primary" :disabled="isCreatingGroup">Create</button>
        </div>
      </div>

      <div class="section list-section">
        <h3>My Groups</h3>
        <p v-if="chatStore.chats.length === 0" class="empty-placeholder">No groups yet.</p>
        <div
          v-for="chat in chatStore.chats"
          :key="chat._id"
          class="list-item"
          :class="{ selected: chatStore.activeChatId === chat._id }"
          @click="selectGroup(chat)"
        >
          <div class="group-icon">{{ chat.group_name.charAt(0).toUpperCase() }}</div>
          <span class="item-name">{{ chat.group_name }}</span>
        </div>
      </div>

      <div class="section requests-section">
        <h3>Group Invites</h3>
        <p v-if="chatStore.invitations.length === 0" class="empty-placeholder">No pending invites.</p>
        <div v-for="inv in chatStore.invitations" :key="inv._id" class="request-item group-invite">
          <div class="invite-info">
            <span class="invite-group">{{ inv.chat.name }}</span>
            <span class="invite-sender">from {{ inv.sender.username }}</span>
          </div>
          <div class="req-actions">
            <button @click="respondToChatInvite(inv._id, true)" class="btn-accept">✔</button>
            <button @click="respondToChatInvite(inv._id, false)" class="btn-reject">✖</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.display {
  width: 300px;
  height: 100%;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  border-radius: 12px 0 0 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.03);
}

.tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.tabs button {
  flex: 1;
  padding: 14px 0;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tabs button:hover {
  background: #f1f5f9;
  color: #334155;
}

.tabs button.active {
  color: #0ea5e9;
  background: white;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0ea5e9;
}

.tab-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.section {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.list-section {
  flex: 1;
  overflow-y: auto;
}

.requests-section {
  max-height: 50%;
  overflow-y: auto;
  background: #fafaf9;
}

.add-section {
  background: #f8fafc;
}

h3 {
  margin: 0 0 12px 0;
  font-size: 13px;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

.empty-placeholder {
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
  font-style: italic;
  margin: 10px 0;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin-bottom: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  color: #334155;
  font-weight: 500;
}

.list-item:hover {
  border-color: #bae6fd;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.1);
}

.list-item.selected {
  background: #e0f2fe;
  border-color: #0ea5e9;
  color: #0369a1;
}

.item-name {
  flex-grow: 1;
  font-size: 14px;
}

.group-icon {
  width: 28px;
  height: 28px;
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.btn-remove {
  background: none;
  border: none;
  color: #cbd5e1;
  font-weight: bold;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  font-size: 12px;
  transition: all 0.2s;
}

.list-item:hover .btn-remove {
  color: #ef4444;
}
.btn-remove:hover {
  background: #fee2e2;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.group-invite {
  align-items: flex-start;
}
.invite-info {
  display: flex;
  flex-direction: column;
}
.invite-group {
  font-weight: bold;
  color: #0f172a;
}
.invite-sender {
  font-size: 11px;
  color: #64748b;
}

.req-actions {
  display: flex;
  gap: 6px;
}

.btn-accept, .btn-reject {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-accept {
  background-color: #dcfce7;
  color: #166534;
}
.btn-accept:hover { background-color: #bbf7d0; }

.btn-reject {
  background-color: #fee2e2;
  color: #991b1b;
}
.btn-reject:hover { background-color: #fecaca; }

.form-row {
  display: flex;
  gap: 8px;
}

.form-row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.form-row input:focus {
  border-color: #0ea5e9;
}

.btn-primary {
  padding: 0 16px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0284c7;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  margin: 6px 0 0 0;
}
</style>
