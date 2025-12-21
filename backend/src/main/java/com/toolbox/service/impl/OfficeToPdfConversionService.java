package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFPicture;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class OfficeToPdfConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        return "pdf".equalsIgnoreCase(targetFormat) && 
               ("docx".equalsIgnoreCase(sourceFormat) || 
                "xlsx".equalsIgnoreCase(sourceFormat) || 
                "pptx".equalsIgnoreCase(sourceFormat));
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        String sourceFormat = getFileExtension(file.getOriginalFilename());
        
        if ("pptx".equalsIgnoreCase(sourceFormat)) {
             return convertPptxToPdf(file);
        } else if ("docx".equalsIgnoreCase(sourceFormat)) {
             return convertDocxToPdf(file);
        }

        // Fallback or other formats (xlsx simple text)
        List<String> extractedText = new ArrayList<>();
        if ("xlsx".equalsIgnoreCase(sourceFormat)) {
            try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                for (Sheet sheet : workbook) {
                    extractedText.add("Sheet: " + sheet.getSheetName());
                    for (Row row : sheet) {
                        StringBuilder sb = new StringBuilder();
                        for (Cell cell : row) {
                            sb.append(cell.toString()).append("  ");
                        }
                        extractedText.add(sb.toString());
                    }
                    extractedText.add(""); 
                }
            }
        }

        return createPdfFromText(extractedText);
    }

    private File convertPptxToPdf(MultipartFile file) throws IOException {
        try (XMLSlideShow ppt = new XMLSlideShow(file.getInputStream());
             PDDocument pdfDocument = new PDDocument()) {
            
            Dimension pgsize = ppt.getPageSize();
            
            for (XSLFSlide slide : ppt.getSlides()) {
                PDPage page = new PDPage(new PDRectangle((float)pgsize.getWidth(), (float)pgsize.getHeight()));
                pdfDocument.addPage(page);
                
                BufferedImage img = new BufferedImage((int)pgsize.getWidth(), (int)pgsize.getHeight(), BufferedImage.TYPE_INT_RGB);
                Graphics2D graphics = img.createGraphics();
                graphics.setPaint(Color.white);
                graphics.fill(new Rectangle2D.Float(0, 0, (float)pgsize.getWidth(), (float)pgsize.getHeight()));
                slide.draw(graphics);
                graphics.dispose();
                
                PDImageXObject pdImage = JPEGFactory.createFromImage(pdfDocument, img);
                try (PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, page)) {
                   contentStream.drawImage(pdImage, 0, 0, (float)pgsize.getWidth(), (float)pgsize.getHeight());
                }
            }
            
            File outputFile = File.createTempFile("converted-", ".pdf");
            pdfDocument.save(outputFile);
            return outputFile;
        }
    }

    private File convertDocxToPdf(MultipartFile file) throws IOException {
        // Docx -> PDF with text and images (Linear flow)
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream());
             PDDocument pdfDocument = new PDDocument()) {
             
            PDPage page = new PDPage(PDRectangle.A4);
            pdfDocument.addPage(page);
            
            float yOffset = 750;
            float margin = 50;
            
            PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, page);
            contentStream.setFont(PDType1Font.HELVETICA, 10);
            
            for (XWPFParagraph p : doc.getParagraphs()) {
                // Check page break
                if (yOffset < 50) {
                    contentStream.close();
                    page = new PDPage(PDRectangle.A4);
                    pdfDocument.addPage(page);
                    contentStream = new PDPageContentStream(pdfDocument, page);
                    contentStream.setFont(PDType1Font.HELVETICA, 10);
                    yOffset = 750;
                }

                // Process Runs
                for (XWPFRun run : p.getRuns()) {
                    List<XWPFPicture> pictures = run.getEmbeddedPictures();
                    if (pictures != null && !pictures.isEmpty()) {
                        for (XWPFPicture pic : pictures) {
                             byte[] data = pic.getPictureData().getData();
                             // Try to create image
                             try {
                                 PDImageXObject pdImage = PDImageXObject.createFromByteArray(pdfDocument, data, "img");
                                 // Scale image to fit width if needed
                                 float maxWidth = PDRectangle.A4.getWidth() - 2 * margin;
                                 float imgWidth = pdImage.getWidth();
                                 float imgHeight = pdImage.getHeight();
                                 
                                 if (imgWidth > maxWidth) {
                                     float scale = maxWidth / imgWidth;
                                     imgWidth *= scale;
                                     imgHeight *= scale;
                                 }
                                 
                                 // Check space
                                 if (yOffset - imgHeight < 50) {
                                     contentStream.close();
                                     page = new PDPage(PDRectangle.A4);
                                     pdfDocument.addPage(page);
                                     contentStream = new PDPageContentStream(pdfDocument, page);
                                     yOffset = 750;
                                 }
                                 
                                 contentStream.drawImage(pdImage, margin, yOffset - imgHeight, imgWidth, imgHeight);
                                 yOffset -= (imgHeight + 10);
                             } catch (Exception e) {
                                 // Skip invalid image
                             }
                        }
                    }

                    String text = run.text();
                    if (text != null && !text.isEmpty()) {
                        // Very simple text wrapping/printing
                        String[] lines = text.split("\\r?\\n");
                         for (String line : lines) {
                             // Sanitize
                            String sanitized = line.replaceAll("[\\r\\n]", "").replaceAll("\\t", " ");
                            try {
                                contentStream.beginText();
                                contentStream.newLineAtOffset(margin, yOffset);
                                contentStream.showText(sanitized);
                                contentStream.endText();
                                yOffset -= 12;
                            } catch (Exception e) {}
                            
                             if (yOffset < 50) {
                                contentStream.close();
                                page = new PDPage(PDRectangle.A4);
                                pdfDocument.addPage(page);
                                contentStream = new PDPageContentStream(pdfDocument, page);
                                contentStream.setFont(PDType1Font.HELVETICA, 10);
                                yOffset = 750;
                            }
                        }
                    }
                }
                
                // Paragraph gap
                yOffset -= 5;
            }
            
            contentStream.close();
            
            File outputFile = File.createTempFile("converted-", ".pdf");
            pdfDocument.save(outputFile);
            return outputFile;
        }
    }


    private File createPdfFromText(List<String> lines) throws IOException {
         // Existing simple text fallback
        PDDocument document = new PDDocument();
        try {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            
            contentStream.setFont(PDType1Font.HELVETICA, 10);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 750);
            
            int linesPerPage = 50;
            int counter = 0;

            for (String line : lines) {
                String sanitized = line.replaceAll("[\\r\\n]", " ").replaceAll("\\t", "    ");
                try {
                    contentStream.showText(sanitized);
                } catch (IllegalArgumentException e) {
                    contentStream.showText("?"); 
                }
                contentStream.newLineAtOffset(0, -14);
                counter++;

                if (counter >= linesPerPage) {
                    contentStream.endText();
                    contentStream.close();
                    
                    page = new PDPage(PDRectangle.A4);
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    contentStream.setFont(PDType1Font.HELVETICA, 10);
                    contentStream.beginText();
                    contentStream.newLineAtOffset(50, 750);
                    counter = 0;
                }
            }
            contentStream.endText();
            contentStream.close();
            File outputFile = File.createTempFile("converted-", ".pdf");
            document.save(outputFile);
            return outputFile;
        } finally {
            document.close();
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) return "";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
