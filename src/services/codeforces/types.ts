export interface ICodeforcesProblem {
  name: string;
  header: ICodeforcesProblemHeader;
  statement: string;
  inputSpecification: string;
  outputSpecification: string;
  sampleTests: ICodeforcesProblemSample[];
  notes: string;
}

export interface ICodeforcesProblemHeader {
  title: string;
  timeLimit: string;
  memoryLimit: string;
}

export interface ICodeforcesProblemSample {
  input: string;
  output: string;
}