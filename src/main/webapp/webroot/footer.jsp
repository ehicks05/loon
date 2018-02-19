<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>

<footer class="footer">
    <div class="container">
        <div class="content has-text-centered">
            <p>
                <strong>${loonSystem.instanceName}</strong>
                &centerdot; <strong>Loon</strong> by <a href="http://ehicks.net">Eric Hicks</a>
            </p>
            <p>v<span title="${userSession.systemInfo.gitVersion}">${userSession.systemInfo.version}</span>
                - <c:if test="${!empty sessionScope.userSession}">
                    Rendered in ${userSession.currentTimeMillis - userSession.enteredController} ms
                </c:if>
            </p>
        </div>
    </div>
</footer>

<c:remove var="lastRequestDuration" scope="session" />