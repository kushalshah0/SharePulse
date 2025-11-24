import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await axios.get(`${BASE_URL}/live/api/v1/nepselive/market-status`, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching market status:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch market status' },
      { status: error.response?.status || 500 }
    );
  }
}
