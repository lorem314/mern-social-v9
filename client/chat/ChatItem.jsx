import React from "react"
import { Flex, Avatar, Text, Stack, Tag, AvatarBadge } from "@chakra-ui/react"
import { observer } from "mobx-react"

const ChatItem = ({ user, isSelected, chat }) => {
  const countNewMessage = chat.getCountNewMessage
  return (
    <Flex
      p="0.5rem 1rem"
      alignItems="flex-start"
      gap="10px"
      cursor="pointer"
      bg={isSelected ? "blue.100" : "transparent"}
      _hover={{ bg: isSelected ? "blue.100" : "gray.200" }}
    >
      <Avatar flex="0 0 auto" size="md" src={`/api/users/${user._id}/avatar`}>
        {countNewMessage === 0 ? null : (
          <AvatarBadge boxSize={"1.5em"} bg="red.500">
            <small>{countNewMessage}</small>
          </AvatarBadge>
        )}
      </Avatar>

      <Stack flex="1 1 auto" justifyContent="center" gap="0" minWidth={0}>
        <Flex justifyContent={"space-between"}>
          <Text fontSize="larger" fontWeight="bolder" color="gray.700">
            {user.name}
          </Text>
          <Tag
            colorScheme={
              chat.isOnline === null ? "gray" : chat.isOnline ? "green" : "red"
            }
          >
            {chat.isOnline === null
              ? "未关注"
              : chat.isOnline
              ? "在线"
              : "离线"}
          </Tag>
        </Flex>

        <Text
          color="gray.600"
          whiteSpace={"nowrap"}
          overflow="hidden"
          textOverflow={"ellipsis"}
        >
          {chat.lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  )
}

export default observer(ChatItem)
