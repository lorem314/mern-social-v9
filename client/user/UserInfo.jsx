import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { Link } from "@chakra-ui/react"
import { Flex, Stack, Avatar, Text, Heading } from "@chakra-ui/react"

const UserInfo = ({ user, children = null }) => {
  return (
    <Flex alignItems="center" gap="10px">
      <RouterLink to={`/users/${user._id}`}>
        <Avatar
          size="lg"
          src={`/api/users/${user._id}/avatar?t=${new Date().getTime()}`}
        />
      </RouterLink>
      <Stack flex="1 0 auto">
        <Text fontWeight="bolder" fontSize="lg">
          <Link as={RouterLink} to={`/users/${user._id}`}>
            {user.name}
          </Link>
        </Text>
        <Text color="gray.600">{user.email}</Text>
      </Stack>
      {children}
    </Flex>
  )
}

export default UserInfo
