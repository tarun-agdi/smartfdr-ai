SmartFDR AI — Working Prototype

This is a browser-based demonstration prototype for SIH26265. It is not an official AICTE website and is not affiliated with AICTE. All included institution and bank records are synthetic.

HOW TO RUN
1. Extract the ZIP file to a folder.
2. Open index.html in a modern browser (Chrome or Edge recommended).
3. For OCR of image/PDF files, an internet connection is required to load Tesseract.js and PDF.js from their public CDNs. If OCR libraries cannot load, you can paste extracted document text into the editable text area and run rule checks.
4. Most records and workflow changes persist in that browser using localStorage. Use Reports & Audit Logs > Reset to original demo data to restart.

WORKING FEATURES
- Overview dashboard with live counters
- Synthetic FDR registry, search and filters
- Register new FDR records with field validation
- Upload image/PDF/TXT evidence; browser OCR for images and scanned PDF first page when libraries are available; text extraction for text PDFs/TXT
- Rule-based comparison for reference, amount, date order and duplicate references
- Case workflow status updates with reasons for correction, hold and rejection
- Role switching for demonstration (not production authentication)
- Maturity alerts, in-app notifications, reports and CSV export
- Audit history

LIMITATIONS / SAFETY
- No backend server; data is stored locally in your browser and does not sync between devices.
- Demo role selection is not a secure authentication implementation.
- OCR and text matching cannot verify FDR authenticity. No bank API, AICTE system or real financial service is connected.
- All approvals and release decisions are simulated.
- Before production use, build a secured backend, server-side role authorization, encrypted file storage, official integrations, security review, retention and backup policies.
