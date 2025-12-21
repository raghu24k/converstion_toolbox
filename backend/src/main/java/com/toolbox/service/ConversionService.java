package com.toolbox.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

public interface ConversionService {
    File convert(MultipartFile file, String targetFormat) throws IOException;
    boolean supports(String sourceFormat, String targetFormat);
}
