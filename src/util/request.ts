enum RequestMethod {
    GET
}

interface ResponseInterface<T> {
    status: number;
    statusText: string;
    response: T;
    request: XMLHttpRequest;
}

function createRequest(method: RequestMethod, url: string): XMLHttpRequest {
    const request = new XMLHttpRequest();
    request.open(RequestMethod[method], url);

    return request;
}

function sendRequest<T>(request: XMLHttpRequest): Promise<ResponseInterface<T>> {
    return new Promise(function(resolve, reject) {
        request.addEventListener("load", function() {
            resolve({
                status: request.status,
                statusText: request.statusText,
                response: request.response,
                request: request,
            });
        });

        request.addEventListener("error", reject);

        request.send();
    });
}

function throwHttpError<T>(url: string, response: ResponseInterface<T>): void {
    if (response.status >= 400) {
        throw new Error(
            `HTTP error on requesting '${url}' with response code ${response.status}: '${response.statusText}'`
        );
    }
}

export function getJSON<T>(url: string): Promise<T> {
    const request = createRequest(RequestMethod.GET, url);
    request.responseType = "json";

    return sendRequest<T>(request)
        .then(function(response) {
            throwHttpError(url, response);

            return response.response;
        });
}

export function getRaw(url: string): Promise<ArrayBuffer> {
    const request = createRequest(RequestMethod.GET, url);
    request.responseType = "arraybuffer";

    return sendRequest<ArrayBuffer>(request)
        .then(function(response) {
            throwHttpError(url, response);

            return response.response;
        });
}
