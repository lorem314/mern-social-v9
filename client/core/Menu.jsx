import React from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { Button, Divider, Link, Flex, Spacer } from "@chakra-ui/react"
import { observer } from "mobx-react"

import store from "../store"
import { logout } from "../auth/api-auth"
import { socket } from "../socket"

const Menu = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    logout().then((res) => {
      if (res.error) {
        console.error("[Menu] logout", res.error)
      } else {
        console.log("[Menu] logout", res)
        socket.disconnect()
        store.clear(() => navigate("/"))
      }
    })
  }

  return store.hasTriedAutoLogin ? (
    <Flex
      as="header"
      alignItems="center"
      gap="10px"
      h="50px"
      p="10px 10px"
      color="white"
      bg="rebeccapurple"
    >
      <h1>
        <Link variant="inherit" as={RouterLink} to="/">
          MERN-Project-V9
        </Link>
      </h1>

      <Spacer />

      <Link variant="inherit" as={RouterLink} to="/users">
        所有用户
      </Link>

      <Divider orientation="vertical" />

      {store.auth ? (
        <>
          <Link
            variant="inherit"
            as={RouterLink}
            to={`/users/${store.auth.user._id}`}
          >
            {store.auth.user.name}
          </Link>
          <Link variant="inherit" as={RouterLink} to="/chats">
            消息({store.getTotalNewMessage})
          </Link>
          <Button size="sm" onClick={handleLogout}>
            登出
          </Button>
        </>
      ) : (
        <>
          <Link variant="inherit" as={RouterLink} to="/signup">
            注册
          </Link>
          <Link variant="inherit" as={RouterLink} to="/login">
            登录
          </Link>
        </>
      )}
    </Flex>
  ) : null
}

export default observer(Menu)
