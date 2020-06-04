
const csrfHeader = document.head.querySelector("[name~=_csrf_header][content]").content;
const csrfToken = document.head.querySelector("[name~=_csrf][content]").content;

const myHeaders = new Headers();
myHeaders.append(csrfHeader, csrfToken);

function superFetch(url, options) {
    options.headers = myHeaders;
    return fetch(url, options);
}

export default superFetch;