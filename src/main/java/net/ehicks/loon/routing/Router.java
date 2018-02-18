package net.ehicks.loon.routing;

import org.reflections.Reflections;
import org.reflections.scanners.MethodAnnotationsScanner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.*;

public class Router
{
    private static final Logger log = LoggerFactory.getLogger(Router.class);

    private static Map<RouteDescription, Method> routeMap = new HashMap<>();

    public static Map<RouteDescription, Method> getRouteMap()
    {
        return routeMap;
    }

    public static void loadRoutes()
    {
        Reflections reflections = new Reflections("net.ehicks.loon", new MethodAnnotationsScanner());

        Set<Method> handlers = reflections.getMethodsAnnotatedWith(Route.class);
        // include handlers with multiple routes
        handlers.addAll(reflections.getMethodsAnnotatedWith(Routes.class));

        for (Method handler : handlers)
        {
            Route[] routes = handler.getAnnotationsByType(Route.class);
            for (Route route : routes)
            {
                RouteDescription routeDescription = new RouteDescription(route.tab1(), route.tab2(), route.tab3(), route.action());

                if (routeMap.containsKey(routeDescription))
                    log.error("Found duplicate route description: " + routeDescription);

                routeMap.put(routeDescription, handler);
            }
        }
    }
}
