import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const size = searchParams.get('size') || '8';
  const page = searchParams.get('page') || '1';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/data/api/v1/announcement?symbol=${encodeURIComponent(symbol)}&Size=${size}&Page=${page}`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data.data);
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch announcements data' },
      { status: error.response?.status || 500 }
    );
  }
}
