package net.ehicks.loon;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Node
{
    @JsonIgnore
    private Path path;
    private String label;
    private String value;
    @JsonIgnore
    private boolean checked;
    private List<Node> children;

    public Node()
    {
    }

    public Node(Path path, String label, String value)
    {
        this.path = path;
        this.label = label;
        this.value = value;
    }

    public void addChild(Node child)
    {
        if (children == null)
            children = new ArrayList<>();
        children.add(child);
    }

    public Node getChildByTitle(String title)
    {
        if (children == null)
            return null;

        return children.stream()
                .filter(node -> node.label.equals(title))
                .findFirst().orElse(null);
    }

    @Override
    public String toString()
    {
        return "Node " +
                "path='" + path + '\'' +
                "label='" + label + '\'' +
                ", value='" + value + '\'' +
                ", checked='" + checked + '\'' +
                ", children=" + children +
                "";
    }

    public Path getPath()
    {
        return path;
    }

    public void setPath(Path path)
    {
        this.path = path;
    }

    public String getLabel()
    {
        return label;
    }

    public void setLabel(String label)
    {
        this.label = label;
    }

    public String getValue()
    {
        return value;
    }

    public void setValue(String value)
    {
        this.value = value;
    }

    public boolean isChecked()
    {
        return checked;
    }

    public void setChecked(boolean checked)
    {
        this.checked = checked;
    }

    public List<Node> getChildren()
    {
        return children;
    }

    public void setChildren(List<Node> children)
    {
        this.children = children;
    }
}