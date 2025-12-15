package com.carrental.backend.controller;

import com.carrental.backend.dto.ApiResponse;
import com.carrental.backend.service.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder
            ) {
        String fileUrl = fileStorageService.uploadFile(file, folder);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", fileUrl));
    }

    @DeleteMapping("/{publicId}")
    public ResponseEntity<ApiResponse<String>> deleteFile(@PathVariable String publicId) {
        fileStorageService.deleteFile(publicId);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", publicId));
    }
}
