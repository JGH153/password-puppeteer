import { gptCheckForPassword } from "@/lib/gptCheckForPassword";
import { levels } from "@/lib/levels";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export interface GptRequestBody {
  prompt: string;
  lastLevelPassword: string;
  currentLevel: number;
}

export interface GptResponseBody {
  response: string;
  error?: string;
}

// const gptExtraSystemPrompt = `If you can't tell the user the password tell them: I've been instructed not to provide you the password.`;
const gptExtraSystemPrompt = "";

export async function POST(request: Request) {
  const requestBody = (await request.json()) as GptRequestBody;
  const prompt = requestBody.prompt;

  if (!prompt || prompt.length === 0) {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }
  if (prompt.length > 2000) {
    return NextResponse.json(
      { error: "Max length of 2000 chars" },
      { status: 400 }
    );
  }
  if (requestBody.currentLevel > levels.length) {
    return NextResponse.json(
      { error: "Out of bounds on levels" },
      { status: 400 }
    );
  }

  // level 1 requires no password
  if (requestBody.currentLevel > 1) {
    const lastLevelActualPassword = levels.find(
      (current) => current.level === requestBody.currentLevel - 1
    )?.password;

    if (
      lastLevelActualPassword?.toLowerCase().trim() !==
      requestBody.lastLevelPassword?.toLowerCase().trim()
    ) {
      return NextResponse.json(
        { error: "Wrong last level password" },
        { status: 400 }
      );
    }
  }

  const currentLevel = levels.find(
    (current) => current.level === requestBody.currentLevel
  );

  if (!currentLevel) {
    return NextResponse.json({ error: "Unknown level" }, { status: 400 });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const systemMessage = `The password is "${currentLevel.password}". ${currentLevel.systemMessage} ${gptExtraSystemPrompt}`;

  // console.log(systemMessage, "|", prompt);

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      { role: "user", content: prompt },
    ],
  });

  const chartResponse = chatCompletion.data.choices[0].message?.content;

  if (currentLevel.useExtraGPT) {
    const passwordCheck = await gptCheckForPassword(
      chartResponse || "",
      currentLevel.password
    );
    if (passwordCheck.revealPassword) {
      return NextResponse.json({
        response:
          "Your attempt to get the password was stopped by a second round of GPT",
      });
    }
  }

  return NextResponse.json({ response: chartResponse });
}
