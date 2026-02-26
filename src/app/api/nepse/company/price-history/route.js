import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const pageSize = searchParams.get('pageSize') || '10';
  const page = searchParams.get('page') || '1';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/data/api/v1/price-history?pageSize=${pageSize}&page=${page}&symbol=${encodeURIComponent(symbol)}`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data.data);
  } catch (error) {
    console.error('Error fetching price history:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch price history data' },
      { status: error.response?.status || 500 }
    );
  }
}
