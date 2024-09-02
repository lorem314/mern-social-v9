import { makeAutoObservable } from "mobx"

class Chat {
  _id = null
  withUser = null
  messages = []
  isOnline = null
  countNewMessage = 0

  constructor({ _id, withUser, messages, isOnline, countNewMessage }) {
    this._id = _id
    this.withUser = withUser
    this.messages = messages
    this.isOnline = isOnline
    this.countNewMessage = countNewMessage
    makeAutoObservable(this)
  }

  addMessage(message) {
    this.messages.push(message)
  }
  setIsOnline(isOnline) {
    this.isOnline = isOnline
  }
  clearCountNewMessage() {
    this.countNewMessage = 0
  }
  plusOneCountNewMessage() {
    this.countNewMessage = this.countNewMessage + 1
  }

  get getCountNewMessage() {
    return this.countNewMessage
  }

  get lastMessage() {
    return this.messages
      ? this.messages.length === 0
        ? ""
        : this.messages[this.messages.length - 1]
      : ""
  }
}

class Store {
  // test
  test = "helo"

  // auth = { user: { _id, name, email}, token: "access-token" }
  auth = null

  // has tried autoLogin
  hasTriedAutoLogin = false

  currentChatWithId = null

  /* 
    chats = [ chat, chat, ... ]
    chat = {
      _id        chatId
      with       userInfo {_id, name}
      messages:  [ message, message, ... ]
    }
  */
  chats = null

  refMessagesScroll = null

  constructor() {
    makeAutoObservable(this)
  }

  finishedAutoLogin() {
    this.hasTriedAutoLogin = true
  }
  updateUserInfo(newUserInfo) {
    const user = { ...this.auth.user, ...newUserInfo }
    const token = this.auth.token
    this.auth = { user, token }
  }
  authenticate(auth, cb = () => {}) {
    this.auth = auth
    cb()
  }
  clear(cb = () => {}) {
    this.auth = null
    cb()
  }

  setChats(chats = []) {
    this.chats = chats.map((chat) => new Chat(chat))
  }
  updateChatIsOnlineByUserId(userId, isOnline) {
    const chat = this.chats.find((chat) => chat.withUser._id === userId)
    // console.log("chat", chat)
    if (!chat) {
      console.error("[store] updateChatIsOnlineByUserId: chat not find")
    } else {
      chat.setIsOnline(isOnline)
    }
  }
  addMessageByChatId(message, chatId) {
    const [chat] = this.chats.filter((chat) => chat._id == chatId)
    if (!chat) {
      console.log(`[store] addMessageWithUser 没找到 ${userId} 对应的 chat`)
    } else {
      chat.addMessage(message)
    }
  }
  setMessagesScrollRef(ref) {
    this.refMessagesScroll = ref
  }
  scrollMessagesToBottom() {
    const node = this.refMessagesScroll.current
    setTimeout(() => {
      node.scrollTop = node.scrollHeight
    }, 0)
  }

  setCurrentChatWithId(chatWithId) {
    this.currentChatWithId = chatWithId
  }
  plueOneCountNewMessageByChatId(chatId) {
    const [chat] = this.chats.filter((chat) => chat._id == chatId)
    if (!chat) {
      console.log("[store] plueOneCountMessageByChatId no such chat")
    } else {
      chat.plusOneCountNewMessage()
    }
  }

  get getTotalNewMessage() {
    return this.chats.reduce((result, chat) => {
      return result + chat.getCountNewMessage || 0
    }, 0)
  }
}

const store = new Store()

export default store
