package net.ehicks.loon.repos;

import net.ehicks.loon.beans.DBFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DbFileRepository extends JpaRepository<DBFile, Long>
{
    DBFile getByName(String name);
}
