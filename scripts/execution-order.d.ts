export const executableJourneyOrder: string[];
export const matrixOrder: string[];
export const playwrightTestMatch: string[];
export const suites: Record<string, string[]>;
export const executableBatches: Array<{
  name: string;
  files: string[];
}>;
export const allBatches: Array<{
  name: string;
  files: string[];
}>;
export function testPaths(files: string[]): string[];
export function journeyProjectName(index: number): string;
export function assertAllSpecsAreListed(): void;
export function printOrder(files?: string[]): void;
