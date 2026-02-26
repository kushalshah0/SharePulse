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
    const response = await axios.get(
      `${BASE_URL}/live/api/v2/nepselive/live-nepse`,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data.data;
    
    const stockData = Array.isArray(data) 
      ? data.find((s) => s.symbol?.toUpperCase() === symbol.toUpperCase())
      : data?.allStocks?.find((s) => s.symbol?.toUpperCase() === symbol.toUpperCase());
    
    if (!stockData) {
      return NextResponse.json({
        success: true,
        data: {
          symbol: symbol,
          securityName: symbol,
          lastTradedPrice: 0,
          change: 0,
          percentageChange: 0,
          highPrice: 0,
          lowPrice: 0,
          totalTradeQuantity: 0,
          totalTransactions: 0,
          sector: 'N/A'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: stockData
    });
  } catch (error) {
    console.error('Error fetching company overview:', error.message);
    return NextResponse.json({
      success: true,
      data: {
        symbol: symbol,
        securityName: symbol,
        lastTradedPrice: 0,
        change: 0,
        percentageChange: 0,
        highPrice: 0,
        lowPrice: 0,
        totalTradeQuantity: 0,
        totalTransactions: 0,
        sector: 'N/A'
      }
    });
  }
}
