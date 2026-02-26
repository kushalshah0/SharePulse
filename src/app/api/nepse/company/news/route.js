import { NextResponse } from 'next/server';
import axios from 'axios';

const NEWS_BASE_URL = 'https://arthakendra.com';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const limit = searchParams.get('limit') || '6';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${NEWS_BASE_URL}/api/v1/news/sharehub/stock-news?limit=${limit}&companySymbol=${encodeURIComponent(symbol)}`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: error.response?.status || 500 }
    );
  }
}
