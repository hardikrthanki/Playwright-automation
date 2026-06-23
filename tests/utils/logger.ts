/* =============================================================================
UTILITY: Logger

PURPOSE
-------
Standardized logging across Playwright framework.

============================================================================= */

export class Logger {

  static info(message: string) {
    console.log(`ℹ️ ${message}`);
  }

  static success(message: string) {
    console.log(`✅ ${message}`);
  }

  static warning(message: string) {
    console.log(`⚠️ ${message}`);
  }

  static step(message: string) {
    console.log(`👉 ${message}`);
  }

  static celebration(message: string) {
    console.log(`🎉 ${message}`);
  }

  static url(url: string) {
    console.log(`🌐 ${url}`);
  }

  static section(title: string) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(title);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}