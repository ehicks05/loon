package net.ehicks.loon;

import org.apache.catalina.Context;
import org.apache.catalina.webresources.StandardRoot;
import org.apache.tomcat.util.scan.StandardJarScanner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

import javax.servlet.Filter;

@SpringBootApplication
@EnableScheduling
public class Application
{
    private static final Logger log = LoggerFactory.getLogger(Application.class);

    private Startup startup;

    @Autowired
    public Application(Startup startup)
    {
        this.startup = startup;
    }

    public static void main(String[] args)
    {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx)
    {
        return args -> {
            try
            {
                startup.start();
            }
            catch (Exception e)
            {
                System.out.println(e.getMessage());
                e.printStackTrace();
            }
        };
    }

    @Bean
    public TomcatServletWebServerFactory tomcatFactory()
    {
        return new TomcatServletWebServerFactory()
        {
            @Override
            protected void postProcessContext(Context context)
            {
                ((StandardJarScanner) context.getJarScanner()).setScanManifest(false);

                final int cacheSize = 128 * 1024;
                StandardRoot standardRoot = new StandardRoot(context);
                standardRoot.setCacheMaxSize(cacheSize);
                context.setResources(standardRoot); // This is what made it work in my case.

                logger.info(String.format("New cache size (KB): %d", context.getResources().getCacheMaxSize()));
            }
        };
    }

    @Bean
    public Filter shallowEtagHeaderFilter() {
        return new ShallowEtagHeaderFilter();
    }

    @Bean
    SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
}