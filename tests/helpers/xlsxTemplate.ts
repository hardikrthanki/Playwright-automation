import * as zlib from 'zlib';

/* =============================================================================
HELPER: xlsxTemplate

PURPOSE
-------
The Bulk Upload dialog hands out positions-template-v2.xlsx. These helpers read
that file and build a new one-row workbook from it, so a test can upload a file
that really comes from the template. No extra npm package is needed: an xlsx
file is a zip of XML files, so this reads the zip and writes it again.
============================================================================= */

type ZipEntries = Map<string, Buffer>;

const CRC_TABLE = (() => {
  const table: number[] = [];

  for (let n = 0; n < 256; n++) {
    let c = n;

    for (let k = 0; k < 8; k++) {
      c = c & 1
        ? 0xedb88320 ^ (c >>> 1)
        : c >>> 1;
    }

    table.push(c >>> 0);
  }

  return table;
})();

function crc32(
  data: Buffer
): number {
  let c = 0xffffffff;

  for (const byte of data) {
    c = CRC_TABLE[
      (c ^ byte) & 0xff
    ] ^ (c >>> 8);
  }

  return (c ^ 0xffffffff) >>> 0;
}

export function readZip(
  file: Buffer
): ZipEntries {
  const entries: ZipEntries = new Map();

  let eocd = -1;

  for (
    let i = file.length - 22;
    i >= 0;
    i--
  ) {
    if (
      file.readUInt32LE(i) === 0x06054b50
    ) {
      eocd = i;
      break;
    }
  }

  if (eocd < 0) {
    throw new Error(
      'Not a zip/xlsx file: end of central directory not found'
    );
  }

  const count =
    file.readUInt16LE(eocd + 10);

  let pos =
    file.readUInt32LE(eocd + 16);

  for (let n = 0; n < count; n++) {
    if (
      file.readUInt32LE(pos) !== 0x02014b50
    ) {
      throw new Error(
        'Bad zip central directory'
      );
    }

    const method =
      file.readUInt16LE(pos + 10);

    const compressedSize =
      file.readUInt32LE(pos + 20);

    const nameLength =
      file.readUInt16LE(pos + 28);

    const extraLength =
      file.readUInt16LE(pos + 30);

    const commentLength =
      file.readUInt16LE(pos + 32);

    const localOffset =
      file.readUInt32LE(pos + 42);

    const name =
      file.toString(
        'utf8',
        pos + 46,
        pos + 46 + nameLength
      );

    const localNameLength =
      file.readUInt16LE(localOffset + 26);

    const localExtraLength =
      file.readUInt16LE(localOffset + 28);

    const dataStart =
      localOffset
      + 30
      + localNameLength
      + localExtraLength;

    const raw =
      file.subarray(
        dataStart,
        dataStart + compressedSize
      );

    entries.set(
      name,
      method === 8
        ? zlib.inflateRawSync(raw)
        : Buffer.from(raw)
    );

    pos +=
      46
      + nameLength
      + extraLength
      + commentLength;
  }

  return entries;
}

export function writeZip(
  entries: ZipEntries
): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];

  let offset = 0;

  for (const [name, data] of entries) {
    const nameBuffer =
      Buffer.from(name, 'utf8');

    const crc = crc32(data);

    const local = Buffer.alloc(30);

    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0x21, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    local.writeUInt16LE(0, 28);

    const central = Buffer.alloc(46);

    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x21, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuffer.length, 28);
    central.writeUInt32LE(offset, 42);

    locals.push(
      local,
      nameBuffer,
      data
    );

    centrals.push(
      central,
      nameBuffer
    );

    offset +=
      30 + nameBuffer.length + data.length;
  }

  const centralBuffer =
    Buffer.concat(centrals);

  const end = Buffer.alloc(22);

  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.size, 8);
  end.writeUInt16LE(entries.size, 10);
  end.writeUInt32LE(centralBuffer.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([
    ...locals,
    centralBuffer,
    end
  ]);
}

function sharedStrings(
  entries: ZipEntries
): string[] {
  const xml =
    entries.get('xl/sharedStrings.xml')
      ?.toString('utf8')
    ?? '';

  return [
    ...xml.matchAll(
      /<si>([\s\S]*?)<\/si>/g
    )
  ].map(
    (match) =>
      match[1].replace(/<[^>]+>/g, '')
  );
}

function cellValue(
  cell: string,
  strings: string[]
): string {
  const value =
    cell.match(
      /<v>([\s\S]*?)<\/v>/
    )?.[1] ?? '';

  return / t="s"/.test(cell)
    ? strings[Number(value)] ?? ''
    : value;
}

export interface TemplateSummary {
  sheetNames: string[];
  headers: string[];
  sampleRows: string[][];
  currencies: string[];
}

export function summariseTemplate(
  file: Buffer
): TemplateSummary {
  const entries = readZip(file);
  const strings = sharedStrings(entries);

  const workbook =
    entries.get('xl/workbook.xml')
      ?.toString('utf8')
    ?? '';

  const sheetNames = [
    ...workbook.matchAll(
      /<sheet [^>]*name="([^"]+)"/g
    )
  ].map(
    (match) => match[1]
  );

  const rowsOf = (
    sheetFile: string
  ): string[][] => {
    const xml =
      entries.get(sheetFile)
        ?.toString('utf8')
      ?? '';

    return [
      ...xml.matchAll(
        /<row [^>]*>([\s\S]*?)<\/row>/g
      )
    ].map(
      (row) =>
        [
          ...row[1].matchAll(
            /<c [^>]*?(?:\/>|>[\s\S]*?<\/c>)/g
          )
        ].map(
          (cell) =>
            cellValue(
              cell[0],
              strings
            )
        )
    );
  };

  const positions =
    rowsOf('xl/worksheets/sheet1.xml');

  const currency =
    rowsOf('xl/worksheets/sheet2.xml');

  return {
    sheetNames,
    headers:
      positions[0] ?? [],
    sampleRows:
      positions
        .slice(1)
        .filter(
          (row) =>
            row.some(
              (value) =>
                value !== ''
            )
        ),
    currencies:
      currency
        .slice(1)
        .map(
          (row) => row[0]
        )
        .filter(Boolean)
  };
}

export interface OneRowPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

/**
 * Takes the downloaded template and returns the same workbook with the sample
 * rows replaced by one equity row. Every other part of the file is untouched.
 */
export function buildOneEquityRowWorkbook(
  template: Buffer,
  row: OneRowPosition
): Buffer {
  const entries = readZip(template);

  const sheetName =
    'xl/worksheets/sheet1.xml';

  let xml =
    entries.get(sheetName)
      ?.toString('utf8');

  if (!xml) {
    throw new Error(
      'Template has no Positions sheet'
    );
  }

  const amount =
    row.quantity * row.avgPrice;

  const rowStart = (
    n: number
  ) =>
    `<row r="${n}" spans="1:6" x14ac:dyDescent="0.25">`;

  const rowPattern = (
    n: number
  ) =>
    new RegExp(
      `<row r="${n}"[^>]*>[\\s\\S]*?</row>`
    );

  const blank = (
    n: number
  ) =>
    `${rowStart(n)}<c r="A${n}" s="2"/><c r="B${n}" s="2"/><c r="C${n}" s="2"/><c r="D${n}" s="2"/><c r="E${n}" s="3" t="str"><f t="shared" si="0"/><v/></c><c r="F${n}" s="2"/></row>`;

  const equityRow =
    `${rowStart(2)}`
    + '<c r="A2" s="2" t="inlineStr"><is><t>equity</t></is></c>'
    + `<c r="B2" s="2" t="inlineStr"><is><t>${row.symbol}</t></is></c>`
    + `<c r="C2" s="2"><v>${row.quantity}</v></c>`
    + `<c r="D2" s="2"><v>${row.avgPrice}</v></c>`
    + `<c r="E2" s="3"><f t="shared" ref="E2:E33" si="0">IF(A2="option",C2*D2*100,IF(OR(A2="equity",A2="cash"),C2*D2,""))</f><v>${amount}</v></c>`
    + '<c r="F2" s="2" t="inlineStr"><is><t>USD</t></is></c>'
    + '</row>';

  xml =
    xml
      .replace(rowPattern(2), equityRow)
      .replace(rowPattern(3), blank(3))
      .replace(rowPattern(4), blank(4));

  entries.set(
    sheetName,
    Buffer.from(xml, 'utf8')
  );

  return writeZip(entries);
}
