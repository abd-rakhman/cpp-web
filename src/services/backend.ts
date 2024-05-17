const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export interface IExecutionOutput {
  stdout: string[];
}

export interface ISubmission {
  code: string;
  stdin: string[];
}

export class BackendService {
  static async executeCode(submission: ISubmission): Promise<string[]> {
    const response = await fetch(`${BACKEND_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    const data = await response.json() as IExecutionOutput;
    return data.stdout;
  }
}