package net.ehicks.loon.handlers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController
{
    @RequestMapping({
            "/admin/**",
            "/albums/**",
            "/album/**",
            "/artists/**",
            "/artist/**",
            "/favorites/**",
            "/library/**",
            "/playlists/**",
            "/queue/**",
            "/search/**",
            "/settings/**"
    })
    public String goReact() {
        return "forward:/";
    }
}
