package net.ehicks.loon;

public class CommonUtil
{
    public static String escapeForFileSystem(String input)
    {
        String escaped = input.replaceAll("[\\?\"#:/;<>|*\\\\]", "-");
        escaped = escaped.replaceAll("[\\\\?\"\\]\\[]", "");

        while (escaped.endsWith("."))
            escaped = escaped.substring(0, escaped.length() - 1);

        return escaped;
    }
}
