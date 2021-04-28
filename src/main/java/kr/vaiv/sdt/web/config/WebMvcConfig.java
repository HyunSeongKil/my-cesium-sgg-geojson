package kr.vaiv.sdt.web.config;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

/**
 * mvc관련 설정
 */
@Slf4j
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {


    @PostConstruct
    private void init() {
        log.info("<<");
    }


    /**
     * CORS 정보 추가
     * 
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods(HttpMethod.GET.name(), HttpMethod.HEAD.name(),
                HttpMethod.POST.name(), HttpMethod.PUT.name(), HttpMethod.DELETE.name());
        ;
    }
}
