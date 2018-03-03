<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ct" uri="http://eric-hicks.com/loon/commontags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>

<c:set var="from" value="0"/>
<c:forEach var="track" items="${library}" varStatus="loop">
    <tr id="track${loop.index}" class="list-song" title="${track.trackGain}" onclick="player.skipTo(${loop.index})">
        <td class="has-text-right" style="width:1px;">
                ${loop.count}.
        </td>
        <td class="has-text-right">
            <figure class="image is-48x48">
                <img src="${track.artwork.thumbnail.base64}" />
            </figure>
        </td>
        <td>
            <b>${track.title}</b>
            <br>
                ${track.artist} &centerdot; ${track.album}
        </td>
        <td class="has-text-right">
                ${track.formattedDuration}
        </td>

        <c:set var="from" value="${from + 1}" />
    </tr>
</c:forEach>
<c:if test="${haveMore}">
    <tr>
        <td class="has-text-right" style="width:1px;">
        </td>
        <td class="has-text-right">
        </td>
        <td>
            <button class="button" onclick="ajaxGetMoreTracks(${from}, 100)">Load More...</button>
        </td>
        <td class="has-text-right">
        </td>
    </tr>
</c:if>