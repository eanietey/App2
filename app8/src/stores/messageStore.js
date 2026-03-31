import { ref } from 'vue'
import { defineStore } from 'pinia'
import Message from '../models/Message.js'
import simulationData from '../data/messages.js'

export const useMessageStore = defineStore('messageStore', () => {
  const messages = ref([...simulationData])

  function addMessage(username, firstName, lastName, text) {
    const msg = new Message(username, firstName, lastName, text)
    messages.value.push(msg)
  }

  function redactMessage(index) {
    if (index >= 0 && index < messages.value.length) {
      const msg = messages.value[index]
      msg.redacted = true
    }
  }

  function unredactMessage(index) {
    if (index >= 0 && index < messages.value.length) {
      const msg = messages.value[index]
      msg.redacted = false
    }
  }

  return { messages, addMessage, redactMessage, unredactMessage }
})

