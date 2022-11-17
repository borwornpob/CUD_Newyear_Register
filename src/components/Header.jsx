import { Image, Flex, Button, HStack, chakra, Link } from "@chakra-ui/react";
import Logo from "../assets/logo.png";
import { Link as routerLink } from "react-router-dom";
import React from "react";
import MobileDrawer from "./chakraNavbarMobile";
export default function Header() {
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
    <chakra.header id="header">
      <Flex
        w="100%"
        px="6"
        py="5"
        align="center"
        justify="space-between"
        //display={{ base: "flex", md: "none" }}
      >
        <Image src={Logo} h="50px" />

        <HStack as="nav" spacing="5" display={{ base: "none", md: "flex" }}>
          {data.map((item, i) => (
            <Link as={routerLink} to={item.href} key={i}>
              {item.label}
            </Link>
          ))}
        </HStack>
        <MobileDrawer />
      </Flex>
    </chakra.header>
  );
}
