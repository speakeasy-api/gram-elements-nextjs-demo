import type { NextApiRequest, NextApiResponse } from "next";
import { createElementsServerHandlers } from "@gram-ai/elements/server";

// Disable Next.js body parsing so the handler can read the raw stream.
export const config = {
  api: {
    bodyParser: false,
  },
};

const handlers = createElementsServerHandlers();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await handlers.session(req, res, {
    userIdentifier: "123",
    embedOrigin: process.env.EMBED_ORIGIN || "",
  });
}
