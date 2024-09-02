import React, { useEffect } from "react"
import { useParams } from "react-router"
import { observer } from "mobx-react"
import { Flex, Stack, Avatar, Text } from "@chakra-ui/react"

import store from "../store"

const MessageList = () => {
  const { chatWithId } = useParams()

  const [chat] = store.chats.filter((chat) => chat.withUser._id === chatWithId)
  const messages = chat?.messages || []

  console.log("[MessageList] chat")
  return (
    <Stack>
      {messages.map((message) => {
        const isMyself = store.auth?.user._id == message.createdBy._id
        return (
          <Flex
            key={message._id}
            p="0.5rem 1rem"
            gap={4}
            flexDirection={isMyself ? "row-reverse" : "row"}
          >
            <Avatar
              size="md"
              src={`/api/users/${message.createdBy._id}/avatar`}
            />
            <Stack>
              <Text fontWeight="bolder" textAlign={isMyself ? "right" : "left"}>
                {message.createdBy.name}
              </Text>
              <Text
                p="0.5rem"
                fontSize={"lg"}
                borderRadius="0.5rem"
                textAlign={isMyself ? "right" : "left"}
                bg={isMyself ? "blue.100" : "gray.100"}
              >
                {message.text}
              </Text>
              <Text fontSize={"sm"}>{message.createdAt}</Text>
              {/* <Text>{isMyself ? "myself" : "not me"}</Text> */}
            </Stack>
          </Flex>
        )
      })}
    </Stack>
  )
}

export default observer(MessageList)
