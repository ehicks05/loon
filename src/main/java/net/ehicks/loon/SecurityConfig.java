package net.ehicks.loon;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
    @Configuration
    @Order(1)
    public static class ApiWebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {
        private UserRepositoryUserDetailsService userDetailsService;
        private PasswordEncoder passwordEncoder;

        public ApiWebSecurityConfigurationAdapter(UserRepositoryUserDetailsService userDetailsService, PasswordEncoder passwordEncoder)
        {
            this.userDetailsService = userDetailsService;
            this.passwordEncoder = passwordEncoder;
        }

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception
        {
            auth
                    .userDetailsService(userDetailsService)
                    .passwordEncoder(passwordEncoder);
        }

        protected void configure(HttpSecurity http) throws Exception {
            http
                    .antMatcher("/actuator/**")
                    .authorizeRequests()
                    .anyRequest().hasRole("ADMIN")
                    .and()
                    .httpBasic();
        }
    }

    @Configuration
    @Order(2)
    public static class FormLoginWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
        private UserRepositoryUserDetailsService userDetailsService;
        private PasswordEncoder passwordEncoder;
        private SessionRegistry sessionRegistry;

        public FormLoginWebSecurityConfigurerAdapter(UserRepositoryUserDetailsService userDetailsService, PasswordEncoder passwordEncoder, SessionRegistry sessionRegistry)
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

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .authorizeRequests()
                    .antMatchers("/login", "/register", "/images/**", "/js/dist/**", "/styles/**").permitAll()
                    .antMatchers("/api/admin/**").hasRole("ADMIN")
                    .antMatchers("/**").hasRole("USER")
                    .and()
                    .formLogin()
                    .loginPage("/login")
                    .and()
                    .logout()
                    .logoutSuccessUrl("/")
                    .and()
                    .sessionManagement()
                    .maximumSessions(5).sessionRegistry(sessionRegistry);
        }
    }
}