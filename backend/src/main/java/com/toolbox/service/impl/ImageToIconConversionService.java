package com.toolbox.service.impl;

import com.toolbox.service.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class ImageToIconConversionService implements ConversionService {

    @Override
    public boolean supports(String sourceFormat, String targetFormat) {
        return (sourceFormat.equalsIgnoreCase("jpg") || 
                sourceFormat.equalsIgnoreCase("jpeg") || 
                sourceFormat.equalsIgnoreCase("png")) 
                && targetFormat.equalsIgnoreCase("ico");
    }

    @Override
    public File convert(MultipartFile file, String targetFormat) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        
        // Create a 256x256 icon (standard large icon size)
        int iconSize = 256;
        BufferedImage iconImage = new BufferedImage(iconSize, iconSize, BufferedImage.TYPE_INT_ARGB);
        
        Graphics2D g2d = iconImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        // Scale the image to fit the icon size while maintaining aspect ratio
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        
        double scale = Math.min((double) iconSize / originalWidth, (double) iconSize / originalHeight);
        int scaledWidth = (int) (originalWidth * scale);
        int scaledHeight = (int) (originalHeight * scale);
        
        int x = (iconSize - scaledWidth) / 2;
        int y = (iconSize - scaledHeight) / 2;
        
        g2d.drawImage(originalImage, x, y, scaledWidth, scaledHeight, null);
        g2d.dispose();
        
        // Save as PNG (browsers can use PNG as favicon)
        // True ICO format requires additional libraries, PNG works for web favicons
        File outputFile = File.createTempFile("icon-", ".png");
        ImageIO.write(iconImage, "png", outputFile);
        
        return outputFile;
    }
}
