import React, { useEffect, useRef, useLayoutEffect } from "react"
import { useParams } from "react-router"
import { Stack, Box } from "@chakra-ui/react"
import { observer } from "mobx-react"

import MessageList from "../message/MessageList"
import MessageForm from "../message/MessageForm"
import store from "../store"
import { socket } from "../socket"

const Chat = () => {
  const { chatWithId, chatId } = useParams()
  const refScroll = useRef(null)

  const [chat] = store.chats.filter((chat) => chat._id == chatId)

  useLayoutEffect(() => {
    store.setMessagesScrollRef(refScroll)
    // store.scrollMessagesToBottom()

    const node = refScroll.current
    node.scrollTop = node.scrollHeight
  }, [chatWithId])

  useEffect(() => {
    // console.log("[Chat] chatId", chatId)
    // console.log("[Chat] chatWithId", chatWithId)
    socket.emit("update-user-view-chat", { userId: chatWithId, chatId })

    console.log("[Chat] setCurrentChatWithId", chatWithId)
    store.setCurrentChatWithId(chatWithId)

    if (chat) {
      chat.clearCountNewMessage()
    }

    return () => {
      console.log("[Chat] clear currentChatWithId")
      store.setCurrentChatWithId(null)
    }
  }, [chatWithId])

  return (
    <Stack id="chat" h="100%" gap="0">
      {/* this is the one should scroll after send message */}
      <Box id="scroll" flex="1 1 auto" overflowY={"auto"} ref={refScroll}>
        <MessageList />
      </Box>
      <Box p="1rem" borderTop={"1px solid"} borderColor="gray.300">
        <MessageForm />
      </Box>
    </Stack>
  )
}

export default observer(Chat)

/**
        
 * 
 */
