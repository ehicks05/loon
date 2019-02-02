package net.ehicks.loon;

import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionManager
{
    private SessionRegistry sessionRegistry;

    public SessionManager(SessionRegistry sessionRegistry)
    {
        this.sessionRegistry = sessionRegistry;
    }

    public List<SessionInformation> getUsersFromSessionRegistry()
    {
        return sessionRegistry.getAllPrincipals().stream()
                .filter(u -> !sessionRegistry.getAllSessions(u, false).isEmpty())
                .map(u -> sessionRegistry.getAllSessions(u, false).get(0))
                .collect(Collectors.toList());
    }
}
