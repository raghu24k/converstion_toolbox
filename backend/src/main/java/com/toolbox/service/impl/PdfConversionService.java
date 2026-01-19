package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

@Service
public class PdfConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        return "pdf".equalsIgnoreCase(targetFormat) && 
               ("jpg".equalsIgnoreCase(sourceFormat) || "jpeg".equalsIgnoreCase(sourceFormat) || "png".equalsIgnoreCase(sourceFormat));
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        if (!supports(getFileExtension(file.getOriginalFilename()), targetFormat)) {
            throw new IllegalArgumentException("Unsupported conversion type");
        }

        PDDocument document = new PDDocument();
        try {
            // Create a temporary file for the image
            File tempImage = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempImage);

            PDImageXObject pdImage = PDImageXObject.createFromFile(tempImage.getAbsolutePath(), document);
            
            // Auto-rotate logic
            boolean isLandscape = pdImage.getWidth() > pdImage.getHeight();
            PDRectangle pageSize = isLandscape 
                ? new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()) 
                : PDRectangle.A4;

            PDPage page = new PDPage(pageSize);
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float margin = 20f;
                float pdfWidth = pageSize.getWidth();
                float pdfHeight = pageSize.getHeight();
                
                float imgWidth = pdImage.getWidth();
                float imgHeight = pdImage.getHeight();

                // Calculate scale to fit within margins
                float scale = Math.min(
                    (pdfWidth - 2 * margin) / imgWidth, 
                    (pdfHeight - 2 * margin) / imgHeight
                );
                
                float newWidth = imgWidth * scale;
                float newHeight = imgHeight * scale;
                
                // Calculate centered position
                float startX = (pdfWidth - newWidth) / 2;
                float startY = (pdfHeight - newHeight) / 2;
                
                contentStream.drawImage(pdImage, startX, startY, newWidth, newHeight);
            }
            
            // Cleanup temp image
            tempImage.delete();

            File outputFile = File.createTempFile("converted-", ".pdf");
            document.save(outputFile);
            return outputFile;
        } finally {
            document.close();
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
