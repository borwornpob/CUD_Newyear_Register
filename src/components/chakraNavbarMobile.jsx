import {
  useDisclosure,
  Flex,
  Box,
  Button,
  VStack,
  Icon,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import CustomDrawer from "./customDrawer.jsx";
import { IoMdMenu } from "react-icons/io";
import { Link } from "react-scroll";
import React from "react";
export default function MobileDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const data = [
    {
      label: "ลงทะเบียน",
      href: "/",
    },
    {
      label: "ค้นหาบัตรเข้างาน",
      href: "/tickets",
    },
  ];

  return (
    <Flex display={{ base: "flex", md: "none" }}>
      <Button ref={btnRef} onClick={onOpen}>
        <IoMdMenu size="26px" />
      </Button>

      <CustomDrawer isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
        <VStack alignItems="left">
          {data.map((item, i) => (
            <ChakraLink key={i} href={item.href}>
              <Button variant="text"> {item.label} </Button>
            </ChakraLink>
          ))}
        </VStack>
      </CustomDrawer>
    </Flex>
  );
}
