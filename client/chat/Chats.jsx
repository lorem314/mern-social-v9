import React from "react"
import { observer } from "mobx-react"
import { Outlet } from "react-router"
import { Flex, Box, Text } from "@chakra-ui/react"

import ChatList from "./ChatList"
import store from "../store"

const Chats = () => {
  return (
    <Flex
      m="2rem auto"
      maxW="90%"
      h="calc(100vh - 50px - 4rem)"
      bg="white"
      border="1px solid"
      borderColor="gray.300"
    >
      <Box
        flex="1 0 auto"
        maxW="18rem"
        overflow="hidden"
        textOverflow="ellipsis"
        bg="gray.50"
        borderRight="1px solid"
        borderColor="gray.300"
      >
        <ChatList chats={store.chats} />
      </Box>

      <Box flex="1 0 auto" position="relative">
        <Flex
          position="absolute"
          inset="0 0 0 0"
          justifyContent="center"
          alignItems="center"
        >
          <Text>点击左侧用户开始聊天</Text>
        </Flex>

        <Box position="absolute" inset="0 0 0 0" bg="white">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

export default observer(Chats)
