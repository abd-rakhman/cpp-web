import { ICodeforcesProblem } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export class CodeforcesService {
  static async getProblem(contestId: number, problemId: string) {
    const response = await fetch(BACKEND_URL + `/codeforces/${contestId}/${problemId}`);
    const data = await response.json();
    if(data.error) {
      throw new Error(data.error);
    }
    return data as ICodeforcesProblem;
  }
}