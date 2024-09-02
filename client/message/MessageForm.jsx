import React, { useEffect } from "react"
import { useParams } from "react-router"
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { observer } from "mobx-react"

import { create } from "./api-message"
import store from "../store"
import { socket } from "../socket"

const MessageForm = () => {
  const { chatId, chatWithId } = useParams()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { text: "" },
  })

  const submit = (data) => {
    const { text } = data
    create(
      { toUserId: chatWithId },
      { t: store.auth?.token },
      { fromUserId: store.auth?.user._id, chatId, text }
    ).then((res) => {
      if (res.error) {
        console.error("[MessageForm] create", res.error)
      } else {
        console.log("[MessageForm] create", res)
        const { message } = res
        reset()
        // const node = refScroll.current
        // store.scrollMessagesToBottom()
        socket.emit("update-user-view-chat", { userId: chatWithId, chatId })
        store.addMessageByChatId(message, chatId)
        socket.emit("send-message", { message, toUserId: chatWithId, chatId })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <InputGroup>
        <Input
          autoComplete={"off"}
          pr="4.5rem"
          bg="white"
          placeholder="输入文字..."
          {...register("text")}
        />
        <InputRightElement w="4rem">
          <Button type="submit" variant={"primary"}>
            发送
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default observer(MessageForm)
