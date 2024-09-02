import { withRefresh } from "../auth/api-auth"

export const create = async (user) => {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-user] create", error)
    return { error: error.toString() }
  }
}

export const read = async (params, signal) => {
  const { userId, requesterId } = params
  try {
    const res = await fetch(
      `/api/users/${userId}?${requesterId ? `requesterId=${requesterId}` : ""}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      }
    )
    return await res.json()
  } catch (error) {
    console.error("[api-user] read", error)
  }
}

export const list = async (signal) => {
  try {
    const res = await fetch("/api/users", { method: "GET", signal: signal })
    return await res.json()
  } catch (error) {
    console.error("[api-user] list", error)
    return { error: error.toString() }
  }
}

export const follow = withRefresh(async (params, credentials, followId) => {
  const { userId } = params
  try {
    const res = await fetch(`/api/users/${userId}/follow`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ followId }),
    })
    const resJson = await res.json()
    return { ...resJson, status: res.status }
  } catch (error) {
    console.error("[api-user] follow", error)
    return { error }
  }
})

export const unfollow = withRefresh(async (params, credentials, unfollowId) => {
  const { userId } = params
  try {
    const res = await fetch(`/api/users/${userId}/unfollow`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ unfollowId }),
    })
    const resJson = await res.json()
    return { ...resJson, status: res.status }
  } catch (error) {
    console.error("[api-user] unfollow", error)
    return { error }
  }
})

export const update = async (params, credentials, user) => {
  const { userId } = params
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${credentials.t}`,
      },
      body: user,
    })
    const resJson = await res.json()
    return { ...resJson, status: res.status }
  } catch (error) {
    console.error("[api-user] update", error)
    return { error }
  }
}
