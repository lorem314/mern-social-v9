import React from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import {
  Button,
  Avatar,
  Image,
  FormControl,
  Stack,
  FormLabel,
  Input,
  Textarea,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
} from "@chakra-ui/react"

import { update } from "./api-user"
import store from "../store"

const Edit = ({ user, updateUserInfo }) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: null,
      name: user?.name,
      about: user?.about,
    },
  })
  const watchAvatar = watch("avatar")
  const hasNewAvatar = watchAvatar?.length === 1

  const resetNewAvatar = () =>
    reset(
      { ...getValues(), avatar: null },
      {
        keepDefaultValues: true,
      }
    )
  const handleClickUpdate = (data) => {
    console.log("dirtyFields", dirtyFields)
    // console.log("getValues", getValues())
    const formData = new FormData()
    Object.entries(dirtyFields).forEach(([key, isDirty]) => {
      if (isDirty) {
        if (key == "avatar") {
          formData.append(key, data[key][0])
        } else {
          formData.append(key, data[key])
        }
      }
    })
    update({ userId: user._id }, { t: store.auth?.token }, formData).then(
      (res) => {
        if (res.error) {
          console.error("[Edit] update", res.erro)
        } else {
          const { user } = res
          const { about, ...rest } = user
          // console.log("[Edit] update, rest", rest)
          store.updateUserInfo(rest)
          updateUserInfo(rest)
        }
      }
    )
  }

  const newAvatar = getValues("avatar")

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>修改个人资料</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(handleClickUpdate)}>
          <ModalBody p="0 3rem">
            <Stack>
              <FormControl>
                <FormLabel>用户头像</FormLabel>
                <Flex alignItems="center" gap="1rem">
                  {hasNewAvatar && newAvatar ? (
                    <Image
                      src={URL.createObjectURL(newAvatar[0])}
                      boxSize="4rem"
                    />
                  ) : (
                    <Avatar size="lg" src={`/api/users/${user._id}/avatar`} />
                  )}
                  {hasNewAvatar ? (
                    <Button onClick={resetNewAvatar}>取消更换</Button>
                  ) : (
                    <FormLabel
                      htmlFor="change-avatar"
                      m="0"
                      p="0.5rem 1rem"
                      borderRadius="0.5rem"
                      cursor="pointer"
                      bg="gray.100"
                      fontWeight={"bolder"}
                      _hover={{ bg: "gray.200" }}
                      _active={{ bg: "gray.300" }}
                    >
                      更换头像
                      <Input
                        id="change-avatar"
                        type="file"
                        accept="image/*"
                        display="none"
                        {...register("avatar")}
                      />
                    </FormLabel>
                  )}
                </Flex>
              </FormControl>
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
                <FormLabel>简介</FormLabel>
                <Textarea {...register("about")} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" type="submit">
              更新
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  )
}

export default Edit
