package net.ehicks.loon.handlers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@PropertySource(value = "classpath:git.properties", ignoreResourceNotFound = true)
public class GitInfoController {

    @Value("${git.commit.message.short:0}")
    private String commitMessage;

    @Value("${git.branch:0}")
    private String branch;

    @Value("${git.commit.id:0}")
    private String commitId;

    @Value("${git.total.commit.count:0}")
    private String commitCount;

    @RequestMapping("/api/commitId")
    public Map<String, String> getCommitId() {
        Map<String, String> result = new HashMap<>();
        result.put("Commit message",commitMessage);
        result.put("Commit branch", branch);
        result.put("Commit id", commitId.substring(0, 5) + "...");
        result.put("Commit count", commitCount);
        return result;
    }
}