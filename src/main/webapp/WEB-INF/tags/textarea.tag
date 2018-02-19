<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="t" uri="http://eric-hicks.com/loon/commontags" %>

<%@tag description="Textarea with Label" pageEncoding="UTF-8" %>
<%@attribute name="id" fragment="false" %>
<%@attribute name="value" fragment="false" required="false" %>
<%@attribute name="label" fragment="false" %>
<%@attribute name="placeholder" fragment="false" required="false" %>
<%@attribute name="horizontal" fragment="false" required="false"  %>
<%@attribute name="required" fragment="false" required="false"  %>
<%@attribute name="readOnly" fragment="false" required="false"  %>
<%@attribute name="rich" fragment="false" required="false"  %>

<c:set var="textareaCounter" value="${requestScope.textareaCounter + 1}" scope="request"/>
<c:if test="${textareaCounter == 1}">
    <c:if test="${rich}">
        <script src="https://cdn.ckeditor.com/4.8.0/basic/ckeditor.js"></script>
        <script>
            // CKEDITOR.disableAutoInline = true;
            // CKEDITOR.config.extraAllowedContent = 'div(*)';
        </script>
    </c:if>
</c:if>

<c:if test="${empty placeholder}">
    <c:set var="placeholder" value="${label}" />
</c:if>
<c:if test="${empty horizontal || horizontal}">
    <c:set var="isHorizontal" value="is-horizontal" />
</c:if>
<c:set var="readOnly" value="${readOnly ? 'readOnly' : ''}"/>
<c:set var="required" value="${required ? 'required' : ''}"/>


<div class="field ${isHorizontal}">
    <div class="field-label">
        <label class="label">${label}</label>
    </div>
    <div class="field-body">
        <div class="field">
            <div class="control">
                <textarea class="textarea" id="${id}" name="${id}" placeholder="${placeholder}" ${readOnly} ${required}>${value}</textarea>
            </div>
        </div>
    </div>
</div>

<c:if test="${rich}">
    <script>
        CKEDITOR.replace('${id}');
    </script>
</c:if>