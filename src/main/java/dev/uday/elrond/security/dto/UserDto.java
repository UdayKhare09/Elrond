package dev.uday.elrond.security.dto;

import lombok.Data;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link dev.uday.elrond.security.model.User}
 */
@Data
public class UserDto implements Serializable {
    String email;
    String username;
    String firstName;
    String lastName;
}