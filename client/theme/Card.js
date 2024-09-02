import { defineStyleConfig } from "@chakra-ui/react"

const Card = defineStyleConfig({
  variants: {
    page: {
      container: {
        padding: "2rem",
        margin: "2rem auto",
      },
      header: {
        padding: "1rem",
      },
      body: {},
      footer: {},
    },
  },
})

export default Card
