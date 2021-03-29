package net.ehicks.loon.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

import java.util.Arrays;

@Configuration
public class CookieConfig
{
    private static final Logger log = LoggerFactory.getLogger(CookieConfig.class);
    private final Environment environment;

    public CookieConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();

        boolean dev = Arrays.asList(environment.getActiveProfiles()).contains("dev");
        if (!dev) {
            log.info("production cookie settings");
            serializer.setSameSite("none");
            serializer.setUseSecureCookie(true);
        }
        log.info(serializer.toString());
        return serializer;
    }
}