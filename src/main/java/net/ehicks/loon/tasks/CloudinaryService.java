package net.ehicks.loon.tasks;

import com.cloudinary.Cloudinary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryService {
    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private final Map<String, String> nameToPublicId = new HashMap<>();

    @Value("${CLOUDINARY_URL}")
    private String CLOUDINARY_URL;

    Cloudinary cloudinary;
    public Cloudinary getCloudinary() {
        if (this.cloudinary == null)
            this.cloudinary = new Cloudinary(CLOUDINARY_URL);
        return this.cloudinary;
    }

    public String upload(byte[] bytes, String name) {
        try {
            Map options = Map.of("public_id", name);
            // check already exists
            try {
                if (nameToPublicId.containsKey(name))
                    return nameToPublicId.get(name);
                // looks for existing
                Map uploadResult = getCloudinary().uploader().explicit(name, Collections.emptyMap());
                String publicId = (String) uploadResult.get("public_id");
                nameToPublicId.put(name, publicId);
                return publicId;
            } catch (Exception e) {
                // noop
            }

            Map uploadResult = getCloudinary().uploader().upload(bytes, options);
            String publicId = (String) uploadResult.get("public_id");
            nameToPublicId.put(name, publicId);
            return publicId;
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return null;
    }
}
