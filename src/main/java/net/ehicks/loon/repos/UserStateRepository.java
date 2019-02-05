package net.ehicks.loon.repos;

import net.ehicks.loon.beans.UserState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStateRepository extends JpaRepository<UserState, Long>
{
}