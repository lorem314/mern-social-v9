import React from "react"
import { Box, Card, Flex, Heading, Stack, Text } from "@chakra-ui/react"

const Home = () => {
  return (
    <Card maxWidth="32rem" m="2rem auto" p="2rem">
      <Box
        bg="lightcoral"
        whiteSpace={"nowrap"}
        textOverflow="ellipsis"
        overflow={"hidden"}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, saepe.
      </Box>

      <br />

      <Flex bg="lightpink" p="1rem" gap="10px">
        <Box>lorem</Box>
        <Box
          bg="lightskyblue"
          minWidth={0}
          whiteSpace={"nowrap"}
          overflow="hidden"
          textOverflow={"ellipsis"}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
          ducimus.
        </Box>
      </Flex>

      <br />

      <Flex gap={"10px"} bg="lightblue" p="10px">
        <Box flex="0 0 auto">ava</Box>
        <Stack flex="1 1 auto" bg="lightcoral" minWidth={0}>
          <Text>lorem</Text>
          <Text
            whiteSpace={"nowrap"}
            overflow="hidden"
            textOverflow={"ellipsis"}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat,
            quasi!
          </Text>
        </Stack>
      </Flex>
    </Card>
  )
}

export default Home
