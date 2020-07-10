# Errors

The Vyte API uses the following error codes:

Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request was somehow incorrect. Make sure you include the right parameters in the query, body or headers
401 | Unauthorized -- This request requires to be authenticated and you are not
403 | Forbidden -- You are authenticated but you are not allowed to perform this Request
404 | Resource not found -- We couldn't find the resource you are trying to access
500 | Internal server error -- For some reason your request triggered an internal error in our API. Contact us to know more about it.
503 | Request timed out -- Our API servers didn't respond in time and the request timed out. If this happens repeatedly, contact us.
