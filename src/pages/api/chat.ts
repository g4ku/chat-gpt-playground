import type { NextApiRequest, NextApiResponse } from "next";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

type Data = {
  content: string;
  tokens: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_APIKEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: JSON.parse(req.body),
    }),
  }).then((res) => res.json());

  console.log(result);

  if (result.error) {
    return res
      .status(400)
      .json({ content: "", tokens: 0, error: result.error.message });
  }

  res.status(200).json({
    content: result.choices[0].message.content,
    tokens: result.usage.total_tokens,
  });
}
