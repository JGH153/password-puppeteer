"use client";
import { Skeleton } from "@/components/Skeleton";
import { Spinner } from "@/components/Spinner";
import { config } from "@/lib/config";
import { postJsonResponse } from "@/lib/fetch";
import { LevelNoPassword } from "@/lib/levels";
import LogRocket from "logrocket";
import { useEffect, useState } from "react";
import { PasswordInput } from "./PasswordInput";
import { PromptInput } from "./PromptInput";
import { GptRequestBody, GptResponseBody } from "./api/gpt/route";
import {
  PasswordRequestBody,
  PasswordResponseBody,
} from "./api/password/route";

interface Props {
  levels: LevelNoPassword[];
}

export const Game = ({ levels }: Props) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState("");
  const [gptAnswer, setGptAnswer] = useState("");
  const [loadingGpt, setLoadingGpt] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [level, setLevel] = useState(1);
  const [lastLevelPassword, setLastLevelPassword] = useState("");

  const submitPrompt = async () => {
    if (!promptInput) {
      return alert("Please enter a prompt");
    }
    setLoadingGpt(true);
    setGptAnswer("");
    try {
      setLastSubmittedPrompt(promptInput);
      const response = await postJsonResponse<GptRequestBody, GptResponseBody>(
        "/api/gpt",
        {
          prompt: promptInput,
          currentLevel: level,
          lastLevelPassword,
        }
      );
      setGptAnswer(response.response);
    } catch (e: any) {
      alert("Something went wrong. Please try again. " + e.message);
    } finally {
      setLoadingGpt(false);
    }
  };

  const submitPassword = async () => {
    if (!passwordInput) {
      return alert("Please enter a password");
    }
    setLoadingPassword(true);
    try {
      const response = await postJsonResponse<
        PasswordRequestBody,
        PasswordResponseBody
      >("/api/password", {
        password: passwordInput,
        level,
        lastSubmittedPrompt,
      });
      if (response.ok) {
        const victoryLevel = levels.find((current) => current.level === level);
        setLevel(level + 1);
        setLastLevelPassword(passwordInput);
        setPasswordInput("");
        alert("Correct password!" + " " + victoryLevel?.victoryMessage);
      } else {
        alert("Wrong password!");
      }
    } catch (e: any) {
      alert("Something went wrong. Please try again. " + e.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  useEffect(() => {
    //TODO improve
    if (level === levels.length + 1) {
      alert("You won🎉!");
    }
  }, [level, levels]);

  useEffect(() => {
    const env = process.env.NODE_ENV;
    if (typeof window !== "undefined" && env == "production") {
      console.log("Initializing LogRocket");
      LogRocket.init(config.logRocketProjectId);
    }
  }, []);

  return (
    <>
      <p className="mb-4">
        We have given GPT a password. The goal of the game is to trick GPT to
        reveal the password for the level. There are currently {levels.length}{" "}
        levels. Can you fool GPT?
      </p>
      <p className="text-center mb-4">The current level is {level}.</p>
      <p className="text-center mb-4">
        {levels.find((current) => current.level === level)?.userInfo ??
          "No more levels for now"}
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
