package net.ehicks.loon;

import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class PlaylistLogic
{
    private static final Logger log = LoggerFactory.getLogger(PlaylistLogic.class);

    private PlaylistTrackRepository playlistTrackRepo;
    private TrackRepository trackRepo;

    public PlaylistLogic(PlaylistTrackRepository playlistTrackRepo, TrackRepository trackRepo)
    {
        this.playlistTrackRepo = playlistTrackRepo;
        this.trackRepo = trackRepo;
    }

    public void updatePlaylistTracks(Playlist playlist, List<Long> trackIds, String action, boolean clearExisting)
    {
        if (clearExisting && trackIds.isEmpty())
        {
            playlistTrackRepo.deleteAll(playlistTrackRepo.findByPlaylistIdOrderByIndex(playlist.getId()));
            playlist.setPlaylistTracks(new HashSet<>());
            return;
        }

        if (clearExisting && action.equals("add") /* is 'action==add' necessary? */)
        {
            List<PlaylistTrack> playlistTracksNotInInput = playlist.getPlaylistTracks()
                    .stream()
                    .filter(playlistTrack -> !trackIds.contains(playlistTrack.getTrack().getId()))
                    .collect(Collectors.toList());

            playlist.getPlaylistTracks().removeAll(playlistTracksNotInInput);
            playlistTrackRepo.deleteAll(playlistTracksNotInInput);
        }

        List<PlaylistTrack> tracksToPersist = new ArrayList<>();

        AtomicLong nextId = new AtomicLong(getNextAvailableIndex(playlist.getId()));
        trackIds.forEach(trackId -> {
            PlaylistTrack playlistTrack = playlistTrackRepo.findByPlaylistIdAndTrackId(playlist.getId(), trackId);
            if (action.equals("add") && playlistTrack == null)
            {
                Track track = trackRepo.findById(trackId).orElse(null);
                if (track == null)
                {
                    log.error("Can't add track:" + trackId + " to " + playlist);
                    return;
                }

                playlistTrack = new PlaylistTrack();
                playlistTrack.setPlaylist(playlist);
                playlistTrack.setTrack(track);
                playlistTrack.setIndex(nextId.getAndIncrement());
                tracksToPersist.add(playlistTrack);

                playlist.getPlaylistTracks().add(playlistTrack);
            }
            if (action.equals("remove") && playlistTrack != null)
            {
                playlist.getPlaylistTracks().remove(playlistTrack);
                tracksToPersist.add(playlistTrack);
            }
        });

        if (action.equals("add")) playlistTrackRepo.saveAll(tracksToPersist);
        if (action.equals("remove")) playlistTrackRepo.deleteAll(tracksToPersist);

        consolidateTrackIndexes(playlist.getPlaylistTracks());
    }

    // close up gaps in indexes, keeping ordering the same.
    public void consolidateTrackIndexes(Set<PlaylistTrack> playlistTracks)
    {
        long nextIndex = 0;

        List<PlaylistTrack> tracks = new ArrayList<>(playlistTracks)
                .stream()
                .sorted(Comparator.comparing(PlaylistTrack::getIndex))
                .collect(Collectors.toList());

        for (PlaylistTrack playlistTrack : tracks)
        {
            if (!playlistTrack.getIndex().equals(nextIndex))
                playlistTrack.setIndex(nextIndex);
            nextIndex++;
        }

        playlistTrackRepo.saveAll(playlistTracks);
    }

    public long getNextAvailableIndex(long playlistId)
    {
        List<PlaylistTrack> tracks = playlistTrackRepo.findByPlaylistIdOrderByIndex(playlistId);

        return tracks.stream().mapToLong(track -> track.getIndex() + 1).max().orElse(0);
    }
}
