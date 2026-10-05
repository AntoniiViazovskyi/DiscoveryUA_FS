import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { api } from "../../api";

export async function POST() {
  const cookieStore = await cookies();

  try {
    await api.post("/auth/logout", null, {
      headers: { Cookie: cookieStore.toString() },
      timeout: 10000,
    });
  } catch (error) {
    // An expired session must not prevent clearing the browser cookies.
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return NextResponse.json(
        { error: "Не вдалося вийти. Спробуйте ще раз." },
        { status: isAxiosError(error) ? error.response?.status ?? 502 : 500 },
      );
    }
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("sessionId");

  return new NextResponse(null, { status: 204 });
}
