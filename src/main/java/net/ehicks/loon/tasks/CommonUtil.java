package net.ehicks.loon.tasks;

public class CommonUtil
{
    public static String escapeForFileSystem(String input)
    {
        String escaped = input.replaceAll("[\\?\"#:/;|*\\\\]", "-"); // replace ?"#:/;|*\
        escaped = escaped.replaceAll("[\\\\?\"\\]\\[<>]", ""); // replace \][<>
        escaped = escaped.replaceAll(" & ", " and ");

        while (escaped.endsWith("."))
            escaped = escaped.substring(0, escaped.length() - 1);

        return escaped;
    }
}
