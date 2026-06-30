const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const projectRoot = path.resolve(__dirname, '..');
const reportPath = path.join(projectRoot, 'execution-report', 'index.html');
const pdfPath = path.join(projectRoot, 'execution-report', 'AIR_Report.pdf');

function toFileUrl(filePath) {
  return `file:///${filePath.replace(/\\/g, '/')}`;
}

async function exportPdf() {
  if (!fs.existsSync(reportPath)) {
    throw new Error(
      `Execution report not found at ${reportPath}. Run npm run report:execution first.`
    );
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: {
      width: 1600,
      height: 1200,
    },
  });

  await page.goto(toFileUrl(reportPath), {
    waitUntil: 'networkidle',
  });

  // Keep the approved dashboard screen styling in the exported PDF.
  await page.emulateMedia({
    media: 'screen',
  });

  await page.addStyleTag({
    content: `
      .btn,
      .actions {
        display: none !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `,
  });

  await page.pdf({
    path: pdfPath,
    format: 'A3',
    landscape: true,
    margin: {
      top: '8mm',
      right: '8mm',
      bottom: '8mm',
      left: '8mm',
    },
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  console.log(`Execution PDF created: ${pdfPath}`);
}

exportPdf().catch(async error => {
  console.error(error.message);
  process.exitCode = 1;
});
