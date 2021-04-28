package kr.vaiv.sdt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class SdtApplication {

    public static void main(String[] args) {
        SpringApplication.run(SdtApplication.class, args);
    }
}