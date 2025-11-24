package dev.uday.elrond;

import dev.uday.elrond.security.ElrondSecurity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ElrondSecurity
public class ElrondApplication {

    static void main(String[] args) {
        SpringApplication.run(ElrondApplication.class, args);
    }

}
