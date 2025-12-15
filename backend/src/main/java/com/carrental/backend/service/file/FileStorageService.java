package com.carrental.backend.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String uploadFile(MultipartFile file, String folder);
    void deleteFile(String publicId);
    String getFileUrl(String publicId);
}
