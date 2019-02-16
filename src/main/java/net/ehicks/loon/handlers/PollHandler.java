package net.ehicks.loon.handlers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PollHandler
{
    @GetMapping("/poll")
    public String poll()
    {
        return "ok";
    }
}
