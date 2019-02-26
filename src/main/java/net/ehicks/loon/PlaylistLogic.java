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

    // add or remove tracks from a playlist
    public void addOrRemoveTracks(Playlist playlist, List<Long> trackIds, String action)
    {
        List<PlaylistTrack> tracksToPersist = new ArrayList<>();

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
                playlistTrack.setIndex(getNextAvailableIndex(playlist.getId()));
                tracksToPersist.add(playlistTrack);

                playlist.getPlaylistTracks().add(playlistTrack);
            }
            if (action.equals("remove") && playlistTrack != null)
            {
                playlist.getPlaylistTracks().remove(playlistTrack);
                tracksToPersist.add(playlistTrack);
            }
        });

        if (action.equals("add"))
            playlistTrackRepo.saveAll(tracksToPersist);
        if (action.equals("remove"))
            playlistTrackRepo.deleteAll(tracksToPersist);

        consolidateTrackIndexes(playlist.getPlaylistTracks());
    }

    // replaces current tracks with newTrackIds
    public void setTrackIds(Playlist playlist, List<Long> newTrackIds)
    {
        List<Long> currentTrackIds = playlist.getPlaylistTracks().stream().map(playlistTrack -> playlistTrack.getTrack().getId()).collect(Collectors.toList());
        Set<PlaylistTrack> currentPlaylistTracks = playlist.getPlaylistTracks();

        Set<PlaylistTrack> playlistTracksToRemove = new HashSet<>();
        currentPlaylistTracks.forEach(currentPlaylistTrack -> {
            if (!newTrackIds.contains(currentPlaylistTrack.getTrack().getId()))
                playlistTracksToRemove.add(currentPlaylistTrack);
        });

        List<Long> trackIdsToRemove = new ArrayList<>(currentTrackIds);
        trackIdsToRemove.removeAll(newTrackIds);

        List<Long> trackIdsToAdd = new ArrayList<>(newTrackIds);
        trackIdsToAdd.removeAll(currentTrackIds);

        if (trackIdsToRemove.size() > 0)
        {
            playlist.getPlaylistTracks().removeAll(playlistTracksToRemove);
            playlistTrackRepo.deleteAll(playlistTracksToRemove);
        }

        if (trackIdsToAdd.size() > 0)
        {
            List<Track> tracks = trackRepo.findAllByIdIn(trackIdsToAdd);

            Set<PlaylistTrack> playlistTracksToAdd = new LinkedHashSet<>();
            trackIdsToAdd.forEach(trackIdToAdd -> {
                Track trackToAdd = tracks.stream().filter(track -> track.getId().equals(trackIdToAdd)).findFirst().orElse(null);
                if (trackToAdd == null)
                {
                    log.error("Can't add track:" + trackIdToAdd + " to " + playlist);
                    return;
                }

                PlaylistTrack playlistTrack = new PlaylistTrack();
                playlistTrack.setPlaylist(playlist);
                playlistTrack.setTrack(trackToAdd);
                playlistTrack.setIndex(getNextAvailableIndex(playlist.getId()));
                playlistTracksToAdd.add(playlistTrack);
            });

            if (playlistTracksToAdd.size() > 0)
            {
                playlistTrackRepo.saveAll(playlistTracksToAdd);

                playlist.getPlaylistTracks().addAll(playlistTracksToAdd);
            }
        }

        consolidateTrackIndexes(playlist.getPlaylistTracks());
    }

    // close up gaps in indexes, keeping ordering the same.
    public void consolidateTrackIndexes(Set<PlaylistTrack> playlistTracks)
    {
        long nextIndex = 0;

        for (PlaylistTrack playlistTrack : playlistTracks)
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
