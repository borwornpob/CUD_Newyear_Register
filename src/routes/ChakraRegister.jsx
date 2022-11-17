import React, { useState } from "react";
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
} from "@chakra-ui/react";
import useWindowDimensions from "../hooks/dimensions";

export default function ChakraRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [personStatus, setPersonStatus] = useState("");
  const [variant, setVariant] = useState("success");
  const [studentId, setStudentId] = useState("");

  const { width } = useWindowDimensions();

  const resetState = () => {
    setName("");
    setEmail("");
    setId("");
    setPersonStatus("");
  };

  const validateEmail = (email) => {
    if (email.length == 0) return true;
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateID = (id) => {
    if (id === "") return true;
    if (id.substring(0, 1) == 0) return false;
    if (id.length != 13) return false;
    for (var i = 0, sum = 0; i < 12; i++)
      sum += parseFloat(id.charAt(i)) * (13 - i);
    if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false;
    return true;
  };

  const checkStudentId = async (studentId, personStatus) => {
    if (personStatus != "3") return true;
    if (studentId === "") return true;
    //Check if studentId count in database is less than 2
    const { data, error } = await supabase
      .from("studentGuardian")
      .select("*")
      .eq("id", studentId);
    if (error) {
      setStatus("error");
      setVariant("error");
      return false;
    }
    console.log(data.length);
    if (data.length < 2) {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    if (await checkStudentId(studentId, personStatus)) {
      //Check all the form fields are filled
      if (name && validateEmail(email) && validateID(id) && personStatus) {
        e.preventDefault();
        setStatus("กำลังโหลด...");
        setVariant("info");
        //Check if the user already exists
        const { data, error } = await supabase
          .from("Users")
          .select("*")
          .eq("id", id);
        if (error) {
          setStatus("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง");
          setVariant("error");
          resetState();
        }
        //If the user doesn't exist, create a new user
        if (data.length === 0) {
          const { error } = await supabase.from("Users").insert([
            {
              id: id,
              name: name,
              email: email,
              status: personStatus,
            },
          ]);
          if (personStatus == "3") {
            const { error2 } = await supabase.from("studentGuardian").insert([
              {
                id: studentId,
              },
            ]);
          }
          if (error) {
            setStatus("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง");
            setVariant("error");
            resetState();
          } else {
            setStatus("ลงทะเบียนสำเร็จ!");
            setVariant("success");
            resetState();
          }
        } else {
          setStatus("มีบัตรประชาชนนี้อยู่ในระบบแล้ว กรุณาตรวจสอบอีกครั้ง");
          setVariant("error");
          resetState();
        }
      } else if (!name || !email || !id || !personStatus) {
        setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
        setVariant("error");
      } else if (!validateEmail(email)) {
        setStatus("กรุณากรอกอีเมลให้ถูกต้อง");
        setVariant("error");
      }
    } else {
      setStatus("โควตานักเรียนเต็มแล้ว กรุณาติดต่อผู้ดูแลระบบ");
      setVariant("error");
      resetState();
    }
  };

  return (
    <Container>
      <VStack mt={2}>
        <Heading>ลงทะเบียนเพื่อรับบัตรเข้างานได้ที่นี่!</Heading>
        <FormControl>
          <FormLabel>ชื่อและนามสกุล</FormLabel>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormHelperText>กรุณากรอกเป็นภาษาไทยเท่านั้น</FormHelperText>
        </FormControl>
        <FormControl isInvalid={!validateEmail(email)}>
          <FormLabel>อีเมล</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {validateEmail(email) ? (
            <FormHelperText>กรุณากรอกอีเมลของท่าน</FormHelperText>
          ) : (
            <FormErrorMessage>อีเมลไม่ถูกต้อง</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!validateID(id)}>
          <FormLabel>เลขประจำตัวบัตรประชาชน</FormLabel>
          <Input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          {validateID(id) ? (
            <FormHelperText>กรอกตัวเลข 13 หลักเท่านั้น</FormHelperText>
          ) : (
            <FormErrorMessage>เลขบัตรประชาชนไม่ถูกต้อง</FormErrorMessage>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>โปรดระบุสถานะของคุณ</FormLabel>
          <Select
            value={personStatus}
            onChange={(e) => setPersonStatus(e.target.value)}
          >
            <option>Select your option</option>
            <option value="1">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยม</option>
            <option value="2">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม</option>
            <option value="3">ผู้ปกครอง</option>
            <option value="4">บุคลากรโรงเรียนสาธิตจุฬาฯ</option>
            <option value="5">ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ</option>
          </Select>
        </FormControl>
        {personStatus === "3" && (
          <FormControl>
            <FormLabel>โปรดระบุเลขประจำตัวบัตรประชาชนของนักเรียน</FormLabel>
            <Input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <FormHelperText>กรอกตัวเลข 13 หลักเท่านั้น</FormHelperText>
          </FormControl>
        )}
        <Container p={0}>
          <Button
            colorScheme="teal"
            isLoading={status === "loading"}
            loadingText="Submitting"
            onClick={handleSubmit}
            width="100%"
            mt={2}
          >
            Register
          </Button>
        </Container>
        {status && (
          <Alert status={variant} mt={4}>
            <AlertIcon />
            {status}
          </Alert>
        )}
      </VStack>
    </Container>
  );
}
