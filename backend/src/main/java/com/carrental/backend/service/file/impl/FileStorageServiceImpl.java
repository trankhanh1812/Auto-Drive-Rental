package com.carrental.backend.service.file.impl;

import com.carrental.backend.service.file.FileStorageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {
    private final Cloudinary cloudinary;
    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            //tao unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String publicId ="car-rental/" + folder + "/" + UUID.randomUUID().toString();

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                           // "folder", "car-rental/" + folder,
                            "resource_type", "auto",
                            "type", "upload"
                    ));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Could not upload file to Cloudinary. Please try again.", e);
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
        catch (IOException e) {
            throw new RuntimeException("Could not delete file from Cloudinary.", e);
        }
    }

    @Override
    public String getFileUrl(String publicId) {
        return cloudinary.url().generate(publicId);
    }
}
