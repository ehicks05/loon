package net.ehicks.loon;

import java.io.IOException;
import java.text.ParseException;

public abstract class SearchForm
{
    private Long id = 0L;
    private String sortColumn = "";
    private String sortDirection = "";
    private String page = "";

    public SearchForm()
    {
        this.sortColumn = "object_key";
        this.sortDirection = "asc";
        this.page = "1";
    }

    public abstract String getEndpoint();

    public abstract SearchResult getSearchResult() throws IOException, ParseException;

    // -------- Getters / Setters ----------
    public String getSortColumn()
    {
        return sortColumn;
    }

    public void setSortColumn(String sortColumn)
    {
        this.sortColumn = sortColumn;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getSortDirection()
    {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection)
    {
        this.sortDirection = sortDirection;
    }

    public String getPage()
    {
        return page;
    }

    public void setPage(String page)
    {
        this.page = page;
    }
}
