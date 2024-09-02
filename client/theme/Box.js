import { defineStyleConfig } from "@chakra-ui/react"

const Box = defineStyleConfig({
  baseStyle: {},
  variants: {
    page: {
      margin: "2rem auto",
      shadow: "md",
    },
  },
})

export default Box
