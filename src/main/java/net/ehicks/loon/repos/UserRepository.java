package net.ehicks.loon.repos;

import net.ehicks.loon.beans.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>
{
    User findByUsername(String username);
    List<User> findAllByOrderById();
}