package net.ehicks.loon.repos;

import net.ehicks.loon.beans.Track;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackRepository extends JpaRepository<Track, Long>
{
    Track findByPath(String path);
}