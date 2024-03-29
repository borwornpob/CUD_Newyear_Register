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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Image,
} from "@chakra-ui/react";
import useWindowDimensions from "../hooks/dimensions";
import { plunk } from "../helper/plunk";
import { Link as routerLink } from "react-router-dom";

import Instruction1 from "../assets/instructions1.jpg";
import Instruction2 from "../assets/instructions2.jpg";

import {
  validateAlumniStudent,
  validateCurrentStudent,
  validateEmployee,
  validateEmployeeGuardian,
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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      if (personStatus === "3" || personStatus === "6") {
        //create user in another talbe
        const { error2 } = await supabase.from("guardians").insert([
          {
            email: email,
            name: name,
            surname: surname,
            studentID: studentId,
          },
        ]);
      }
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
            linkToDelete: interpolateUrl(`/deleteTicket/${email}/${password}`),
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
    setStatus("loading...");
    setVariant("info");
    if (acceptTerms) {
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
              break;
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
              await validateStudentGuardian(
                studentId,
                studentName,
                studentClass
              )
            ) {
              await createUsers();
              break;
            } else {
              setStatus(
                "ข้อมูลนักเรียนในปกครองไม่ถูกต้องหรือโควตาลงทะเบียนของนักเรียนถูกใช้หมดแล้ว กรุณาตรวจสอบอีกครั้ง หรือติดต่อผ่าน Line Official"
              );
              setVariant("error");
            }
            break;
          }
        case "4":
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
            if (await validateEmployee(studentId, name)) {
              await createUsers();
              break;
            } else {
              setStatus(
                "ข้อมูลบุคลากรไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง หรือติดต่อผ่าน Line Official"
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
              break;
            } else {
              setStatus(
                "ข้อมูลศิษย์เก่าไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง หรือติดต่อผ่าน Line Official"
              );
              setVariant("error");
            }

            break;
          }
        case "6":
          //check all fields are filled
          if (
            name === "" ||
            surname === "" ||
            email === "" ||
            personStatus === "" ||
            studentId === "" ||
            !validateEmail(email) ||
            studentName === ""
          ) {
            setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
            setVariant("error");
            break;
          } else {
            if (await validateEmployeeGuardian(studentId, studentName)) {
              await createUsers();
              break;
            } else {
              setStatus(
                "ข้อมูลบุคลากรไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง หรือติดต่อผ่าน Line Official"
              );
              setVariant("error");
            }
          }

        case "7":
          //check all fields are filled
          if (
            name === "" ||
            surname === "" ||
            email === "" ||
            personStatus === "" ||
            !validateEmail(email)
          ) {
            setStatus("กรุณากรอกข้อมูลให้ครบถ้วน");
            setVariant("error");
            break;
          } else {
            await createUsers();
            break;
          }
        default:
          setStatus("กรุณาเลือกสถานะของคุณ");
          setVariant("error");
          break;
      }
    } else {
      setStatus("กรุณายอมรับข้อตกลง");
      setVariant("error");
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
            {/*<option value="1">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยม</option>*/}
            {/*<option value="2">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม</option>*/}
            <option value="3">ผู้ปกครอง นร.สาธิตจุฬาฯ มัธยม</option>
            {/*<option value="4">บุคลากรโรงเรียนสาธิตจุฬาฯ</option>*/}
            <option value="6">ผู้ติดตามบุคคลากรโรงเรียนสาธิตจุฬาฯ</option>*/
            <option value="5">ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ</option>
            <option value="7">
              ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยมที่จบการศึกษาก่อนปี 2562
            </option>
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
              <FormLabel>
                โปรดระบุชื่อของนักเรียนในปกครอง (กรอกเพียงแค่ชื่อ เช่น บวรภพ)
              </FormLabel>
              <Input
                type="text"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel>
                โปรดระบุระดับชั้นของนักเรียนในปกครอง (เช่น ม.3/1 จำเป็นต้องมี ม.
                นำหน้า)
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
        {personStatus === "4" && (
          <FormControl mt={3}>
            <FormLabel>โปรดระบุเลขประจำตัวบุคลากร</FormLabel>
            <Input
              type="text"
              placeholder="Employee ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
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
              <FormLabel>
                โปรดระบุปีที่ท่านจบการศึกษา (เช่น 2563 หรือ 2564)
              </FormLabel>
              <Input
                type="text"
                placeholder="Graduation Year"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              />
            </FormControl>
          </FormControl>
        )}
        {personStatus === "6" && (
          <FormControl mt={3}>
            <FormLabel>โปรดระบุเลขประจำตัวบุคลากร</FormLabel>
            <Input
              type="text"
              placeholder="Employee ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <FormControl mt={2}>
              <FormLabel>
                โปรดระบุชื่อบุคลากร (กรอกเพียงแค่ชื่อ เช่น สิทธิชัย)
              </FormLabel>
              <Input
                type="text"
                placeholder="Employee Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </FormControl>
          </FormControl>
        )}
        <Checkbox
          onChange={() => {
            setAcceptTerms(!acceptTerms);
            onOpen();
          }}
        >
          ข้าพเจ้ารับทราบและจะปฏิบัติตามแนวปฏิบัติการเข้าร่วมกิจกรรมคอนเสิร์ต
        </Checkbox>
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
        <Container p={0}>
          <Text>
            เมื่อลงทะเบียนสำเร็จแล้วให้คลิกปุ่ม ค้นหาบัตร เพื่อบันทึกภาพ QRCode
            เพื่อใช้แสดงการเข้างาน ณ ประตู 5 (สามารถเข้าได้งานได้ตั้งแต่เวลา
            16:00 - 19:30 น.)
          </Text>
        </Container>
        <Container p={0}>
          <Button
            colorScheme="teal"
            width="100%"
            mt={2}
            variant="outline"
            as={routerLink}
            to="/tickets"
          >
            ค้นหาบัตรเข้างานได้ที่นี่
          </Button>
        </Container>
        <Container p={0}>
          <Text>
            หากพบปัญหาในการลงทะเบียนสามารถติดต่อได้ที่ Line ID: @156subqf
            หรือกดปุ่มด้านล่างเพื่อเพิ่มเพื่อน
          </Text>
          <VStack mt={3}>
            <Button
              colorScheme="teal"
              width="100%"
              onClick={
                //href to another site
                () => window.open("https://lin.ee/Is71r3U")
              }
            >
              Add Line Friend
            </Button>
          </VStack>
        </Container>
        {status && (
          <Alert status={variant} mt={4}>
            <AlertIcon />
            {status}
          </Alert>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>เงื่อนไขการเข้างานคอนเสิร์ตปีใหม่</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image src={Instruction1}></Image>
              <Image src={Instruction2}></Image>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose}>
                ยอมรับ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
