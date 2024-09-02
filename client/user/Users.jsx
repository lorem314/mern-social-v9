import React, { useEffect, useState } from "react"
import { Heading, Stack } from "@chakra-ui/react"

import { list } from "./api-user"
import UserInfo from "./UserInfo"

const Users = () => {
  const [state, setState] = useState({
    isLoading: true,
    error: null,
    users: [],
  })

  useEffect(() => {
    list().then((res) => {
      if (res.error) {
        console.error("[Users] list", res.error)
        setState({ isLoading: false, error: res.error, users: null })
      } else {
        console.log("res", res)
        const { users } = res
        setState({ isLoading: false, error: null, users })
      }
    })
  }, [])

  const { isLoading, error, users } = state

  return isLoading && error ? null : (
    <Stack m="2rem auto" p="8" maxW="24rem" bg="white" rounded="md" gap="1rem">
      <Heading as="h2" fontSize={"xl"}>
        所有用户({users.length})
      </Heading>
      {users.map((user) => {
        return <UserInfo key={user._id} user={user} />
      })}
    </Stack>
  )
}

export default Users
