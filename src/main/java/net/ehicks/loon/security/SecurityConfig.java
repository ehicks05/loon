package net.ehicks.loon.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
    private UserRepositoryUserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;
    private SessionRegistry sessionRegistry;

    public SecurityConfig(UserRepositoryUserDetailsService userDetailsService, PasswordEncoder passwordEncoder, SessionRegistry sessionRegistry)
    {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.sessionRegistry = sessionRegistry;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception
    {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
    }

    @Configuration
    @Order(99)
    public static class WebSecurityConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .cors().and()
                    .authorizeRequests()
                    .antMatchers("/login/**", "/me", "/poll", "/register").permitAll()
                    .antMatchers("/admin/**").hasRole("ADMIN")
                    .antMatchers("/**").hasRole("USER")
                    .and()
                    .formLogin()
                    .successHandler((request, response, authentication) -> {
                        // do nothing
                    })
                    .and()
                    .exceptionHandling()
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                    .and()
                    .logout()
                    .logoutSuccessHandler((request, response, authentication) -> {
                        // do nothing
                    })
                    .and().csrf().disable()
            ;
        }
    }
}