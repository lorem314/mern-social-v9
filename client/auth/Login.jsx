import React from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  Flex,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Spacer,
} from "@chakra-ui/react"

import { login } from "./api-auth"
import store from "../store"
import { socket } from "../socket"

const Login = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "user001@gmail.com",
      password: "user001",
      rememberMe: false,
    },
  })

  const submit = (data) => {
    console.log("[Login] onSubmit", data)

    login(data).then((res) => {
      if (res.error) {
        console.error("[Login]", res)
      } else {
        console.log("[login] res", res)
        const { auth, chats } = res
        if (auth) {
          socket.connect()
        }
        store.setChats(chats)
        store.authenticate(auth, () => navigate("/"))
      }
    })
  }

  return (
    <Stack m="2rem auto" p={8} maxW="24rem" bg="white" rounded="md">
      <form onSubmit={handleSubmit(submit)}>
        <Stack spacing={8}>
          <Stack align="center">
            <Heading as="h2" fontSize={"xl"}>
              登录
            </Heading>
          </Stack>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>邮箱</FormLabel>
              <Input type="email" {...register("email")} />
            </FormControl>
            <FormControl>
              <FormLabel>密码</FormLabel>
              <Input
                type="password"
                autoComplete="off"
                {...register("password")}
              />
            </FormControl>
            <Flex>
              <Checkbox {...register("rememberMe")}>记住我</Checkbox>
              <Spacer />
              {/* <RouterLink to="/forgot-password">忘记密码</RouterLink> */}
            </Flex>
          </Stack>
          <Button type="submit" variant="primary">
            登录
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

export default Login
