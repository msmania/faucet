export function IsErrorResponse(resp) {
  const type = typeof(resp);
  if (type == 'object') {
    if (!resp) {
      // Null is a valid response
      return false;
    }
    return 'message' in resp;
  }

  return false;
}

export function GetJsonFetcher(cacheMode, payloadGetter) {
  return async (url) => {
    const payload = payloadGetter();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: cacheMode,
      });

      const body = await res.text();
      return JSON.parse(body);
    }
    catch (e) {
      return {
        message: `Failed to get the response: '${e.message}'`,
      };
    }
  }
}
