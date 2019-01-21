package net.ehicks.loon;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController
{
    @RequestMapping({"/admin", "/library", "/playlists", "/admin/**", "/library/**", "/playlists/**"})
    public String goReact() {
        return "forward:/";
    }
}
