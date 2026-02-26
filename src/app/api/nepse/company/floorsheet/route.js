import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const size = searchParams.get('size') || '10';
  const page = searchParams.get('page') || '1';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/live/api/v2/floorsheet?Size=${size}&Page=${page}&symbol=${encodeURIComponent(symbol)}`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching company floorsheet:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch floorsheet data' },
      { status: error.response?.status || 500 }
    );
  }
}
