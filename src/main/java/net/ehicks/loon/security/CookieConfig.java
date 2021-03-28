package net.ehicks.loon.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

import java.util.Arrays;

@Configuration
public class CookieConfig
{
    private final Environment environment;

    public CookieConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();

        boolean dev = Arrays.asList(environment.getActiveProfiles()).contains("dev");
        if (dev) return serializer;

        serializer.setSameSite("none");
        serializer.setUseSecureCookie(true);
        return serializer;
    }
}