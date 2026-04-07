<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { users } from '@/data/data.js';

const userStore = useUserStore()

const friends = computed(() => {
  // New users start with no friends
  if (!['emmanuel', 'john123'].includes(userStore.user.username)) {
    return []
  }

  // Original hardcoded users only see each other
  return users
    .filter(user =>
      user.username !== userStore.user.username &&
      ['emmanuel', 'john123'].includes(user.username)
    )
    .map(user => user.username)
})

function selectFriend(friend) {
  userStore.selectedFriend = friend
}

const incomingRequests = ref(
  ['emmanuel', 'john123'].includes(userStore.user.username) ? ['alice', 'bob'] : []
)
const outgoingFriendRequests = ref([])

function acceptRequest(user) {
  incomingRequests.value = incomingRequests.value.filter(u => u !== user)
  outgoingFriendRequests.value.push({ user, status: 'accepted' })
}

function rejectRequest(user) {
  incomingRequests.value = incomingRequests.value.filter(u => u !== user)
  outgoingFriendRequests.value.push({ user, status: 'rejected' })
}

const searchQuery = ref('')
const sentRequests = ref([])
const searchError = ref('')

function sendFriendRequest() {
  const target = searchQuery.value.trim()
  if (!target) return

  if (target === userStore.user.username) {
    searchError.value = "You cannot add yourself"
    return
  }

  const foundUser = users.find(u => u.username === target)
  if (foundUser) {
    if (!sentRequests.value.includes(target) && !friends.value.includes(target)) {
      sentRequests.value.push(target)
      searchError.value = ''
      searchQuery.value = ''
      alert(`Friend request sent to ${target}!`)
    } else {
      searchError.value = "User is already a friend or request already sent"
    }
  } else {
    searchError.value = "User not found in system"
  }
}
</script>

<template>
  <div class="display">
    <div class="friend">
      <h3>Friend List</h3>
       <div
      v-for="friend in friends"
      :key="friend"
      class="friend-user"
      @click="selectFriend(friend)"
    >
      {{ friend }}</div>
    </div>
    <div class="friend-request">
      <h3>Friend Requests</h3>
      <div v-for="req in incomingRequests" :key="req" class="request-item">
        <span>{{ req }}</span>
        <div class="req-actions">
          <button @click="acceptRequest(req)" class="btn-accept">Accept</button>
          <button @click="rejectRequest(req)" class="btn-reject">Reject</button>
        </div>
      </div>
    </div>
    <div class="add-friend">
      <h3>Add a Friend</h3>
      <div class="add-friend-form">
        <label for="friendSearch">Search User:</label>
        <input
          id="friendSearch"
          v-model="searchQuery"
          type="text"
          placeholder="Enter username"
          @keyup.enter="sendFriendRequest"
        />
        <button @click="sendFriendRequest" class="btn-send-req">Send Request</button>
      </div>
      <p v-if="searchError" class="error-msg">{{ searchError }}</p>
    </div>
  </div>
</template>

<style scoped>
body{
  margin: 0;
}

.display{
  width: 25%;
  height: 80%;
  border: 1px solid #cbd5e1;
  border-right: none;
  background-color: white;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  overflow: hidden;
}

.friend{
  width: 100%;
  height: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.friend-user{
 display: flex;
  align-items: center;
  gap: 14px;
  width: 70%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  text-align: left;
  color: #334155;
  font-weight: 500;
}

.friend-user:hover{
  border-color: #0ea5e9;
  background: #e0f2fe;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.friend-request{
  width: 100%;
  height: 33.33%;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  overflow-y: auto;
}

.add-friend {
  width: 100%;
  height: 33.33%;
  background-color: #f7fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e2e8f0;
}

.add-friend h3 {
  margin: 10px 0;
}

.add-friend-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 80%;
}

.add-friend-form label {
  font-size: 13px;
  font-weight: 600;
  align-self: flex-start;
  color: #2d3748;
}

.add-friend-form input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
}

.add-friend-form input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-send-req {
  width: 100%;
  padding: 8px 12px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  transition: opacity 0.2s;
}

.btn-send-req:hover {
  opacity: 0.9;
}

.error-msg {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
}

.friend-request h3 {
  margin: 10px 0;
  text-align: center;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 8px auto;
  padding: 8px 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-size: 14px;
}

.req-actions {
  display: flex;
  gap: 8px;
}

.btn-accept, .btn-reject {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-accept:hover, .btn-reject:hover {
  opacity: 0.8;
}

.btn-accept {
  background-color: #e2e8f0;
  color: #2d3748;
}

.btn-reject {
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}
</style>
