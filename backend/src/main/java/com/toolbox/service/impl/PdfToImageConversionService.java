package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class PdfToImageConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        return "pdf".equalsIgnoreCase(sourceFormat) && 
               ("png".equalsIgnoreCase(targetFormat) || "jpg".equalsIgnoreCase(targetFormat));
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            
            // Render first page only (page index 0) at 300 DPI
            BufferedImage bim = pdfRenderer.renderImageWithDPI(0, 300, 
                targetFormat.equalsIgnoreCase("jpg") ? ImageType.RGB : ImageType.ARGB);

            File outputFile = File.createTempFile("converted-", "." + targetFormat);
            
            // ImageIO needs "jpeg" not "jpg" strictly speaking? "jpg" usually works but "jpeg" is formal. 
            // We'll pass the format name directly, usually safe.
            String formatName = targetFormat.equalsIgnoreCase("jpg") ? "jpeg" : targetFormat;
            
            ImageIO.write(bim, formatName, outputFile);
            return outputFile;
        }
    }
}
