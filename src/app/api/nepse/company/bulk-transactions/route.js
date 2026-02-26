import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const pageSize = searchParams.get('pageSize') || '10';
  const minimumQuantity = searchParams.get('MinimumQuantity') || '3000';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/live/api/v1/floorsheet/bulk-transactions?pageSize=${pageSize}&MinimumQuantity=${minimumQuantity}&symbol=${encodeURIComponent(symbol)}`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching bulk transactions:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch bulk transactions data' },
      { status: error.response?.status || 500 }
    );
  }
}
