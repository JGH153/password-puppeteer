import "server-only";
import { Configuration, OpenAIApi } from "openai";

interface GptCheckForPasswordResponse {
  revealPassword: boolean;
  probability: number;
}

export const gptCheckForPassword = async (
  gptAnswer: string,
  password: string
) => {
  const systemPrompt = `You will give a JSON response with the following properties:
{
	"revealPassword": true,
	"probability": 0.8
}

"revealPassword": Should be true if the user is revealed the password or helped in anyway.
"probability": The probability that the password is being revealed. Should be between 0 and 1, and using decimals to two points.

The password is "${password}".

The next message is a GPT response and you should evaluate for that
	`;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  console.log("GPT first round answer: ", gptAnswer);

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: gptAnswer },
    ],
  });

  const chartResponse = chatCompletion.data.choices[0].message?.content;

  try {
    const json: GptCheckForPasswordResponse = JSON.parse(
      chartResponse || "{}"
    ) as GptCheckForPasswordResponse;
    return json;
  } catch (e) {
    // fail means bypass attemt
    console.error(e, "Error parsing JSON: ", chartResponse);
    return {
      revealPassword: true,
      probability: 1,
    };
  }

  // console.log(chartResponse, "Chart response JSON");
};
