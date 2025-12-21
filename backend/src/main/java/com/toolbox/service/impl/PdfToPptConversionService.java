package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.poi.sl.usermodel.PictureData;

import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFPictureData;
import org.apache.poi.xslf.usermodel.XSLFPictureShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class PdfToPptConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        return "pdf".equalsIgnoreCase(sourceFormat) && ("pptx".equalsIgnoreCase(targetFormat) || "ppt".equalsIgnoreCase(targetFormat));
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        try (PDDocument pdfDocument = PDDocument.load(file.getInputStream());
             XMLSlideShow ppt = new XMLSlideShow()) {
            
            PDFRenderer pdfRenderer = new PDFRenderer(pdfDocument);
            int pages = pdfDocument.getNumberOfPages();
            
            // Standard Slide Size (roughly)
            float slideWidth = 720f; 
            float slideHeight = 540f; 
            ppt.setPageSize(new java.awt.Dimension((int)slideWidth, (int)slideHeight));

            for (int i = 0; i < pages; i++) {
                BufferedImage bim = pdfRenderer.renderImageWithDPI(i, 150, ImageType.RGB);
                
                ByteArrayOutputStream os = new ByteArrayOutputStream();
                ImageIO.write(bim, "jpeg", os);
                byte[] pictureData = os.toByteArray();
                
                XSLFSlide slide = ppt.createSlide();
                XSLFPictureData pd = ppt.addPicture(pictureData, PictureData.PictureType.JPEG);
                XSLFPictureShape pic = slide.createPicture(pd);
                
                // Scale to fit slide
                pic.setAnchor(new Rectangle2D.Double(0, 0, slideWidth, slideHeight));
            }

            File outputFile = File.createTempFile("converted-", "." + targetFormat);
            try (FileOutputStream out = new FileOutputStream(outputFile)) {
                ppt.write(out);
            }
            return outputFile;
        }
    }
}
