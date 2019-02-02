package net.ehicks.loon;

import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.PlaylistRepository;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PlaylistLogic
{
    private PlaylistTrackRepository playlistTrackRepo;
    private PlaylistRepository playlistRepo;
    private TrackRepository trackRepo;

    public PlaylistLogic(PlaylistTrackRepository playlistTrackRepo, PlaylistRepository playlistRepo, TrackRepository trackRepo)
    {
        this.playlistTrackRepo = playlistTrackRepo;
        this.playlistRepo = playlistRepo;
        this.trackRepo = trackRepo;
    }

    public void setTrackIds(Playlist playlist, List<Long> newTrackIds)
    {
        List<Long> currentTrackIds = playlist.getPlaylistTracks().stream().map(playlistTrack -> playlistTrack.getTrack().getId()).collect(Collectors.toList());

        List<Long> trackIdsToRemove = new ArrayList<>(currentTrackIds);
        trackIdsToRemove.removeAll(newTrackIds);

        List<Long> trackIdsToAdd = new ArrayList<>(newTrackIds);
        trackIdsToAdd.removeAll(currentTrackIds);

        trackIdsToRemove.forEach(trackId -> {
            Track track = trackRepo.findById(trackId).orElse(null);
            PlaylistTrack playlistTrack = playlist.getPlaylistTracks().stream().filter(playlistTrack1 -> playlistTrack1.getTrack().getId().equals(trackId)).findFirst().orElse(null);
            if (playlistTrack != null)
            {
                playlist.getPlaylistTracks().remove(playlistTrack);
//                track.getPlaylistTracks().remove(playlistTrack);
                playlistTrackRepo.delete(playlistTrack);
            }
        });

        trackIdsToAdd.forEach(trackId -> {
            Track track = trackRepo.findById(trackId).orElse(null);
            PlaylistTrack playlistTrack = new PlaylistTrack();
            playlistTrack.setPlaylist(playlist);
            playlistTrack.setTrack(track);
            playlistTrack.setIndex(getNextAvailableIndex(playlist.getId()));
            playlistTrack = playlistTrackRepo.save(playlistTrack);

//            track.getPlaylistTracks().add(playlistTrack);
            playlist.getPlaylistTracks().add(playlistTrack);
        });

        consolidateTrackIndexes(playlist.getPlaylistTracks());
    }

    // close up gaps in indexes, keeping ordering the same.
    public void consolidateTrackIndexes(Set<PlaylistTrack> playlistTracks)
    {
        long nextIndex = 0;

        for (PlaylistTrack playlistTrack : playlistTracks)
        {
            if (!playlistTrack.getIndex().equals(nextIndex))
            {
                playlistTrack.setIndex(nextIndex);
                playlistTrackRepo.save(playlistTrack);
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
