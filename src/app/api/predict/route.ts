import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const numCombinations = searchParams.get('num') || '10';

  if (!/^[1-9]\d*$/.test(numCombinations)) {
    return NextResponse.json({ error: 'Invalid number of combinations requested.' }, { status: 400 });
  }

  // Use absolute path within the container for the script
  const scriptPath = path.resolve("/home/ubuntu/lotto-cash-app-v10", "lottery_predictor.py");
  const pythonExecutable = 'python3'; // Use the python3 command available in the environment

  try {
    console.log(`Executing prediction script: ${pythonExecutable} ${scriptPath} ${numCombinations}`);
    // Increased timeout to handle potentially longer script execution
    const { stdout, stderr } = await execFileAsync(pythonExecutable, [scriptPath, numCombinations], { timeout: 15000 }); // 15 seconds timeout

    if (stderr) {
      console.error(`Python Script Error: ${stderr}`);
      // Don't immediately fail, check stdout as warnings might go to stderr
    }

    console.log(`Python Script Output: ${stdout}`);

    try {
      const predictions = JSON.parse(stdout);
      return NextResponse.json(predictions);
    } catch (parseError) {
      console.error(`JSON Parsing Error: ${parseError}`);
      console.error(`Raw stdout from Python script: ${stdout}`);
      return NextResponse.json({ error: 'Failed to parse prediction data from script.', details: stdout }, { status: 500 });
    }

  } catch (error) {
    console.error(`Script Execution Error: ${error}`);
    // Provide more detailed error information if possible
    const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
    // Check for timeout error
    if (error.killed && error.signal === null) { // Check if timeout occurred
         return NextResponse.json({ error: 'Prediction script timed out.', details: errorMessage }, { status: 504 }); // Gateway Timeout
    }
    return NextResponse.json({ error: 'Failed to execute prediction script.', details: errorMessage }, { status: 500 });
  }
}

