import React, { useEffect, useState } from "react"
import { Link as RouterLink, useParams } from "react-router-dom"
import {
  Heading,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Link,
  useDisclosure,
  Modal,
  Button,
} from "@chakra-ui/react"

import UserInfo from "./UserInfo"
import FollowButton from "./FollowButton"
import Edit from "./Edit"
import store from "../store"
import { read } from "./api-user"

const User = () => {
  const { userId } = useParams()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState] = useState({
    isLoading: true,
    error: null,
    user: null,
    followersCount: null,
    followingCount: null,
    isFollowing: null,
  })

  useEffect(() => {
    read({ userId, requesterId: store.auth?.user._id }).then((res) => {
      if (res.error) {
        console.error("[User] read", res.error)
      } else {
        console.log("[User] read", res)
        setState((prevState) => ({ ...prevState, ...res, isLoading: false }))
      }
    })
  }, [userId])

  const updateUserInfo = (newUserInfo) => {
    setState((prevState) => {
      const prevUser = prevState.user || {}
      return {
        ...prevState,
        user: {
          ...prevUser,
          ...newUserInfo,
        },
      }
    })
    onClose()
  }

  const handleClickFollowButton = (api) => {
    api(
      { userId: store.auth?.user._id },
      { t: store.auth?.token },
      userId
    ).then((res) => {
      if (res.error) {
        console.error("[User] handleClickFollowButton", res.error)
      } else {
        const { followersCount, isFollowing } = res
        console.log("res", res)
        setState((prevState) => ({
          ...prevState,
          followersCount,
          isFollowing,
        }))
      }
    })
  }

  const isMyself = store.auth?.user._id == userId
  const {
    isLoading,
    user,
    error,
    followersCount,
    followingCount,
    isFollowing,
  } = state

  return isLoading && !error ? null : (
    <Stack m="2rem auto" p="8" maxW="32rem" bg="white" rounded="md" gap="1rem">
      <Heading as="h2" fontSize="xl">
        {isMyself ? "我的个人信息" : `用户 ${user.name} 的个人信息`}
      </Heading>

      <UserInfo user={state.user}>
        {isMyself ? (
          <Button variant="primary" onClick={onOpen}>
            修改
          </Button>
        ) : (
          <FollowButton
            isFollowing={isFollowing}
            onClick={handleClickFollowButton}
          />
        )}
      </UserInfo>

      <Modal isOpen={isOpen} onClose={onClose}>
        <Edit user={user} updateUserInfo={updateUserInfo} />
      </Modal>

      <StatGroup>
        <Stat textAlign="center">
          <StatLabel fontSize="large">
            <Link as={RouterLink} to={`/users/${userId}/followers`}>
              粉丝
            </Link>
          </StatLabel>
          <StatNumber color="gray.600">{followersCount}</StatNumber>
        </Stat>
        <Stat textAlign="center">
          <StatLabel fontSize="large">
            <Link as={RouterLink} to={`/users/${userId}/followings`}>
              关注
            </Link>
          </StatLabel>
          <StatNumber color="gray.600">{followingCount}</StatNumber>
        </Stat>
        <Stat textAlign="center">
          <StatLabel fontSize="large">
            <Link as={RouterLink} to={`/posts/by/${userId}`}>
              动态
            </Link>
          </StatLabel>
          <StatNumber color="gray.600">999</StatNumber>
        </Stat>
        <Stat textAlign="center">
          <StatLabel fontSize="large">
            <Link as={RouterLink} to={`/videos/by/${userId}`}>
              视频
            </Link>
          </StatLabel>
          <StatNumber color="gray.600">999</StatNumber>
        </Stat>
      </StatGroup>
    </Stack>
  )
}

export default User
