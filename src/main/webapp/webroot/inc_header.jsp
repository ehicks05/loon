<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="loonSystem" type="net.ehicks.loon.beans.LoonSystem" scope="application"/>

<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="utf-8" />

<%-- JQuery --%>
<script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>
<%-- JQuery --%>

<%-- spin.js --%>
<script src="${pageContext.request.contextPath}/js/spin.min.js"></script>
<%-- spin.js --%>

<%-- qTip2 --%>
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.css">
<script src="http://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js"></script>
<%-- qTip2 --%>

<%-- Bulma --%>
<c:if test="${empty loonSystem.theme || loonSystem.theme eq 'default'}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
</c:if>
<c:if test="${!empty loonSystem.theme && !(loonSystem.theme eq 'default')}">
    <link rel="stylesheet" href="https://unpkg.com/bulmaswatch/${loonSystem.theme}/bulmaswatch.min.css">
</c:if>
<%-- Bulma --%>

<%-- Font Awesome --%>
<script defer src="https://use.fontawesome.com/releases/v5.0.4/js/all.js"></script>
<%-- Font Awesome --%>

<link rel="shortcut icon" href="${pageContext.request.contextPath}/images/puffin.png">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/style.css" media="screen" />
<script src="${pageContext.request.contextPath}/js/util.js"></script>
<script src="${pageContext.request.contextPath}/js/ajaxUtil.js"></script>