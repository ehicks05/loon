package net.ehicks.loon;

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
            "/search/**",
            "/settings/**"
    })
    public String goReact() {
        return "forward:/";
    }
}
