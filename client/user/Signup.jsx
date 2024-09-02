import React, { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

import { create } from "./api-user"

const Signup = () => {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  })
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (data) => {
    console.log("[Signup] onSubmit", data)
    create(data).then((res) => {
      if (res.error) {
        console.error("[Signup] create", res.error)
      } else {
        console.log("[Signup] create", res.message)
      }
    })
  }

  return (
    <Stack m="2rem auto" p="8" maxW="24rem" bg="white" rounded="md">
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={8}>
          <Stack align="center">
            <Heading as="h2" fontSize={"xl"}>
              注册
            </Heading>
          </Stack>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>用户名</FormLabel>
              <Input
                {...register("name", {
                  minLength: 5,
                  maxLength: 20,
                  required: "用户名不能为空",
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>邮箱</FormLabel>
              <Input
                {...register("email", {
                  pattern: { value: /.+\@.+\..+/, message: "邮箱格式不正确" },
                  required: "邮箱不能为空",
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>密码</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "密码不能为空",
                    minLength: 5,
                  })}
                />
                <InputRightElement h="full">
                  <Button
                    onClick={() => {
                      setShowPassword((prevShowPassword) => !prevShowPassword)
                    }}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {/* pin input */}
          </Stack>
          <Button type="submit" variant="primary">
            注册
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

export default Signup

/**
          <FormControl>
            <FormLabel>验证码</FormLabel>
            <Flex gap={"10px"}>
              <Stack direction={"row"}>
                <PinInput>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </Stack>
              <Button>发送验证码(60)</Button>
            </Flex>
          </FormControl> 
 */
