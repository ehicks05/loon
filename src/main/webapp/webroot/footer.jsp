<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:if test="${!empty userSession}">
    <jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>
</c:if>

<footer class="footer">
    <div class="container">
        <div class="content has-text-centered">
            <p>
                &centerdot; <strong>${loonSystem.instanceName}</strong>
                &centerdot; <strong>Puffin</strong> by <a href="http://ehicks.net">Eric Hicks</a>
            </p>
            <p>build <span title="${userSession.systemInfo.gitVersion}">${userSession.systemInfo.version}</span>
            </p>
            <p>
                <c:if test="${!empty sessionScope.userSession}">
                    Page rendered in ${userSession.currentTimeMillis - userSession.enteredController} ms
                </c:if>
            </p>
        </div>
    </div>
</footer>

<c:remove var="lastRequestDuration" scope="session" />