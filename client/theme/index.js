import { extendTheme } from "@chakra-ui/react"

import Button from "./Button"
import Card from "./Card"
import Link from "./Link"

const theme = extendTheme({
  colors: {},
  styles: {
    global: {
      body: {
        backgroundColor: "gray.200",
      },
      a: {
        color: "blue.500",
      },
    },
  },
  components: {
    Button,
    Card,
    Link,
  },
})

export default theme
