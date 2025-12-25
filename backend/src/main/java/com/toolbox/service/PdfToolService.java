package com.toolbox.service;


import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class PdfToolService {

    public File mergePdfs(List<MultipartFile> files) throws IOException {
        PDFMergerUtility merger = new PDFMergerUtility();
        File outputFile = File.createTempFile("merged-", ".pdf");
        merger.setDestinationFileName(outputFile.getAbsolutePath());

        for (MultipartFile file : files) {
            // We need to save temp files because PDFMergerUtility works best with files or streams
            // But we can also use streams directly if we handle them carefully.
            // Using strict mode to merge.
            merger.addSource(file.getInputStream());
        }

        merger.mergeDocuments(null);
        return outputFile;
    }
}
