"use client";
import { useEffect, useState } from "react";
import { PasswordInput } from "./PasswordInput";
import { PromptInput } from "./PromptInput";
import { Spinner } from "@/components/Spinner";
import { GptRequestBody, GptResponseBody } from "./api/gpt/route";
import { postJsonResponse } from "@/lib/fetch";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import {
  PasswordRequestBody,
  PasswordResponseBody,
} from "./api/password/route";
import { LevelNoPassword } from "@/lib/levels";

interface Props {
  levels: LevelNoPassword[];
}

export const Game = ({ levels }: Props) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [gptAnswer, setGptAnswer] = useState("");
  const [loadingGpt, setLoadingGpt] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [level, setLevel] = useState(1);
  // copy to url and read upon startup, or use constantly
  const [lastLevelPassword, setLastLevelPassword] = useState("");

  const submitPrompt = async () => {
    if (!promptInput) {
      return alert("Please enter a prompt");
    }
    setLoadingGpt(true);
    setGptAnswer("");
    // TODO handle error states
    const response = await postJsonResponse<GptRequestBody, GptResponseBody>(
      "/api/gpt",
      {
        prompt: promptInput,
        currentLevel: level,
        lastLevelPassword,
      }
    );
    setLoadingGpt(false);
    setGptAnswer(response.response);
  };

  const submitPassword = async () => {
    if (!passwordInput) {
      return alert("Please enter a password");
    }
    // TODO
    setLoadingPassword(true);
    // TODO handle error states
    const response = await postJsonResponse<
      PasswordRequestBody,
      PasswordResponseBody
    >("/api/password", {
      password: passwordInput,
      level,
    });
    if (response.ok) {
      setLevel(level + 1);
      setLastLevelPassword(passwordInput);
      setPasswordInput("");
      alert("Correct password!");
    } else {
      alert("Wrong password!");
    }
    setLoadingPassword(false);
  };

  useEffect(() => {
    //TODO improve
    if (level === levels.length + 1) {
      alert("You won!");
    }
  }, [level, levels]);

  return (
    <>
      <p className="mb-4">
        We have given GTP a password. The goal of the game is to trick GTP to
        reveal the password for the level. There are currently 4 levels. Can you
        fool GTP?
      </p>
      <p className="text-center mb-4">The current level is {level}.</p>
      <p className="text-center mb-4">
        {levels.find((current) => current.level === level)?.userInfo ??
          "Unknown level"}
      </p>

      <PromptInput
        className="mt-4"
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        onSubmitPrompt={submitPrompt}
      />

      <div className="my-4">
        {loadingGpt && <Skeleton />}
        {gptAnswer}
      </div>

      {/* TODO only show after first promt is submitted */}
      <PasswordInput
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        onSubmitPassword={submitPassword}
      />

      <div className="my-4">{loadingPassword && <Spinner />}</div>
    </>
  );
};
