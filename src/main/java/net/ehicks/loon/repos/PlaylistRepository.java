package net.ehicks.loon.repos;

import net.ehicks.loon.beans.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long>
{
    List<Playlist> findByUserId(Long userId);
    Playlist findByUserIdAndFavoritesTrue(Long userId);
    Playlist findByUserIdAndQueueTrue(Long userId);
}