package net.ehicks.loon.repos;

import net.ehicks.loon.beans.Track;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long>
{
    Track findByPath(String path);
    List<Track> findAllByOrderByArtistAscAlbumAscTitleAsc();
    List<Track> findAllByIdIn(List<Long> ids);
}