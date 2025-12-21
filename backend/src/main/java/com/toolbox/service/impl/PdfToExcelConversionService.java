package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class PdfToExcelConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        return "pdf".equalsIgnoreCase(sourceFormat) && ("xlsx".equalsIgnoreCase(targetFormat) || "xls".equalsIgnoreCase(targetFormat));
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        try (PDDocument pdfDocument = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(pdfDocument);

            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Converted PDF");
                
                String[] lines = text.split("\\r?\\n");
                int rowNum = 0;
                for (String line : lines) {
                    Row row = sheet.createRow(rowNum++);
                    // Attempt to split by spaces or tabs to simulate columns, or just put in one cell
                    // Simple approach: one cell per line, or simple space splitting
                    String[] parts = line.split("\\s{2,}"); // Split by 2 or more spaces
                    int colNum = 0;
                    for (String part : parts) {
                        Cell cell = row.createCell(colNum++);
                        cell.setCellValue(part);
                    }
                }

                File outputFile = File.createTempFile("converted-", "." + targetFormat);
                try (FileOutputStream out = new FileOutputStream(outputFile)) {
                    workbook.write(out);
                }
                return outputFile;
            }
        }
    }
}
