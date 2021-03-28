package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/me")
public class MeController
{
    private static final Logger log = LoggerFactory.getLogger(MeController.class);

    @GetMapping()
    public User getCurrentUser(@AuthenticationPrincipal User user)
    {
        log.info("found: " + user);
        return user;
    }
}
