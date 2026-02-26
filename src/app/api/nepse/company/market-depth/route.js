import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  try {
    const allStocksResponse = await axios.get(
      `${BASE_URL}/live/api/v2/nepselive/live-nepse`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const allStocks = Array.isArray(allStocksResponse.data) 
      ? allStocksResponse.data 
      : allStocksResponse.data?.allStocks || [];
    
    const stockInfo = allStocks.find((s) => s.symbol?.toUpperCase() === symbol.toUpperCase());
    
    if (!stockInfo || !stockInfo.securityId) {
      return NextResponse.json({
        buyOrders: [],
        sellOrders: []
      });
    }

    const response = await axios.get(
      `${BASE_URL}/live/api/v1/nepselive/market-depth/${stockInfo.securityId}`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching market depth:', error.message);
    return NextResponse.json({
      buyOrders: [],
      sellOrders: []
    });
  }
}
