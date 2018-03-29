package net.ehicks.loon.routing;

public class RouteDescription
{
    private String path = "";

    public RouteDescription(String path)
    {
        this.path = path;
    }

    @Override
    public String toString()
    {
        return "RouteDescription{" +
                "path='" + path + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RouteDescription that = (RouteDescription) o;

        return path.equals(that.path);
    }

    @Override
    public int hashCode()
    {
        return path.hashCode();
    }
}
