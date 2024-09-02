import { defineStyleConfig } from "@chakra-ui/react"

const Link = defineStyleConfig({
  baseStyle: {
    textUnderlineOffset: "0.25rem",
  },
  variants: {
    primary: {
      color: "blue.500",
    },
    inherit: {
      color: "inherit",
    },
  },
  defaultProps: {
    variant: "primary",
  },
})

export default Link
