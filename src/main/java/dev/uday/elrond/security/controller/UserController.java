package dev.uday.elrond.security.controller;

import dev.uday.elrond.security.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@AllArgsConstructor
public class UserController {

    private UserService userService;


}
