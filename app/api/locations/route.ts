import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';

import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';


export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
  const cookieStore = await cookies();
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const region = searchParams.get('region') ?? '';
  const type = searchParams.get('type') ?? '';
  const search = searchParams.get('search') ?? '';
  const rate = searchParams.get('rate');
  const sortBy = searchParams.get('sortBy') ?? 'rate';
  const sortOrder = searchParams.get('sortOrder') ?? 'desc';


  try {
    const res = await api('/locations', {
      params: {
        page,
        limit,
        ...(region && { region }),
        ...(type && { type }),
        ...(search && { search }),
        ...(rate && { rate }),
        sortBy,
        sortOrder,
      },
         headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.message,
          response: error.response?.data,
        },
        {
          status: error.status
        }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};