/* =============================================================================
UTILITY: Logger

PURPOSE
-------
Standardized ASCII logging across the Playwright framework.

============================================================================= */

export class Logger {

  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  static success(message: string) {
    console.log(`[PASS] ${message}`);
  }

  static warning(message: string) {
    console.log(`[WARN] ${message}`);
  }

  static step(message: string) {
    console.log(`[STEP] ${message}`);
  }

  static celebration(message: string) {
    console.log(`[DONE] ${message}`);
  }

  static url(url: string) {
    console.log(`[URL] ${url}`);
  }

  static section(title: string) {
    console.log('\n========================================');
    console.log(title);
    console.log('========================================\n');
  }
}
