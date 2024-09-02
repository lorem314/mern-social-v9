import { withRefresh } from "../auth/api-auth"

export const create = withRefresh(async (params, credentials, body) => {
  const { toUserId } = params
  const { fromUserId, text, chatId } = body
  try {
    const res = await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ text, fromUserId, toUserId, chatId }),
    })
    const resJson = await res.json()
    return { ...resJson, status: res.status }
  } catch (error) {
    console.error("[api-message] create", error)
    return { error: error.toString() }
  }
})
