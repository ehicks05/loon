<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@tag description="Text with Label" pageEncoding="UTF-8" %>
<%@attribute name="id" fragment="false" %>
<%@attribute name="value" fragment="false" required="false" %>
<%@attribute name="label" fragment="false" %>
<%@attribute name="placeholder" fragment="false" required="false" %>
<%@attribute name="horizontal" fragment="false" required="false"  %>
<%@attribute name="required" fragment="false" required="false"  %>
<%@attribute name="isStatic" fragment="false" required="false"  %>

<c:set var="selectCounter" value="${requestScope.selectCounter + 1}" scope="request"/>
<c:if test="${selectCounter == 1}">
    <script>

    </script>
</c:if>

<c:if test="${empty horizontal}">
    <c:set var="horizontal" value="${true}" />
</c:if>
<c:if test="${empty placeholder}">
    <c:set var="placeholder" value="${label}" />
</c:if>
<c:set var="required" value="${required ? 'required' : ''}" />
<c:set var="isStatic" value="${isStatic ? 'is-static' : ''}"/>

<c:if test="${!horizontal}">
    <div class="field">
        <label class="label">${label}</label>
        <div class="control">
            <input class="input ${isStatic}" type="text" placeholder="${label}" id="${id}" name="${id}" value="${value}" ${required}/>
        </div>
    </div>
</c:if>

<c:if test="${horizontal}">
    <div class="field is-horizontal">
        <div class="field-label">
            <label class="label">${label}</label>
        </div>
        <div class="field-body">
            <div class="control">
                <input class="input ${isStatic}" type="text" placeholder="${label}" id="${id}" name="${id}" value="${value}" ${required}/>
            </div>
        </div>
    </div>
</c:if>