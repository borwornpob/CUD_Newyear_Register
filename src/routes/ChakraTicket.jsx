import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Flex,
  Heading,
  Link,
  Spacer,
  useToast,
  Container,
  Button,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  DarkMode,
  Card,
  CardBody,
  Text,
  Image,
} from "@chakra-ui/react";

import { supabase } from "../helper/supabaseClient";
import QRCode from "react-qr-code";
import useWindowDimensions from "../hooks/dimensions";

export default function Ticket() {
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");

  const { width } = useWindowDimensions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    if (id) {
      const { data, error } = await supabase
        .from("registered")
        .select("*")
        .eq("email", id);
      if (error) {
        setStatus("Error");
        resetState();
      }
      if (data.length === 0) {
        setStatus("No user found");
        resetState();
      }
      if (data.length > 0) {
        setStatus("User found");
        setData(data);
        setUrl(interpolateUrl(`/checkAtFront/${data[0].email}/`));
      }
    } else if (id == "") {
      setStatus("Please enter id");
      resetState();
    }
  };

  const resetState = () => {
    setId("");
  };

  const statusText = [
    "Error",
    "นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยม",
    "นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม",
    "ผู้ปกครอง นร.สาธิตจุฬาฯ มัธยม",
    "บุคลากรโรงเรียนสาธิตจุฬาฯ",
    "ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ",
    "ผู้ติดตามบุคคลากรโรงเรียนสาธิตจุฬาฯ",
    "ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยมที่จบการศึกษาก่อนปี 2562",
  ];

  const interpolateUrl = (path) => {
    return `${window.location.origin}${path}`;
  };

  return (
    <Container>
      <VStack>
        <Heading>ค้นหาบัตรเข้างานได้ที่นี่!</Heading>
        <FormControl id="id" isRequired>
          <FormLabel>กรุณากรอกอีเมลที่ลงทะเบียนไว้แล้ว</FormLabel>
          <Input
            type="text"
            placeholder="Email"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleSubmit} width="100%">
          ค้นหาเลย!
        </Button>
        {status === "loading" && (
          <Alert status="info" variant="solid">
            <AlertIcon />
            กำลังค้นหา...
          </Alert>
        )}
        {status === "Error" && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง
          </Alert>
        )}
        {status === "No user found" && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้ง
          </Alert>
        )}
        {status === "User found" && (
          <VStack>
            <Card maxW="md" boxShadow="md">
              <CardBody>
                <VStack p={0}>
                  <QRCode value={url} />
                  <Heading size="md">
                    {data[0].name + " " + data[0].surname}
                  </Heading>
                  <Text>{data[0].email}</Text>
                  <Text>{statusText[data[0].personStatus]}</Text>
                </VStack>
              </CardBody>
            </Card>
            {/*<Box size="sm">
              <Image
                src={() => {
                  fetch(
                    `https://tubular-zabaione-3b2375.netlify.app/.netlify/functions/index/image?text=${
                      data[0].name
                    } ${data[0].surname}&email=${data[0].email}&status=${
                      statusText[data[0].personStatus]
                    }&logLink=${url}`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data[0]);
                      return data[0];
                    });
                }}
              />
              </Box>*/}
            <Text>
              โปรดนำบัตรเข้างานและแสดงบัตรประชาชนเพื่อยืนยันตัวตนต่อเจ้าหน้าที่
            </Text>
          </VStack>
        )}
        {status === "Please enter id" && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            กรุณากรอกอีเมลที่ลงทะเบียนไว้แล้ว
          </Alert>
        )}
      </VStack>
    </Container>
  );
}
