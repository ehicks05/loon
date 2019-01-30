package net.ehicks.loon.repos;

import net.ehicks.loon.beans.Role;
import org.springframework.data.repository.CrudRepository;

public interface RoleRepository extends CrudRepository<Role, Long>
{
    Role findByRole(String role);
}