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
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            // Create a temporary file for the image
            File tempImage = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempImage);

            PDImageXObject pdImage = PDImageXObject.createFromFile(tempImage.getAbsolutePath(), document);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Fit image to page logic could go here, for now just drawing it 1:1 or scaled
                float scale = Math.min(PDRectangle.A4.getWidth() / pdImage.getWidth(), 
                                     PDRectangle.A4.getHeight() / pdImage.getHeight());
                
                float newWidth = pdImage.getWidth() * scale;
                float newHeight = pdImage.getHeight() * scale;
                
                contentStream.drawImage(pdImage, 20, 20, newWidth, newHeight);
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
