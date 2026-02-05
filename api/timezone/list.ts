import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // /api/timezone/list API 요청 시 GET 요청이 아니라면 405 Methods Not Allowed 실패 응답을 내려준다.
  if(req.method !== "GET") {
    return res
      .setHeader("Allow", "GET")
      .status(405)
      .end();
  }

  // API 요청 메서드가 GET인 경우, List Time Zone API를 요청하여 해당 응답을 반환한다.
  try {
    const response = await fetch(`https://api.timezonedb.com/v2.1/list-time-zone?key=${process.env.VITE_TIME_ZONE_API}&format=json`);
    
    const body = await response.text();

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/json");
    headers.set("Cache-Control", `private, max-age=${60 * 60 * 24 * 365}, immutable`);

    return res.status(response.status).setHeaders(headers).send(body);
  } catch(error) {
    // Fetch API는 네트워크 오류만 실패로 처리된다.
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      description: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
}