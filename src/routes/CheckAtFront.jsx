import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
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
} from "@chakra-ui/react";
import QRCode from "react-qr-code";
import useWindowDimensions from "../hooks/dimensions";

export default function CheckAtFront() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [id, setId] = useState(params.id);
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const [status, setStatus] = useState("");

  const { width } = useWindowDimensions();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("registered")
      .select("*")
      .eq("email", id);
    if (error) {
      setStatus("Error");
    }
    if (data.length === 0) {
      setStatus("No user found");
    }
    if (data.length > 0) {
      setStatus("User found");
      setData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusText = [
    "Error",
    "นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยม",
    "นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม",
    "ผู้ปกครอง นร.สาธิตจุฬาฯ มัธยม",
    "บุคลากรโรงเรียนสาธิตจุฬาฯ",
    "ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ",
    "ผู้ติดตามบุคคลากรโรงเรียนสาธิตจุฬาฯ",
  ];

  const handleSubmit = async (type) => {
    if (password == import.meta.env.VITE_STAFF_PASS) {
      //insert to db
      const { data, error } = await supabase.from("logs").insert([
        {
          email: id,
          type: type,
        },
      ]);
      if (error) {
        setStatus("Error");
      } else {
        setIsSuccess(true);
      }
    } else {
      setIsWrongPassword("Wrong password");
      setPassword("");
    }
  };

  return (
    <Container>
      {isSuccess ? (
        <Alert status="success">
          <AlertIcon />
          บันทึกสำเร็จ
        </Alert>
      ) : (
        <VStack>
          <Heading>ตรวจคนเข้าหน้างาน</Heading>
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
              ไม่พบเลขบัตรประชาชนนี้ในระบบ กรุณาตรวจสอบอีกครั้ง
            </Alert>
          )}
          {status === "User found" && (
            <VStack>
              <Card boxShadow="md">
                <CardBody>
                  <VStack p={0} m={0}>
                    <Heading size="md">
                      {data[0].name} {data[0].surname}
                    </Heading>

                    <Text>{data[0].email}</Text>
                    <Text>{statusText[data[0].personStatus]}</Text>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          )}
          <FormControl>
            <FormLabel>กรอกรหัสเจ้าหน้าที่</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
          <Button
            onClick={() => {
              handleSubmit("checkin");
            }}
            width="100%"
            colorScheme="blue"
          >
            ยืนยันการเข้างาน
          </Button>
          <Button
            onClick={() => {
              handleSubmit("checkout");
            }}
            width="100%"
            colorScheme="red"
          >
            ยืนยันการออกจากงาน
          </Button>
          {isWrongPassword === "Wrong password" && (
            <Alert status="error" variant="solid">
              <AlertIcon />
              รหัสผ่านไม่ถูกต้อง
            </Alert>
          )}
        </VStack>
      )}
    </Container>
  );
}
