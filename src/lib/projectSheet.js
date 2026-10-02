// ===================================================================
// "All Projects" sheet
//
// One place decides the columns, so the table on screen, the Excel file, the CSV and the "copy for
// Google Sheets" text always carry the same data in the same order.
//
// No spreadsheet library on purpose: an .xlsx is only a zip of a few XML files, so it is written here by hand
// (nothing extra to install, nothing extra to trust).
// ===================================================================

const pad = (n) => String(n).padStart(2, '0');

const validDate = (d) => {
    if (!d) return null;
    const x = new Date(d);
    return Number.isNaN(x.getTime()) ? null : x;
};

// 2026-01-05 (local date — the same day the table shows)
export const isoDay = (d) => {
    const x = validDate(d);
    return x ? `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}` : '';
};

export const shortDate = (d) => {
    const x = validDate(d);
    return x ? x.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
};

const num = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

// "example.com" → "https://example.com"
export const toUrl = (v) => {
    const t = String(v || '').trim();
    if (!t) return '';
    return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

// ---------------------------------------------------------------
// Rows
// ---------------------------------------------------------------
const kindOf = (d) => d.type || 'both';
const isDomainRec = (d) => kindOf(d) === 'domain' || kindOf(d) === 'both';
const isHostingRec = (d) => kindOf(d) === 'hosting' || kindOf(d) === 'both';

// One project (from GET /project-tracker/admin/projects) → the flat record the sheet works with.
export const buildSheetRow = (p) => {
    const linked = p.linkedDomains || [];
    const domains = linked.filter(isDomainRec);
    const hostings = linked.filter(isHostingRec);

    const domainNames = domains.map((d) => d.domainName).filter(Boolean);
    const hostingText = hostings
        .map((d) =>
            [
                d.hostingGB ? `${d.hostingGB} GB hosting` : 'Hosting',
                d.provider ? `(${d.provider})` : '',
                // a hosting-only record is named after the site it hosts
                kindOf(d) === 'hosting' && d.domainName ? `– ${d.domainName}` : '',
            ]
                .filter(Boolean)
                .join(' ')
        )
        .join(', ');

    // the live site: what was typed in, otherwise the first domain we registered for the project
    const siteText = (p.websiteUrl || '').trim() || domainNames[0] || '';

    const byUs =
        domains.length && hostings.length ? 'Domain + Hosting' : domains.length ? 'Domain' : hostings.length ? 'Hosting' : 'No';

    const installments = [...(p.installments || [])]
        .map((i) => ({ no: i.no, amount: Number(i.amount) || 0, date: i.date || null, note: i.note || '', paid: i.paid !== false }))
        .sort((a, b) => (a.date ? new Date(a.date).getTime() : Infinity) - (b.date ? new Date(b.date).getTime() : Infinity) || a.no - b.no);

    const priceChanges = (p.priceHistory || []).map((c) => ({
        from: Number(c.from) || 0,
        to: Number(c.to) || 0,
        at: c.at || null,
        note: c.note || '',
    }));

    return {
        id: p._id,
        raw: p,
        date: p.orderDate || null,
        code: p.projectId || '',
        name: p.desiredWebsiteName || p.websiteType || '',
        type: p.websiteType || '',
        owner: p.clientName || '',
        phone: p.phone || '',
        company: p.companyBrand || '',
        siteText,
        siteUrl: toUrl(siteText),
        domainText: domainNames.join(', '),
        hostingText,
        byUs,
        price: Number(p.totalProjectAmount) || 0,
        paid: Number(p.totalPaid) || 0,
        due: Number(p.totalDue) || 0,
        domainSellIncluded: Number(p.domainSellIncluded) || 0,
        installments,
        priceChanges,
        submittedBy: p.submittedBy || '',
        employee: p.assignedEmployee || '',
        submitDate: p.projectDeliveryDate || null,
        status: p.status || '',
    };
};

export const buildSheetRows = (projects) => (projects || []).map(buildSheetRow);

// The "price history" as plain text (used in the Excel cell, the CSV and the Google-Sheets copy):
// first every change of the price, then every payment (paid / planned / refund), oldest first.
export const historyText = (r, sep = '\n') => {
    const lines = [];
    r.priceChanges.forEach((c) => {
        lines.push(
            `${shortDate(c.at) || "—"} · ${c.from > 0 ? `price ৳${num(c.from)} → ৳${num(c.to)}` : `price set ৳${num(c.to)}`}${c.note && c.from > 0 ? ` (${c.note})` : ""}`
        );
    });
    r.installments.forEach((i) => {
        const what = !i.paid ? "planned" : i.amount < 0 ? "refund" : "paid";
        lines.push(`${shortDate(i.date) || "no date"} · ${what} ৳${num(Math.abs(i.amount))}${i.note ? ` (${i.note})` : ""}`);
    });
    return lines.join(sep);
};

// ---------------------------------------------------------------
// Columns — the order is the order of the sheet
// type: text | int | money | date | link | wrap
// ---------------------------------------------------------------
export const SHEET_COLUMNS = [
    { key: 'sl', label: '#', width: 6, type: 'int', center: true, get: (r, i) => i + 1 },
    { key: 'date', label: 'Project Date', width: 14, type: 'date', get: (r) => r.date },
    { key: 'code', label: 'Project Code', width: 15, type: 'text', get: (r) => r.code },
    { key: 'name', label: 'Project Name', width: 28, type: 'text', get: (r) => r.name },
    { key: 'owner', label: 'Owner Name', width: 22, type: 'text', get: (r) => r.owner },
    { key: 'phone', label: 'Owner Phone', width: 16, type: 'text', phone: true, get: (r) => r.phone },
    { key: 'company', label: 'Company', width: 22, type: 'text', get: (r) => r.company },
    { key: 'site', label: 'Website Link', width: 30, type: 'link', get: (r) => r.siteUrl },
    { key: 'domain', label: 'Domain', width: 24, type: 'text', get: (r) => r.domainText },
    { key: 'hosting', label: 'Hosting', width: 26, type: 'text', get: (r) => r.hostingText },
    { key: 'byUs', label: 'Domain & Hosting by us?', width: 22, type: 'text', get: (r) => r.byUs },
    { key: 'price', label: 'Price (৳)', width: 13, type: 'money', total: true, get: (r) => r.price },
    { key: 'paid', label: 'Paid (৳)', width: 13, type: 'money', total: true, get: (r) => r.paid },
    { key: 'due', label: 'Due (৳)', width: 13, type: 'money', total: true, get: (r) => r.due },
    { key: 'history', label: 'Price History', width: 48, type: 'wrap', get: (r) => historyText(r, '\n') },
    { key: 'submittedBy', label: 'Submitted By', width: 20, type: 'text', get: (r) => r.submittedBy },
    { key: 'employee', label: 'Employee (under)', width: 20, type: 'text', get: (r) => r.employee },
    { key: 'submitDate', label: 'Submit Date', width: 14, type: 'date', get: (r) => r.submitDate },
    { key: 'status', label: 'Status', width: 12, type: 'text', center: true, get: (r) => r.status },
];

// ---------------------------------------------------------------
// CSV / "copy for Google Sheets"
// ---------------------------------------------------------------
// A text that starts with = + - @ would be run as a formula by Excel / Sheets — client-typed names must never be.
const defuse = (s) => (/^[=+\-@\t\r]/.test(s) ? `'${s}` : s);

const plainValue = (col, r, i, mode) => {
    const v = col.get(r, i);
    if (v === null || v === undefined || v === '') return '';
    if (col.type === 'date') return isoDay(v);
    if (col.type === 'int' || col.type === 'money') return String(Number(v) || 0);
    if (col.type === 'wrap') return mode === 'tsv' ? String(v).replace(/\n/g, ' | ') : String(v);
    const s = String(v);
    if (col.phone) {
        // keep the leading zero: Excel / Sheets would otherwise turn 0171… into the number 171…
        return mode === 'csv' ? `="${s.replace(/"/g, '""')}"` : `'${s}`;
    }
    return col.type === 'link' ? s : defuse(s);
};

const csvCell = (v) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

// UTF-8 with a BOM, so Excel shows Bengali text correctly
export const toCSV = (rows) => {
    const head = SHEET_COLUMNS.map((c) => csvCell(c.label)).join(',');
    const body = rows.map((r, i) => SHEET_COLUMNS.map((c) => csvCell(plainValue(c, r, i, 'csv'))).join(','));
    return '﻿' + [head, ...body].join('\r\n');
};

// Tab-separated, ready to paste straight into a Google Sheet
export const toTSV = (rows) => {
    const clean = (s) => s.replace(/[\t\r\n]+/g, ' ');
    const head = SHEET_COLUMNS.map((c) => clean(c.label)).join('\t');
    const body = rows.map((r, i) => SHEET_COLUMNS.map((c) => clean(plainValue(c, r, i, 'tsv'))).join('\t'));
    return [head, ...body].join('\n');
};

// ---------------------------------------------------------------
// .xlsx (hand-written)
// ---------------------------------------------------------------
const enc = new TextEncoder();

const crcTable = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return t;
})();

const crc32 = (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
};

const concat = (parts) => {
    const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
    let o = 0;
    parts.forEach((p) => {
        out.set(p, o);
        o += p.length;
    });
    return out;
};

// A zip with no compression ("store"): enough for an .xlsx, and simple enough to be certain about.
export const zipStore = (files) => {
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

    const chunks = [];
    const central = [];
    let offset = 0;

    files.forEach((f) => {
        const name = enc.encode(f.name);
        const data = typeof f.data === 'string' ? enc.encode(f.data) : f.data;
        const crc = crc32(data);

        const lh = new DataView(new ArrayBuffer(30));
        lh.setUint32(0, 0x04034b50, true);
        lh.setUint16(4, 20, true); // version needed
        lh.setUint16(6, 0x0800, true); // names are UTF-8
        lh.setUint16(8, 0, true); // method: store
        lh.setUint16(10, dosTime, true);
        lh.setUint16(12, dosDate, true);
        lh.setUint32(14, crc, true);
        lh.setUint32(18, data.length, true);
        lh.setUint32(22, data.length, true);
        lh.setUint16(26, name.length, true);
        lh.setUint16(28, 0, true);
        chunks.push(new Uint8Array(lh.buffer), name, data);

        const ch = new DataView(new ArrayBuffer(46));
        ch.setUint32(0, 0x02014b50, true);
        ch.setUint16(4, 20, true);
        ch.setUint16(6, 20, true);
        ch.setUint16(8, 0x0800, true);
        ch.setUint16(10, 0, true);
        ch.setUint16(12, dosTime, true);
        ch.setUint16(14, dosDate, true);
        ch.setUint32(16, crc, true);
        ch.setUint32(20, data.length, true);
        ch.setUint32(24, data.length, true);
        ch.setUint16(28, name.length, true);
        ch.setUint32(42, offset, true);
        central.push(new Uint8Array(ch.buffer), name);

        offset += 30 + name.length + data.length;
    });

    const centralSize = central.reduce((s, c) => s + c.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);

    return concat([...chunks, ...central, new Uint8Array(end.buffer)]);
};

// XML text: drop the characters XML cannot carry, escape the rest
const esc = (v) =>
    String(v)
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

const colLetter = (i) => {
    let s = '';
    let n = i + 1;
    while (n > 0) {
        const m = (n - 1) % 26;
        s = String.fromCharCode(65 + m) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
};

// Excel stores a date as the number of days since 1899-12-30
const excelSerial = (d) => {
    const x = validDate(d);
    if (!x) return null;
    return Math.round((Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()) - Date.UTC(1899, 11, 30)) / 86400000);
};

// cell styles (indexes into cellXfs below)
const S = { base: 0, header: 1, date: 2, money: 3, wrap: 4, link: 5, center: 6, totalText: 7, totalMoney: 8 };

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="2"><numFmt numFmtId="164" formatCode="dd\\-mmm\\-yyyy"/><numFmt numFmtId="165" formatCode="#,##0"/></numFmts>
<fonts count="4">
<font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><u/><sz val="11"/><color rgb="FF0563C1"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="4">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF3E0"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FFD1D5DB"/></left><right style="thin"><color rgb="FFD1D5DB"/></right><top style="thin"><color rgb="FFD1D5DB"/></top><bottom style="thin"><color rgb="FFD1D5DB"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="9">
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="top"/></xf>
<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf>
<xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="165" fontId="3" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

const textCell = (ref, value, style) =>
    `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`;

const bodyCell = (ref, col, value) => {
    const empty = value === null || value === undefined || value === '';
    const textStyle = col.type === 'wrap' ? S.wrap : col.center ? S.center : S.base;

    if (empty) return `<c r="${ref}" s="${textStyle}"/>`;

    if (col.type === 'int' || col.type === 'money') {
        const n = Number(value);
        return Number.isFinite(n)
            ? `<c r="${ref}" s="${col.type === 'money' ? S.money : textStyle}"><v>${n}</v></c>`
            : textCell(ref, value, textStyle);
    }
    if (col.type === 'date') {
        const serial = excelSerial(value);
        return serial === null ? `<c r="${ref}" s="${S.base}"/>` : `<c r="${ref}" s="${S.date}"><v>${serial}</v></c>`;
    }
    if (col.type === 'link') {
        const url = String(value);
        // HYPERLINK() takes at most 255 characters — anything longer stays plain text
        if (url.length <= 250) {
            return `<c r="${ref}" s="${S.link}" t="str"><f>HYPERLINK("${esc(url.replace(/"/g, '""'))}","${esc(url.replace(/"/g, '""'))}")</f><v>${esc(url)}</v></c>`;
        }
        return textCell(ref, url, S.base);
    }
    return textCell(ref, value, textStyle);
};

export const buildXLSX = (rows, sheetName = 'All Projects') => {
    const cols = SHEET_COLUMNS;
    const lastCol = colLetter(cols.length - 1);
    const lastDataRow = rows.length + 1; // header is row 1

    // header
    let sheetRows = `<row r="1" ht="32" customHeight="1">${cols.map((c, ci) => textCell(`${colLetter(ci)}1`, c.label, S.header)).join('')}</row>`;

    // data
    rows.forEach((r, ri) => {
        const rn = ri + 2;
        sheetRows += `<row r="${rn}">${cols.map((c, ci) => bodyCell(`${colLetter(ci)}${rn}`, c, c.get(r, ri))).join('')}</row>`;
    });

    // totals
    if (rows.length) {
        const tn = lastDataRow + 1;
        const cells = cols
            .map((c, ci) => {
                const ref = `${colLetter(ci)}${tn}`;
                if (c.total) {
                    const sum = rows.reduce((s, r, ri) => s + (Number(c.get(r, ri)) || 0), 0);
                    return `<c r="${ref}" s="${S.totalMoney}"><f>SUM(${colLetter(ci)}2:${colLetter(ci)}${lastDataRow})</f><v>${sum}</v></c>`;
                }
                if (ci === 0) return textCell(ref, '', S.totalText);
                if (c.key === 'name') return textCell(ref, `Total · ${rows.length} projects`, S.totalText);
                return `<c r="${ref}" s="${S.totalText}"/>`;
            })
            .join('');
        sheetRows += `<row r="${tn}">${cells}</row>`;
    }

    const lastRow = rows.length ? lastDataRow + 1 : 1;
    const colsXml = cols.map((c, ci) => `<col min="${ci + 1}" max="${ci + 1}" width="${c.width}" customWidth="1"/>`).join('');

    const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="A1:${lastCol}${lastRow}"/>
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>${colsXml}</cols>
<sheetData>${sheetRows}</sheetData>
<autoFilter ref="A1:${lastCol}${lastDataRow}"/>
</worksheet>`;

    const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="28800" windowHeight="15000"/></bookViews>
<sheets><sheet name="${esc(sheetName)}" sheetId="1" r:id="rId1"/></sheets>
<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'${esc(sheetName)}'!$A$1:$${lastCol}$${lastDataRow}</definedName></definedNames>
</workbook>`;

    return zipStore([
        {
            name: '[Content_Types].xml',
            data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
        },
        {
            name: '_rels/.rels',
            data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
        },
        { name: 'xl/workbook.xml', data: workbook },
        {
            name: 'xl/_rels/workbook.xml.rels',
            data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
        },
        { name: 'xl/styles.xml', data: STYLES_XML },
        { name: 'xl/worksheets/sheet1.xml', data: sheet },
    ]);
};

// ---------------------------------------------------------------
// Download / copy (browser)
// ---------------------------------------------------------------
export const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
};

export const downloadXLSX = (rows, filename) =>
    downloadBlob(
        new Blob([buildXLSX(rows)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        filename
    );

export const downloadCSV = (rows, filename) =>
    downloadBlob(new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8' }), filename);

export const copyForSheets = async (rows) => {
    const text = toTSV(rows);
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    // older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
};
