import React from "react"
import { observer } from "mobx-react"
import { Link as RouterLink, useParams } from "react-router-dom"
import { Stack, Link, Text, Flex } from "@chakra-ui/react"

import ChatItem from "./ChatItem"

const ChatList = ({ chats }) => {
  const { chatId } = useParams()

  return chats && chats.length !== 0 ? (
    <Stack p="10px">
      {chats.map((chat) => {
        const isSelected = chatId === chat._id
        return (
          <Link
            as={RouterLink}
            key={chat._id}
            to={`/chats/${chat._id}/with/${chat.withUser._id}`}
            _hover={{ textDecoration: "none" }}
          >
            <ChatItem
              chat={chat}
              user={chat.withUser}
              isSelected={isSelected}
            />
          </Link>
        )
      })}
    </Stack>
  ) : (
    <Stack h="100%" justifyContent={"center"} alignItems="center">
      <Text color="gray.600">你还没有关注任何人</Text>
      <Text color="gray.600">
        前往
        <Link as={RouterLink} to="/users">
          所有用户
        </Link>
        页面
      </Text>
    </Stack>
  )
}

export default observer(ChatList)
