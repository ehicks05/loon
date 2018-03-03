<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ct" uri="http://eric-hicks.com/loon/commontags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>
<jsp:useBean id="library" type="java.util.List<net.ehicks.loon.beans.Track>" scope="request"/>
<jsp:useBean id="from" type="java.lang.Integer" scope="request"/>

<script>
    <c:forEach var="track" items="${library}" varStatus="loop">
        playlistIndexToTrackInfo.push([
            <c:out value="${from + loop.index}" />,
            {
                id: '<c:out value="${track.id}" />',
                artist: '<c:out value="${track.artist}" />',
                title: '<c:out value="${track.title}" />',
                album: '<c:out value="${track.album}" />',
                duration: '<c:out value="${track.duration}" />',
                trackGain: '<c:out value="${track.trackGainLinear}" />',
                size: '<c:out value="${ct:fileSize(track.size)}" />',
                file: '${pageContext.request.contextPath}/media?id=${track.id}'
            }
        ]);
    </c:forEach>

    
    var playlistIndexToTrackInfoMap = new Map(playlistIndexToTrackInfo);
</script>

<c:set var="loopCount" value="0" />
<c:forEach var="track" items="${library}" varStatus="loop">
    <article class="media list-song" id="track${from + loop.index}" title="${track.trackGain}" onclick="player.skipTo(${from + loop.index})">
        <figure class="media-left">
            <table>
                <tr>
                    <td class="has-text-right" style="padding-right:10px;">${from + loop.count}.</td>
                    <td>
                        <figure class="image is-48x48">
                            <img src="${track.artwork.thumbnail.base64}" />
                        </figure>
                    </td>
                </tr>
            </table>
        </figure>
        <div class="media-content">
            <div class="content">
                <div>
                    <b>${track.title}</b>
                    <br />
                    ${track.artist} &centerdot; ${track.album}
                </div>
            </div>
        </div>

        <div class="media-right">
            ${track.formattedDuration}
        </div>
    </article>

    <c:set var="loopCount" value="${loopCount + 1}" />
</c:forEach>

<script>
    var from = from + ${loopCount};
</script>
<%--<c:if test="${haveMore}">--%>
    <%--<button id="loadMoreTracksButton" class="button" onclick="ajaxGetMoreTracks(${from + loopCount}, 100)">Load More...</button>--%>
<%--</c:if>--%>