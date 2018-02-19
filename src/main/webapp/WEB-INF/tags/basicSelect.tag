<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ct" uri="http://eric-hicks.com/loon/commontags" %>

<%@tag description="Text with Label" pageEncoding="UTF-8" %>
<%@attribute name="id" fragment="false" %>
<%@attribute name="value" fragment="false" required="false" %>
<%@attribute name="items" fragment="false" type="java.util.List<net.ehicks.loon.ISelectTagSupport>" %>
<%@attribute name="label" fragment="false" %>
<%@attribute name="placeholder" fragment="false" required="false" %>
<%@attribute name="horizontal" fragment="false" required="false" %>
<%@attribute name="required" fragment="false" required="false" %>
<%@attribute name="blankLabel" fragment="false" required="false" %>
<%@attribute name="submitAction" fragment="false" %>

<c:set var="items" value="${ct:parseItemsForSelect(items)}" />

<c:set var="basicSelectCounter" value="${requestScope.basicSelectCounter + 1}" scope="request"/>
<c:if test="${basicSelectCounter == 1}">
    <script>
        function blurHandler(id)
        {
            var e = $('#' + id);
            var hidden = $('#' + id + 'prev');
            
            var newValue = e.val();
            var oldValue = hidden.val();
            if (newValue !== oldValue)
            {
                update(id, newValue, '${submitAction}');
                hidden.val(newValue);
            }
        }
    </script>
</c:if>

<c:if test="${empty placeholder}">
    <c:set var="placeholder" value="${label}" />
</c:if>
<c:if test="${empty horizontal || horizontal}">
    <c:set var="isHorizontal" value="is-horizontal" />
</c:if>

<div class="field ${isHorizontal}">
    <div class="field-label">
        <label class="label">${label}</label>
    </div>
    <div class="field-body">
        <div class="control">
            <div class="select">
                <input type="hidden" id="${id}prev" value="${value}" />
                <select id="${id}" name="${id}" <c:if test="${required}">required</c:if> onblur="blurHandler(this.id)">
                    <c:if test="${!required}">
                        <option value="">${blankLabel}</option>
                    </c:if>
                    <c:forEach var="item" items="${items}">
                        <c:set var="selected" value="${item.value eq value ? 'selected' : ''}" />
                        <option value="${item.value}" ${selected}>${item.text}</option>
                    </c:forEach>
                </select>
            </div>
        </div>
    </div>
</div>