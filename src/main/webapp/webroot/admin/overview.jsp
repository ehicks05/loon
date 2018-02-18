<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Administration
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-mobile is-centered is-gapless">
            <c:forEach var="adminSubscreen" items="${userSession.systemInfo.adminSubscreens}">
                <div class="column has-text-centered">
                    <a href="${pageContext.request.contextPath}/${adminSubscreen[0]}">
                        <div class="box has-text-link">
                            <span class="icon is-large">
                                <i class="fas fa-3x fa-${adminSubscreen[1]}"></i>
                            </span>
                            <br>${adminSubscreen[2]}
                        </div>
                    </a>
                </div>
            </c:forEach>
            <style>.box:hover{background-color: lightgrey}</style>
        </div>
    </div>
</section>

<jsp:include page="../footer.jsp"/>
</body>
</html>