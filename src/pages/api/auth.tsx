// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export function buildAccessPath() {
  return path.join(process.cwd(), "src", "data", "access.json");
}

export function extractAccess(filePath: any) {
  const fileData: any = fs.readFileSync(filePath);
  const data = JSON.parse(fileData);
  return data;
}

function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "POST") {
    const username = req.body.username;
    const password = req.body.password;

    const filePath = buildAccessPath();
    const data = extractAccess(filePath);

    const user = data.find(
      (d: any) => d.username === username && d.password === password
    );

    if (user) {
      delete user.password;
      res.status(201).json({ hasError: false, message: "Success!", user });
    } else {
      res
        .status(201)
        .json({ hasError: true, message: "Invalid Username and Password" });
    }
  } else {
    const filePath = buildAccessPath();
    const data = extractAccess(filePath);
    // res.status(200).json({ access: data });
  }
}

export default handler;
