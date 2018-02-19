package net.ehicks.loon;

import net.ehicks.loon.beans.Track;

import java.util.ArrayList;
import java.util.List;

public class Library
{
    public static List<Track> tracks = new ArrayList<>();

    public static List<Track> getTracks()
    {
        return tracks;
    }

    public static void setTracks(List<Track> tracks)
    {
        Library.tracks = tracks;
    }
}
