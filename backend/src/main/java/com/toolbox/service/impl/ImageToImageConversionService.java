package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class ImageToImageConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        boolean isSourceImage = "jpg".equalsIgnoreCase(sourceFormat) || "jpeg".equalsIgnoreCase(sourceFormat) || "png".equalsIgnoreCase(sourceFormat);
        boolean isTargetImage = "jpg".equalsIgnoreCase(targetFormat) || "jpeg".equalsIgnoreCase(targetFormat) || "png".equalsIgnoreCase(targetFormat);
        // Avoid same format conversion conceptually, but allow it for sanity
        return isSourceImage && isTargetImage && !sourceFormat.equalsIgnoreCase(targetFormat);
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        
        // Handle transparency if converting PNG (with alpha) to JPG (no alpha)
        boolean targetIsJpg = "jpg".equalsIgnoreCase(targetFormat) || "jpeg".equalsIgnoreCase(targetFormat);
        if (targetIsJpg && originalImage.getColorModel().hasAlpha()) {
            BufferedImage newImage = new BufferedImage(originalImage.getWidth(), originalImage.getHeight(), BufferedImage.TYPE_INT_RGB);
            java.awt.Graphics2D g = newImage.createGraphics();
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, originalImage.getWidth(), originalImage.getHeight());
            g.drawImage(originalImage, 0, 0, null);
            g.dispose();
            originalImage = newImage;
        }

        File outputFile = File.createTempFile("converted-", "." + targetFormat);
        String formatName = targetFormat.equalsIgnoreCase("jpg") ? "jpeg" : targetFormat;
        ImageIO.write(originalImage, formatName, outputFile);
        
        return outputFile;
    }
}
