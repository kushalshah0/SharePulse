import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const size = searchParams.get('size') || '20';
    const page = searchParams.get('page') || '1';
    const symbol = searchParams.get('symbol') || '';
    
    // Build URL with optional symbol parameter
    let apiUrl = `https://sharehubnepal.com/live/api/v2/floorsheet?Size=${size}&page=${page}`;
    if (symbol) {
      apiUrl += `&symbol=${encodeURIComponent(symbol)}`;
    }
    
    const response = await fetch(
      apiUrl,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 5 }, // Cache for 5 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch floorsheet data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching floorsheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch floorsheet data' },
      { status: 500 }
    );
  }
}
