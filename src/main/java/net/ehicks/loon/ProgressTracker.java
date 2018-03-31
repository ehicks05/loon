package net.ehicks.loon;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ProgressTracker
{
    public static Map<String, ProgressStatus> progressStatusMap = new ConcurrentHashMap<>();
}
