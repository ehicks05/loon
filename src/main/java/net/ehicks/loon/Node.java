package net.ehicks.loon;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Node
{
    Path path;
    String text;
    int id;
    boolean folder;
    boolean checked;
    List<Node> children = new ArrayList<>();

    public Node(Path path, String text, int id, boolean folder)
    {
        this.path = path;
        this.text = text;
        this.id = id;
        this.folder = folder;
    }

    public static class ReactCheckboxTreeSerializer implements JsonSerializer<Node>
    {
        @Override
        public JsonElement serialize(Node src, Type typeOfSrc, JsonSerializationContext context)
        {
            JsonObject jsonNode = new JsonObject();

            jsonNode.addProperty("label", src.text);
            jsonNode.addProperty("value", String.valueOf(src.id));

            if (!src.children.isEmpty())
            {
                TypeToken<List<Node>> typeDescription = new TypeToken<List<Node>>() {};
                JsonElement members = context.serialize(src.children, typeDescription.getType());
                jsonNode.add("children", members);
            }

            return jsonNode;
        }
    }

    public Optional<Node> getDescendantById(int id)
    {
        if (this.id == id) return Optional.of(this);

        Optional<Node> node;

        for (Node child : children)
        {
            node = child.getDescendantById(id);
            if (node.isPresent())
                return node;
        }

        return Optional.empty();
    }

    public Node getChildByTitle(String title)
    {
        return children.stream()
                .filter(node -> node.text.equals(title))
                .findFirst().orElse(null);
    }

    @Override
    public String toString()
    {
        return "Node " +
                "path='" + path + '\'' +
                "text='" + text + '\'' +
                ", id='" + id + '\'' +
                ", folder='" + folder + '\'' +
                ", checked='" + checked + '\'' +
                ", children=" + children +
                "";
    }
}