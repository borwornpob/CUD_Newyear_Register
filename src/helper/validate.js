//import supabase
import { supabase } from "./supabaseClient";

export async function validateCurrentStudent(studentId, name) {
  if (studentId === "") return true;
  const { data, error } = await supabase
    .from("currentStudents")
    .select("*")
    .eq("studentID", studentId)
    .eq("Firstname", name);
  if (error) {
    console.log(error);
    return false;
  }
  if (data.length > 0) {
    return true;
  }
  return false;
}

export async function validateStudentGuardian(
  studentId,
  studentName,
  studentClass
) {
  if (studentId === "") return true;
  const { data, error } = await supabase
    .from("currentStudents")
    .select("*")
    .eq("studentID", studentId)
    .eq("Firstname", studentName)
    .eq("class", studentClass);
  if (error) {
    console.log(error);
    return false;
  }
  if (data.length > 0) {
    //check if guardian in guardian table in not exceed 2
    const { data, error } = await supabase
      .from("guardians")
      .select("*")
      .eq("studentID", studentId);
    if (error) {
      console.log(error);
      return false;
    }
    if (data.length < 2) {
      return true;
    }
    return false;
  }
  return false;
}

export async function validateAlumniStudent(
  studentId,
  studentName,
  graduatedYear
) {
  if (studentId === "") return true;
  const { data, error } = await supabase
    .from("alumni")
    .select("*")
    .eq("studentID", studentId)
    .eq("Firstname", studentName)
    .eq("graduatedYear", graduatedYear);
  if (error) {
    console.log(error);
    return false;
  }
  if (data.length > 0) {
    return true;
  }
  return false;
}
