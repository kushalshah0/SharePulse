import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await axios.get(`${BASE_URL}/live/api/v2/nepselive/live-nepse`, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching all stocks data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch all stocks data' },
      { status: error.response?.status || 500 }
    );
  }
}
