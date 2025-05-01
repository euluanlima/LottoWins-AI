import { NextResponse } from 'next/server';
import axios from 'axios';

// IMPORTANT: Store the token securely, e.g., in environment variables.
// Hardcoding it here for demonstration purposes ONLY.
const API_TOKEN = "5ab8a9e25ba161df605bdb47ae042afadbc444a577983688998cdebf20b8dbdc";
const EXTERNAL_API_URL = 'https://api.lotteryresultsapi.com/alpha';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params } // Let TypeScript infer the type for params
) {
  const lotteryTag = params.lotteryTag;

  if (!lotteryTag) {
    return NextResponse.json({ error: 'Lottery tag is required' }, { status: 400 });
  }

  const endpoint = `/lottery/${lotteryTag}/draw/numbers?limit=10`; // Fetch last 10 draws

  try {
    console.log(`Fetching data from: ${EXTERNAL_API_URL}${endpoint}`);
    const response = await axios.get(`${EXTERNAL_API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout
    });

    console.log('API Response Status:', response.status);

    if (response.data && Array.isArray(response.data.draw)) {
        const transformedResults = response.data.draw.map((draw: any) => {
            const numbersString = draw.numbers;
            let winningNumbers: string[] = [];
            let specialBall: string | undefined = undefined;
            let specialBallKey: string | undefined = undefined;

            const match = numbersString.match(/^(.*)\s\((\d+)\)$/);
            if (match) {
                winningNumbers = match[1].split(' ').filter((n: string) => n !== '');
                specialBall = match[2];
            } else {
                winningNumbers = numbersString.split(' ').filter((n: string) => n !== '');
            }

            if (lotteryTag === 'powerball') specialBallKey = 'powerball';
            else if (lotteryTag === 'mega-millions') specialBallKey = 'megaBall';
            else if (lotteryTag === 'cash4life') specialBallKey = 'cashBall';

            const result: any = {
                drawDate: draw.date,
                winningNumbers: winningNumbers,
            };

            if (specialBallKey && specialBall) {
                result[specialBallKey] = specialBall;
            }

            return result;
        });

      return NextResponse.json(transformedResults);
    } else {
        console.error('Unexpected API response structure:', response.data);
        return NextResponse.json({ error: 'Unexpected API response structure' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error fetching from external API:', error.response?.status, error.response?.data, error.message);
    let status = 500;
    let message = 'Failed to fetch lottery results';
    if (axios.isAxiosError(error)) {
        if (error.response) {
            status = error.response.status;
            message = error.response.data?.message || error.response.data?.error || message;
            if (status === 401) message = 'Authentication failed. Check API Token.';
            if (status === 404) message = `Lottery data not found for tag: ${lotteryTag}`;
        } else if (error.request) {
            message = 'No response received from external API';
        }
    }
    return NextResponse.json({ error: message }, { status });
  }
}

