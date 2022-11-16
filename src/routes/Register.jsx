import React, { useState } from "react";
import { Button, Container, Form, Modal, Alert } from "react-bootstrap";
import { supabase } from "../helper/supabaseClient";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [personStatus, setPersonStatus] = useState("");
  const [variant, setVariant] = useState("success");

  const resetState = () => {
    setName("");
    setEmail("");
    setId("");
    setPersonStatus("");
  };

  //validate email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateID = (id) => {
    if (id.substring(0, 1) == 0) return false;
    if (id.length != 13) return false;
    for (var i = 0, sum = 0; i < 12; i++)
      sum += parseFloat(id.charAt(i)) * (13 - i);
    if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    //Check all the form fields are filled
    if (name && validateEmail(email) && validateID(id) && personStatus) {
      //Check if email is valid

      e.preventDefault();
      setStatus("loading");
      setVariant("info");
      //Check if the user already exists
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("id", id);
      if (error) {
        setStatus("Error");
        setVariant("danger");
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
        if (error) {
          setStatus("error");
          setVariant("danger");
          resetState();
        } else {
          setStatus("success");
          setVariant("success");
          resetState();
        }
      } else {
        setStatus("User already exists");
        setVariant("danger");
        resetState();
      }
    } else if (!name || !email || !id || !personStatus) {
      setStatus("Please fill all the fields");
      setVariant("danger");
    } else if (!validateEmail(email)) {
      setStatus("Invalid email");
      setVariant("danger");
    }
  };

  return (
    <Container>
      <div className="home-body mt-3">
        <Container>
          <Form>
            <Form.Group className="mt-2" controlId="formBasicName">
              <Form.Label>Enter your name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Text className="text-muted">
                <b>ชื่อภาษาอังกฤษเท่านั้น</b>
              </Form.Text>
            </Form.Group>
            <Form.Group className="mt-2" controlId="formBasicEmail">
              <Form.Label>Enter your email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="formBasicId">
              <Form.Label>Enter your ID</Form.Label>
              <Form.Control
                type="text"
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  console.log(e.target.value);
                }}
              />
              <Form.Text className="text-muted mt-1">
                {validateID(id) ? (
                  <b>เลขบัตรประชาชนถูกต้อง</b>
                ) : (
                  <b>เลขบัตรประชาชนไม่ถูกต้อง</b>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label className="mt-2">Select your status</Form.Label>
              <Form.Select
                value={personStatus}
                onChange={(e) => setPersonStatus(e.target.value)}
              >
                <option>โปรดระบุสถานะของคุณ</option>
                <option value="1">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยม</option>
                <option value="2">นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม</option>
                <option value="3">ผู้ปกครอง</option>
                <option value="4">บุคลากรโรงเรียนสาธิตจุฬาฯ</option>
                <option value="5">ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ</option>
              </Form.Select>
            </Form.Group>
            <Button
              className="mt-3"
              variant="primary"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form>
          {status ? (
            <Alert variant={variant} className="mt-2">
              {status}
            </Alert>
          ) : null}
        </Container>
      </div>
    </Container>
  );
}
