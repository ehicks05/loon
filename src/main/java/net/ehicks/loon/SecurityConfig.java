package net.ehicks.loon;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
    private UserRepositoryUserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;

    public SecurityConfig(UserRepositoryUserDetailsService userDetailsService, PasswordEncoder passwordEncoder)
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

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/login", "/images/**", "/js/**", "/styles/**").permitAll()
                .antMatchers("/**")
                .hasRole("USER")
                .and()
                .formLogin()
                .loginPage("/login")
                .and()
                .logout()
                .logoutSuccessUrl("/")
                .and();

        http.csrf().disable(); // todo deal with this

    }

//    DataSource dataSource;
//
//    public SecurityConfig(DataSource dataSource)
//    {
//        this.dataSource = dataSource;
//    }
//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception
//    {
//        // in memory
////        auth.inMemoryAuthentication()
////                .withUser("eric@test.com")
////                .password("eric")
////                .authorities("ROLE_USER");
//
//        // jdbc
//        auth.jdbcAuthentication()
//                .dataSource(dataSource)
//                .usersByUsernameQuery(
//                        "select username, password, enabled from Users " +
//                                "where username=?")
//                .authoritiesByUsernameQuery(
//                        "select username, authority from UserAuthorities " +
//                                "where username=?")
//                .passwordEncoder(new BCryptPasswordEncoder());
//    }
}