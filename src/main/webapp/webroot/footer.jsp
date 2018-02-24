<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>

<span title="Rendered in ${userSession.currentTimeMillis - userSession.enteredController} ms">

</span>

<c:remove var="lastRequestDuration" scope="session" />