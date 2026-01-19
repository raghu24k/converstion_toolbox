package com.toolbox.controller;

import com.toolbox.service.ConversionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend access from any port
public class ConversionController {

    @Autowired
    private List<ConversionService> conversionServices;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Server is running");
    }

    @PostMapping("/convert")
    public ResponseEntity<Resource> convertFile(@RequestParam("file") MultipartFile file,
                                                @RequestParam("targetFormat") String targetFormat) {
        try {
            String sourceFormat = getFileExtension(file.getOriginalFilename());
            
            ConversionService service = conversionServices.stream()
                .filter(s -> s.supports(sourceFormat, targetFormat))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No converter found for " + sourceFormat + " to " + targetFormat));

            File result = service.convert(file, targetFormat);
            
            Resource resource = new FileSystemResource(result);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"converted." + targetFormat + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
