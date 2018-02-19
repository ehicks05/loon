<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@tag description="Sortable Cell Tag" pageEncoding="UTF-8" %>
<%@attribute name="code" fragment="false" %>
<%@attribute name="label" fragment="false" %>
<%@attribute name="style" fragment="false" %>
<%@attribute name="cssClass" fragment="false" %>
<%@attribute name="searchForm" fragment="false" type="net.ehicks.loon.SearchForm" %>

<c:set var="sortableCellCounter" value="${requestScope.sortableCellCounter + 1}" scope="request"/>
<c:if test="${sortableCellCounter == 1}">

</c:if>

<c:if test="${code == searchForm.sortColumn}">
    <c:if test="${searchForm.sortDirection == 'asc'}"><c:set var="sortIcon" value="&#9650;"/></c:if>
    <c:if test="${searchForm.sortDirection == 'desc'}"><c:set var="sortIcon" value="&#9660;"/></c:if>
</c:if>

<th id="${code}${searchForm.id}" class="nowrap ${cssClass}" style="${style}"
    onclick="ajaxItems(this.id, '${pageContext.servletConfig.servletContext.contextPath}', '${searchForm.endpoint}', '${searchForm.id}', 0, '${code}', '${searchForm.sortDirection}');">
    ${label}
    <span>${sortIcon}</span>
</th>