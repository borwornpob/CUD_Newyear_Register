import React from "react";
import {
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";

export default function ConcertCard(id, name, email, status) {
  return (
    <Card maxW="md">
      <CardBody>
        <QRCode value={id} />
        <VStack>
          <Heading>{name}</Heading>
          <Text>{email}</Text>
          <Text>{status}</Text>
        </VStack>
      </CardBody>
    </Card>
  );
}
