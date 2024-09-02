import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button, Link } from "@chakra-ui/react"

import store from "../store"
import { follow, unfollow } from "./api-user"

const FollowButton = ({ isFollowing = false, onClick = () => {} }) => {
  const handleClickFollow = () => onClick(follow)
  const handleClickUnfollow = () => onClick(unfollow)

  return store.auth ? (
    isFollowing ? (
      <Button onClick={handleClickUnfollow}>取消关注</Button>
    ) : (
      <Button variant="primary" onClick={handleClickFollow}>
        关注
      </Button>
    )
  ) : (
    <Link variant="primary" as={RouterLink} to="/login">
      登录后可关注
    </Link>
  )
}

export default FollowButton
