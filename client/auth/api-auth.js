import store from "../store"

export const login = async (data) => {
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] login", error)
    return { error: error.toString() }
  }
}

export const autoLogin = async () => {
  try {
    const res = await fetch("/auth/auto-login", {
      method: "POST",
      headers: { Accept: "application/json" },
    })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] login", error)
    return { error: error.toString() }
  }
}

export const logout = async () => {
  try {
    const res = await fetch("/auth/logout", { method: "POST" })
    return await res.json()
  } catch (error) {
    console.error("[api-auth] logout", error)
  }
}

export const withRefresh = (api) => {
  return async (params, credentials, body) => {
    const res = await api(params, credentials, body)
    if (res.status == "401") {
      // accessToken expired, generate a new one and retry
      console.log("[api-auth] withRefresh: 401")
      try {
        const resRefresh = await fetch("/auth/refresh", { method: "POST" })
        const resRefreshJson = await resRefresh.json()
        if (resRefreshJson.error) {
          return { error: "生成 refreshToken 时出错" }
        } else {
          console.log("[api-auth] withRefresh: refreshed", resRefreshJson)
          const { auth } = resRefreshJson
          store.authenticate(auth)
          const retryApiRes = await api(params, { t: auth.token }, body)
          if (retryApiRes.error) {
            console.error("[api-auth] withRefresh: retried, still failed")
          } else {
            console.log("[api-auth] withRefresh: retried successfully")
          }
          return retryApiRes
        }
      } catch (error) {
        return { error: error.toString() }
      }
    } else {
      // regular response, return it
      return res
    }
  }
}
