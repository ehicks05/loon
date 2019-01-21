package net.ehicks.loon.repos;

import net.ehicks.loon.beans.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long>
{

    User findByUsername(String username);

}