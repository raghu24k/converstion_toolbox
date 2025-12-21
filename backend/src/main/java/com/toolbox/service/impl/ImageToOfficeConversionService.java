package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.apache.poi.util.Units;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFPictureData;
import org.apache.poi.xslf.usermodel.XSLFPictureShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.sl.usermodel.PictureData;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class ImageToOfficeConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        boolean isImage = "jpg".equalsIgnoreCase(sourceFormat) || "jpeg".equalsIgnoreCase(sourceFormat) || "png".equalsIgnoreCase(sourceFormat);
        boolean isOffice = "docx".equalsIgnoreCase(targetFormat) || "pptx".equalsIgnoreCase(targetFormat);
        return isImage && isOffice;
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        if ("docx".equalsIgnoreCase(targetFormat)) {
            return convertToWord(file);
        } else {
            return convertToPpt(file);
        }
    }

    private File convertToWord(MultipartFile file) throws IOException {
        try (XWPFDocument document = new XWPFDocument()) {
            XWPFParagraph p = document.createParagraph();
            p.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun r = p.createRun();

            String filename = file.getOriginalFilename();
            String extension = filename != null ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : "jpg";
            int picType = "png".equals(extension) ? XWPFDocument.PICTURE_TYPE_PNG : XWPFDocument.PICTURE_TYPE_JPEG;

            BufferedImage bimg = ImageIO.read(file.getInputStream());
            int width = bimg.getWidth();
            int height = bimg.getHeight();

            // Fit to page (approx 500pt width)
            int targetWidth = 500;
            int targetHeight = (targetWidth * height) / width;

            r.addPicture(file.getInputStream(), picType, filename, Units.toEMU(targetWidth), Units.toEMU(targetHeight));

            File outputFile = File.createTempFile("converted-", ".docx");
            try (FileOutputStream out = new FileOutputStream(outputFile)) {
                document.write(out);
            }
            return outputFile;
        } catch (Exception e) {
            throw new IOException("Error converting image to word", e);
        }
    }

    private File convertToPpt(MultipartFile file) throws IOException {
        try (XMLSlideShow ppt = new XMLSlideShow()) {
            XSLFSlide slide = ppt.createSlide();

            String filename = file.getOriginalFilename();
            String extension = filename != null ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : "jpg";
            PictureData.PictureType picType = "png".equals(extension) ? PictureData.PictureType.PNG : PictureData.PictureType.JPEG;

            byte[] data = file.getBytes();
            XSLFPictureData pd = ppt.addPicture(data, picType);
            XSLFPictureShape pic = slide.createPicture(pd);

            // Center content logic could go here, for now it places at 0,0 default
            // Let's try to fit to slide
            // Page size default is 720x540
            java.awt.Dimension pgsize = ppt.getPageSize();
            BufferedImage bimg = ImageIO.read(file.getInputStream());
            double scale = Math.min(pgsize.getWidth() / bimg.getWidth(), pgsize.getHeight() / bimg.getHeight());
            double w = bimg.getWidth() * scale;
            double h = bimg.getHeight() * scale;
            
            pic.setAnchor(new java.awt.geom.Rectangle2D.Double(
                (pgsize.getWidth() - w) / 2, 
                (pgsize.getHeight() - h) / 2, 
                w, h));

            File outputFile = File.createTempFile("converted-", ".pptx");
            try (FileOutputStream out = new FileOutputStream(outputFile)) {
                ppt.write(out);
            }
            return outputFile;
        }
    }
}
