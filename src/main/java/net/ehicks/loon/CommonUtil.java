package net.ehicks.loon;

public class CommonUtil
{
    public static String escapeForFileSystem(String input)
    {
        String escaped = input.replaceAll("[\\?\"#:/;|*\\\\]", "-"); // replace ?"#:/;|*\
        escaped = escaped.replaceAll("[\\\\?\"\\]\\[<>]", ""); // replace \][<>

        while (escaped.endsWith("."))
            escaped = escaped.substring(0, escaped.length() - 1);

        return escaped;
    }
}
