import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { supabase } from "../helper/supabaseClient";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import useWindowDimensions from "../hooks/dimensions";

export default function Ticket() {
  //create 1 form for recieving the id
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);

  const { width } = useWindowDimensions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
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
    }
  };

  const resetState = () => {
    setId("");
  };

  const statusText = [
    "Error",
    "นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายมัธยม",
    "นักเรียนโรงเรียนสาธิตจุฬาฯ ฝ่ายประถม",
    "ผู้ปกครอง",
    "บุคลากรโรงเรียนสาธิตจุฬาฯ",
    "ศิษย์เก่าโรงเรียนสาธิตจุฬาฯ",
    "ผู้ติดตามบุคลากรโรงเรียนสาธิตจุฬาฯ",
  ];

  return (
    <Container>
      <h2 className="mt-2">Find my ticket</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicID">
          <Form.Label>กรอกอีเมลที่ลงทะเบียนแล้ว</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your email here"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-2">
          Submit
        </Button>
      </Form>
      {status === "loading" && <Alert variant="info">Loading...</Alert>}
      {status === "User found" && <Alert variant="success">User found</Alert>}
      {status === "No user found" && (
        <Alert variant="danger">No user found</Alert>
      )}
      {status === "Error" && <Alert variant="danger">Error</Alert>}
      {data.length > 0 && (
        <div>
          <h3>ข้อมูลผู้ลงทะเบียน</h3>
          <p>ชื่อ: {data[0].name}</p>
          <p>เลขบัตรประชาชน: {data[0].id}</p>
          <p>อีเมล: {data[0].email}</p>
          <p>สถานะ: {statusText[data[0].status]}</p>
          <QRCode
            value={data[0].id.toString()}
            size={width * 0.6}
            style={{ height: "auto", maxWidth: "100%" }}
            className="mb-5"
          />
        </div>
      )}
    </Container>
  );
}
