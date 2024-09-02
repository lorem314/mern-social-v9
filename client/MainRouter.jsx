import React, { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { observer } from "mobx-react"
//core
import Menu from "./core/Menu"
import Home from "./core/Home"
// auth
import Login from "./auth/Login"
// user
import Signup from "./user/Signup"
import User from "./user/User"
import Users from "./user/Users"
// chat and message
import Chats from "./chat/Chats"
import Chat from "./chat/Chat"

import useClient from "./hooks/useClient"
import theme from "./theme"
import { autoLogin } from "./auth/api-auth"
import store from "./store"
import { socket } from "./socket"

const MainRouter = () => {
  const isClient = useClient()
  // const match = useRouteMatch("/chats/:chatId/with/:chatWithId")
  // console.log("match", match)

  // auto login effect
  useEffect(() => {
    autoLogin()
      .then((res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          const { auth, chats } = res
          console.log("[MainRouter] autoLogin")
          if (auth) socket.connect()
          const newChats = chats.map((chat) => {
            const countNewMessage = chat.messages.length || 0
            return { ...chat, countNewMessage }
          })
          console.log("[MainRouter] newChats", newChats)
          store.setChats(newChats)
          store.authenticate(auth)
        }
      })
      .finally(() => {
        store.finishedAutoLogin()
      })
  }, [])

  useEffect(() => {
    socket.on("receive-message", ({ message, chatId }) => {
      console.log("[MainRouter] receive-message", message)
      store.addMessageByChatId(message, chatId)

      const chatWithId = store.currentChatWithId
      if (chatWithId == message.createdBy._id) {
        socket.emit("update-user-view-chat", { userId: chatWithId, chatId })
      } else {
        // plus 1 in chat by id
        store.plueOneCountNewMessageByChatId(chatId)
      }
    })
    socket.on("user-online", (user) => {
      // console.log("user-online event", user)
      console.log(`user ${user.name} is online !!!`)
      store.updateChatIsOnlineByUserId(user._id, true)
    })
    socket.on("user-offline", (user) => {
      // console.log("user-offline event", user)
      console.log(`user ${user.name} is offline ...`)
      store.updateChatIsOnlineByUserId(user._id, false)
    })
  }, [socket])

  return isClient && store.hasTriedAutoLogin ? (
    <ChakraProvider theme={theme}>
      <Menu />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/users">
          <Route index element={<Users />} />
          <Route path=":userId">
            <Route index element={<User />} />
          </Route>
        </Route>

        <Route path="/chats" element={<Chats />}>
          <Route path=":chatId/with/:chatWithId" element={<Chat />} />
        </Route>
      </Routes>
    </ChakraProvider>
  ) : null
}

export default observer(MainRouter)
