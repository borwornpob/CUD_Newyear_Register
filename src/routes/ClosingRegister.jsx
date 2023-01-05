//create page for closing register with only text in the middle using chakra ui

import React from "react";
import { Text, VStack, Heading, Button, Container } from "@chakra-ui/react";
import { Link as routerLink } from "react-router-dom";

import useWindowDimensions from "../hooks/dimensions";

export default function ClosingRegister() {
  const { width } = useWindowDimensions();
  return (
    <VStack>
      <Heading>หมดเขตการลงทะเบียน</Heading>
      <Container>
        <Text>
          หากมีข้อสงสัย รบกวนติดต่อที่ไลน์ CUD SAPA Official
          หรือคลิกปุ่มด้านล่างเพื่อเพิ่มเพื่อน
        </Text>
      </Container>

      <Container>
        <Button
          colorScheme="teal"
          width="100%"
          onClick={
            //href to another site
            () => window.open("https://lin.ee/Is71r3U")
          }
        >
          Add Friend
        </Button>
      </Container>

      <Heading>สามารถค้นหาบัตรเข้างานได้ที่นี่</Heading>

      <Container>
        <Button
          colorScheme="teal"
          width="100%"
          variant="solid"
          as={routerLink}
          to="/tickets"
        >
          ค้นหาบัตรเข้างานได้ที่นี่
        </Button>
      </Container>
    </VStack>
  );
}
