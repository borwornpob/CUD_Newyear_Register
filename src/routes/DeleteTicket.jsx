import React, { useEffect, useState } from "react";
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
import useWindowDimensions from "../hooks/dimensions";
import { useLoaderData, useParams } from "react-router-dom";
import QRCode from "react-qr-code";

export default function DeleteTicket() {
  let params = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(params.id);
  const [password, setPassword] = useState(params.password);
  const [status, setStatus] = useState("");
  const [personStatus, setPersonStatus] = useState("");
  const [variant, setVariant] = useState("success");
  const [data, setData] = useState([]);

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async (e) => {
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
        if (data[0].password === password) {
          setStatus("User found");
          setData(data);
        } else {
          setStatus("Unauthorized");
          resetState();
        }
      }
    } else if (id == "") {
      setStatus("Please enter id");
      resetState();
    }
  };

  //handle Delete user with id
  const handleDelete = async (e) => {
    e.preventDefault();
    setStatus("loading");
    if (id) {
      const { data, error } = await supabase
        .from("registered")
        .select("*")
        .eq("email", id);
      if (data[0].personStatus === "4" || data[0].personStatus === "6") {
        //detete user from registered and delete user from guardians
        const { data, error } = await supabase
          .from("registered")
          .delete()
          .eq("email", id);
        if (error) {
          setStatus("Error");
          resetState();
        }
        const { data2, error2 } = await supabase
          .from("guardians")
          .delete()
          .eq("email", id);
        if (error2) {
          setStatus("Error");
          resetState();
        } else {
          setStatus("User deleted");
          setVariant("success");
        }
      }
      if (error) {
        setStatus("Error");
        resetState();
      }
    } else {
      setStatus("Error");
      setVariant("error");
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
    "ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยมที่จบการศึกษาก่อนปี 2562",
  ];
  return (
    <Container>
      <VStack>
        <Heading>ลบข้อมูลการลงทะเบียน</Heading>
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
            <Card maxW="md" boxShadow="md">
              <CardBody>
                <VStack p={0}>
                  <Heading size="md">
                    {data[0].name} {data[0].surname}
                  </Heading>
                  <Text>{data[0].email}</Text>
                  <Text>{statusText[data[0].status]}</Text>
                </VStack>
              </CardBody>
            </Card>
            <Button
              colorScheme="red"
              isLoading={status === "loading"}
              loadingText="Submitting"
              onClick={handleDelete}
              width="100%"
              mt={2}
            >
              ยืนยันการลบข้อมูล
            </Button>
          </VStack>
        )}
        {status === "User deleted" && (
          <Alert status="success" variant="solid">
            <AlertIcon />
            ลบข้อมูลเรียบร้อยแล้ว
          </Alert>
        )}
        {status === "Unauthorized" && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            ไม่มีสิทธิ์ในการลบข้อมูลนี้ ถ้าต้องการลบข้อมูลกรุณาติดต่อผู้ดูแลระบบ
          </Alert>
        )}
      </VStack>
    </Container>
  );
}
