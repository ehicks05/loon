package net.ehicks.loon.repos;

import net.ehicks.loon.beans.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>
{

    User findByUsername(String username);

}