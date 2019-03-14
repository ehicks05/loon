package net.ehicks.loon.repos;

import net.ehicks.loon.beans.PlaylistTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistTrackRepository extends JpaRepository<PlaylistTrack, Long>
{
    List<PlaylistTrack> findByPlaylistIdOrderByIndex(Long playlistId);
    PlaylistTrack findByPlaylistIdAndTrackId(Long playlistId, String trackId);
}