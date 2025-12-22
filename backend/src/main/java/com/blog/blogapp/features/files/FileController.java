package com.blog.blogapp.features.files;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173","http://localhost:4200"})
public class FileController {

  @Value("${app.upload.dir}")
  private String uploadDir;

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Map<String,String>> upload(@RequestPart("file") MultipartFile file) throws IOException {
    Files.createDirectories(new File(uploadDir).toPath());
    String base = UUID.randomUUID().toString();
    String original = base + "_" + file.getOriginalFilename();
    File out = new File(uploadDir, original);
    file.transferTo(out);

    String small = base + "_small_" + file.getOriginalFilename();
    String med = base + "_med_" + file.getOriginalFilename();
    String large = base + "_large_" + file.getOriginalFilename();

    File fSmall = new File(uploadDir, small);
    File fMed = new File(uploadDir, med);
    File fLarge = new File(uploadDir, large);

    Thumbnails.of(out).size(400, 400).toFile(fSmall);
    Thumbnails.of(out).size(800, 800).toFile(fMed);
    Thumbnails.of(out).size(1400, 1400).toFile(fLarge);

    // try ImageMagick if present (best-effort)
    try {
      String[] cmd = new String[]{"magick", fLarge.getAbsolutePath(), "-resize", "1200x1200", fLarge.getAbsolutePath()};
      new ProcessBuilder(cmd).inheritIO().start().waitFor();
    } catch (Exception ignored){}

    Map<String,String> res = new HashMap<>();
    res.put("small", "/"+fSmall.getName());
    res.put("medium", "/"+fMed.getName());
    res.put("large", "/"+fLarge.getName());
    res.put("original", "/"+out.getName());
    return ResponseEntity.ok(res);
  }
}
