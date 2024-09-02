import { defineStyleConfig } from "@chakra-ui/react"

const Button = defineStyleConfig({
  baseStyle: {
    // display: "inline-flex",
    // width: "100%",
  },
  variants: {
    primary: {
      color: "white",
      bg: "blue.500",
      _hover: { bg: "blue.600" },
      _active: { bg: "blue.700" },
    },
  },
})

export default Button
