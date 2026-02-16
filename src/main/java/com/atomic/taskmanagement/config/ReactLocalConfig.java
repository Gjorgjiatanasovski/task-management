package com.atomic.taskmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("default")
public class ReactLocalConfig {

    private final String RECT_LOCAL_URL_3000 = "http://localhost:3000";
    private final String RECT_LOCAL_URL_5173 = "http://localhost:5173";
    private final String RECT_LOCAL_URL_5174 = "http://localhost:5174";

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(final CorsRegistry registry) {
                registry.addMapping("/**").allowedMethods("*")
                    .allowedOrigins(RECT_LOCAL_URL_3000,RECT_LOCAL_URL_5173,RECT_LOCAL_URL_5174);
            }
        };
    }

}
