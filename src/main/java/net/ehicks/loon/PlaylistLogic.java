package net.ehicks.loon;

import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistLogic
{
    private PlaylistTrackRepository playlistTrackRepo;

    public PlaylistLogic(PlaylistTrackRepository playlistTrackRepo)
    {
        this.playlistTrackRepo = playlistTrackRepo;
    }

    public void setTrackIds(long playlistId, List<Long> newTrackIds)
    {
        List<Long> currentTrackIds = playlistTrackRepo.findByPlaylistIdOrderByIndex(playlistId).stream()
                .map(PlaylistTrack::getTrackId).collect(Collectors.toList());

        List<Long> trackIdsToRemove = new ArrayList<>(currentTrackIds);
        trackIdsToRemove.removeAll(newTrackIds);

        List<Long> trackIdsToAdd = new ArrayList<>(newTrackIds);
        trackIdsToAdd.removeAll(currentTrackIds);

        trackIdsToRemove.forEach(trackId -> {
            PlaylistTrack playlistTrack = playlistTrackRepo.findByPlaylistIdAndTrackId(playlistId, trackId);
            if (playlistTrack != null)
                playlistTrackRepo.delete(playlistTrack);
        });

        trackIdsToAdd.forEach(trackId -> {
            PlaylistTrack playlistTrack = new PlaylistTrack();
            playlistTrack.setPlaylistId(playlistId);
            playlistTrack.setTrackId(trackId);
            playlistTrack.setIndex(getNextAvailableIndex(playlistId));
            playlistTrackRepo.save(playlistTrack);
        });

        consolidateTrackIndexes(playlistId);
    }

    // close up gaps in indexes, keeping ordering the same.
    public void consolidateTrackIndexes(long playlistId)
    {
        List<PlaylistTrack> tracks = playlistTrackRepo.findByPlaylistIdOrderByIndex(playlistId);

        long nextIndex = 0;

        for (PlaylistTrack track : tracks)
        {
            if (!track.getIndex().equals(nextIndex))
            {
                track.setIndex(nextIndex);
                playlistTrackRepo.save(track);
            }
            nextIndex++;
        }
    }

    public long getNextAvailableIndex(long playlistId)
    {
        List<PlaylistTrack> tracks = playlistTrackRepo.findByPlaylistIdOrderByIndex(playlistId);

        return tracks.stream().mapToLong(track -> track.getIndex() + 1).max().orElse(0);
    }
}
