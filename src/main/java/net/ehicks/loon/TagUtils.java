package net.ehicks.loon;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TagUtils
{
    public static Date longToDate(long input)
    {
        return new Date(input);
    }

    public static String formatZonedDateTime(ZonedDateTime zonedDateTime)
    {
        return zonedDateTime.format(DateTimeFormatter.RFC_1123_DATE_TIME);
    }

    private static List<ISelectTagSupport> stringToISelectTag(String input)
    {
        int indexOfPipe = input.indexOf("|");
        String delimiter = ",";
        if (indexOfPipe != -1)
            delimiter = "|";
        List<ISelectTagSupport> selectTagObjects = new ArrayList<>();
        for (String item : input.split(delimiter))
        {
            selectTagObjects.add(stringToSelectTagObject(item));
        }
        return selectTagObjects;
    }

    private static SelectTagObject stringToSelectTagObject(String item)
    {
        boolean compound = item.contains("=");
        String value = item;
        String text = item;
        if (compound)
        {
            value = item.split("=")[0];
            text = item.split("=")[1];
        }
        return new SelectTagObject(value, text);
    }

    public static List<ISelectTagSupport> parseItemsForSelect(Object items)
    {
        if (items == null)
            return null;
        if (items instanceof String)
        {
            return stringToISelectTag((String) items);
        }
        if (items instanceof List)
        {
            List itemsList = (List) items;
            if (itemsList.size() == 0)
                return itemsList;
            if (itemsList.get(0) instanceof ISelectTagSupport)
                return (List<ISelectTagSupport>) items;
            if (itemsList.get(0) instanceof String)
            {
                List<ISelectTagSupport> selectTagObjects = new ArrayList<>();
                for (Object item : itemsList)
                    selectTagObjects.add(stringToSelectTagObject((String) item));
                return selectTagObjects;
            }
        }

        return null;
    }

    private static class SelectTagObject implements ISelectTagSupport
    {
        String value = "";
        String text = "";

        public SelectTagObject(String value, String text)
        {
            this.value = value;
            this.text = text;
        }

        @Override
        public String getValue()
        {
            return value;
        }

        @Override
        public String getText()
        {
            return text;
        }
    }
}
