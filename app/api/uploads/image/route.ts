import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  try {
    const formData = await request.formData()
    const image = formData.get('image')

    if (!(image instanceof File)) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }

    const backendFormData = new FormData()
    backendFormData.append(
      'image',
      new File([image], image.name || 'avatar.jpg', { type: image.type }),
    )

    const response = await fetch(
      `${process.env.BACKEND_ORIGIN}/api/uploads/image`,
      {
        method: 'POST',
        body: backendFormData,
        headers: {
          Cookie: cookieStore.toString(),
        },
        signal: AbortSignal.timeout(30_000),
      },
    )

    const data = await response.json().catch(() => null)

    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
