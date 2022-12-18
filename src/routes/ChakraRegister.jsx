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
import { plunk } from "../helper/plunk";

import {
  validateAlumniStudent,
  validateCurrentStudent,
  validateStudentGuardian,
} from "../helper/validate";

export default function ChakraRegister() {
  const generatePassword = () => {
    const length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [personStatus, setPersonStatus] = useState("");
  const [variant, setVariant] = useState("success");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  const { width } = useWindowDimensions();

  const resetState = async () => {
    setName("");
    setEmail("");
    setId("");
    setPersonStatus("");
    setSurname("");
    setStudentId("");
  };

  const validateEmail = (email) => {
    if (email.length == 0) return true;
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  //interpolate root url with path
  const interpolateUrl = (path) => {
    return `${window.location.origin}${path}`;
  };

  const createUsers = async () => {
    //check all fields are filled
    const { data, error } = await supabase
      .from("registered")
      .select("*")
      .eq("email", email);
    if (error) {
      setStatus("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง");
      setVariant("error");
      resetState();
    }
    //If the user doesn't exist, create a new user
    if (data.length === 0) {
      const { error } = await supabase.from("registered").insert([
        {
          email: email,
          name: name,
          surname: surname,
          personStatus: personStatus,
          studentId: studentId,
          password: password,
        },
      ]);
      if (error) {
        setStatus("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง");
        setVariant("error");
        resetState();
      } else {
        await plunk.events.publish({
          email: email,
          event: "register",
          data: {
            name: name,
            linkToDelete: interpolateUrl(`/deleteTicket/${id}/${password}`),
          },
        });
        setStatus("ลงทะเบียนสำเร็จ!");
        setVariant("success");
        resetState();
      }
    } else {
      setStatus("มีผู้ใช้นี้อยู่ในระบบแล้ว กรุณาตรวจสอบข้อมูลอีกครั้ง");
      setVariant("error");
      resetState();
    }
  };

  const handleSubmit = async (e) => {
    console.log(password);
    switch (personStatus) {
      case "1":
        //check all fields are filled
        if (
          name === "" ||
          surname === "" ||
          email === "" ||
          personStatus === "" ||
          studentId === "" ||
          !validateEmail(email)
        ) {
          setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
          setVariant("error");
          break;
        } else {
          if (await validateCurrentStudent(studentId, name)) {
            await createUsers();
          } else {
            setStatus("รหัสนักเรียนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
            setVariant("error");
          }
          break;
        }
      case "3":
        //check all fields are filled
        if (
          name === "" ||
          surname === "" ||
          email === "" ||
          personStatus === "" ||
          studentId === "" ||
          !validateEmail(email) ||
          studentName === "" ||
          studentClass === ""
        ) {
          setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
          setVariant("error");
          break;
        } else {
          if (
            await validateStudentGuardian(studentId, studentName, studentClass)
          ) {
            await createUsers();
          } else {
            setStatus(
              "ข้อมูลนักเรียนในปกครองไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง หรือติดต่อ TODO: เบอร์ผู้ประสานงาน"
            );
            setVariant("error");
          }
          break;
        }
      case "5":
        //check all fields are filled
        if (
          name === "" ||
          surname === "" ||
          email === "" ||
          personStatus === "" ||
          studentId === "" ||
          !validateEmail(email) ||
          graduationYear === ""
        ) {
          setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
          setVariant("error");
          break;
        } else {
          if (await validateAlumniStudent(studentId, name, graduationYear)) {
            await createUsers();
          } else {
            setStatus(
              "ข้อมูลศิษย์เก่าไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง หรือติดต่อ TODO: เบอร์ผู้ประสานงาน"
            );
            setVariant("error");
          }

          break;
        }
      default:
        setStatus("กรุณาเลือกสถานะของคุณ");
        setVariant("error");
        break;
    }
  };

  return (
    <Container>
      <VStack mt={2}>
        <Heading>ลงทะเบียนเพื่อรับบัตรเข้างานได้ที่นี่!</Heading>
        <FormControl>
          <FormLabel>ชื่อ (กรุณากรอกเป็นภาษาไทยเท่านั้น)</FormLabel>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>นามสกุล</FormLabel>
          <Input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </FormControl>
        <FormControl isInvalid={!validateEmail(email)}>
          <FormLabel>อีเมล</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {validateEmail(email) ? null : (
            <FormErrorMessage>อีเมลไม่ถูกต้อง</FormErrorMessage>
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
            {/*<option value="2">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม</option>*/}
            <option value="3">ผู้ปกครอง</option>
            <option value="4">บุคลากรโรงเรียนสาธิตจุฬาฯ</option>
            <option value="6">ผู้ติดตามบุคคลากรโรงเรียนสาธิตจุฬาฯ</option>
            <option value="5">ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ</option>
          </Select>
        </FormControl>
        {/*
        <FormControl isInvalid={!validateID(id)}>
          <FormLabel>
            เลขประจำตัวบัตรประชาชน (กรอกตัวเลข 13 หลักเท่านั้น)
          </FormLabel>
          <Input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          {validateID(id) ? null : (
            <FormErrorMessage>เลขบัตรประชาชนไม่ถูกต้อง</FormErrorMessage>
          )}
        </FormControl>
        */}
        {personStatus === "1" && (
          <FormControl>
            <FormLabel>โปรดระบุเลขประจำตัวนักเรียน</FormLabel>
            <Input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </FormControl>
        )}

        {personStatus === "3" && (
          <FormControl mt={3}>
            <FormLabel>โปรดระบุเลขประจำตัวของนักเรียนในปกครอง</FormLabel>
            <Input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <FormControl mt={2}>
              <FormLabel>โปรดระบุชื่อของนักเรียนในปกครอง</FormLabel>
              <Input
                type="text"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>
                โปรดระบุระดับชั้นของนักเรียนในปกครอง (เช่น 3/1)
              </FormLabel>
              <Input
                type="text"
                placeholder="Student Class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
            </FormControl>
          </FormControl>
        )}
        {personStatus === "5" && (
          <FormControl mt={3}>
            <FormLabel>โปรดระบุเลขประจำตัวนักเรียน</FormLabel>
            <Input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <FormControl mt={3}>
              <FormLabel>โปรดระบุปีที่ท่านจบการศึกษา</FormLabel>
              <Input
                type="text"
                placeholder="Graduation Year"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              />
            </FormControl>
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
            ลงทะเบียน
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
