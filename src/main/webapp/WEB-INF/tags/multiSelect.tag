<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ct" uri="http://eric-hicks.com/loon/commontags" %>

<%@tag description="Multi Select Tag" pageEncoding="UTF-8" %>
<%@attribute name="id" fragment="false" %>
<%@attribute name="items" fragment="false" type="java.util.List<net.ehicks.loon.ISelectTagSupport>" %>
<%@attribute name="selectedValues" fragment="false" %>
<%@attribute name="placeHolder" fragment="false" %>

<c:set var="items" value="${ct:parseItemsForSelect(items)}" />

<c:set var="multiSelectCounter" value="${requestScope.multiSelectCounter + 1}" scope="request"/>
<c:if test="${multiSelectCounter == 1}">
    <script>

    </script>
</c:if>

<select id="${id}" name="${id}" class="js-example-basic-multiple" multiple>
    <c:forEach var="item" items="${items}">
        <c:set var="selected" value=""/>
        <c:if test="${selectedValues.contains(item.value)}">
            <c:set var="selected" value="selected"/>
        </c:if>

        <option value="${item.value}" ${selected}>${item.text}</option>
    </c:forEach>
</select>
<script>
    $(function() {
        $('#${id}').select2({
            placeholder: "${placeHolder}"
        });
    });
</script>
