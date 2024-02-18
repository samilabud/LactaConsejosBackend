"use client";
import type { FC } from "react";
import { Button } from "./button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { signIn } from "next-auth/react";

const LoginButton: FC = () => {
  return (
    <Button className="mt-4 w-full" onClick={() => signIn()}>
      <span>Iniciar sesión</span>
      <KeyboardArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
};

export default LoginButton;
