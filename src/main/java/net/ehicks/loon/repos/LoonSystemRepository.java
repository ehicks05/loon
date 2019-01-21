package net.ehicks.loon.repos;

import net.ehicks.loon.beans.LoonSystem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoonSystemRepository extends JpaRepository<LoonSystem, Long>
{
}