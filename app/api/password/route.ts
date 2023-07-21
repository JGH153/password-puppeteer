import { levels } from "@/lib/levels";
import { NextResponse } from "next/server";

export interface PasswordRequestBody {
  password: string;
  level: number;
}

export interface PasswordResponseBody {
  ok: boolean;
  error?: string;
}

export async function POST(request: Request) {
  const requestBody = (await request.json()) as PasswordRequestBody;
  const password = requestBody.password;
  const level = requestBody.level;

  if (!password || password.length === 0) {
    return NextResponse.json<PasswordResponseBody>(
      { ok: false, error: "No password provided" },
      { status: 400 }
    );
  }

  if (!level) {
    return NextResponse.json<PasswordResponseBody>(
      { ok: false, error: "No level provided" },
      { status: 400 }
    );
  }

  const currentLevel = levels.find((current) => current.level === level);

  if (!currentLevel) {
    return NextResponse.json<PasswordResponseBody>(
      { ok: false, error: "Can't find level" },
      { status: 400 }
    );
  }

  const passwordUppercase = password.toUpperCase();

  if (passwordUppercase === currentLevel.password.toUpperCase()) {
    return NextResponse.json<PasswordResponseBody>(
      { ok: true },
      { status: 200 }
    );
  }

  console.log(
    passwordUppercase,
    currentLevel.password.toUpperCase(),
    level,
    currentLevel
  );

  return NextResponse.json<PasswordResponseBody>(
    { ok: false, error: "Wrong password" },
    { status: 200 }
  );
}
