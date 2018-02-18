package net.ehicks.loon.routing;

public class RouteDescription
{
    private String tab1 = "";
    private String tab2 = "";
    private String tab3 = "";
    private String action = "";

    public RouteDescription(String tab1, String tab2, String tab3, String action)
    {
        this.tab1 = tab1;
        this.tab2 = tab2;
        this.tab3 = tab3;
        this.action = action;
    }

    @Override
    public String toString()
    {
        return "RouteDescription{" +
                "tab1='" + tab1 + '\'' +
                ", tab2='" + tab2 + '\'' +
                ", tab3='" + tab3 + '\'' +
                ", action='" + action + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RouteDescription that = (RouteDescription) o;

        if (!tab1.equals(that.tab1)) return false;
        if (!tab2.equals(that.tab2)) return false;
        if (!tab3.equals(that.tab3)) return false;
        return action.equals(that.action);
    }

    @Override
    public int hashCode()
    {
        int result = tab1.hashCode();
        result = 31 * result + tab2.hashCode();
        result = 31 * result + tab3.hashCode();
        result = 31 * result + action.hashCode();
        return result;
    }
}
