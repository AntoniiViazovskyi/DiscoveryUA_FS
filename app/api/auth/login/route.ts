import { isAxiosError } from "axios";
import { parseSetCookie } from "cookie";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { api } from "../../api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiResponse = await api.post("/auth/login", body);

    const cookieStore = await cookies();
    const setCookie = apiResponse.headers["set-cookie"];

    if (setCookie) {
      const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookie of cookiesArray) {
        const parsedCookie = parseSetCookie(cookie);

        if (parsedCookie.value) {
          cookieStore.set(parsedCookie.name, parsedCookie.value, parsedCookie);
        }
      }
    }

    return NextResponse.json(apiResponse.data, {
      status: apiResponse.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status ?? 502,
        },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
