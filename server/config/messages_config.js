var MessagesConfig = `{
    "0100005000101": {
        "statusCode": 500,
        "messageType": "InternalServerError",
        "messageCode": "0100005000101",
        "internalMessage": "",
        "message": "Internal Server Error",
        "messageDetail": "An unknown internal error occurred. If the error persists, please contact service provider to figure out what has happened and how to fix it.",
    },
    "0100004010101": {
        "statusCode": 401,
        "messageType": "Unauthorized",
        "messageCode": "0100004010101",
        "internalMessage": "Headers not found, or header doesn't have Authorization",
        "message": "Unauthorized",
        "messageDetail":  "Any case where a parameter is invalid, or a required parameter is missing. Please check the data you are trying to send."
    },
    "0100004010102": {
        "statusCode": 401,
        "messageType": "Unauthorized",
        "messageCode": "0100004010102",
        "internalMessage": "Unable to verify token",
        "message": "Unauthorized",
        "messageDetail":  "Any case where a parameter is invalid, or a required parameter is missing. Please check the data you are trying to send."
    },
    "0100004010103": {
        "statusCode": 401,
        "messageType": "Unauthorized",
        "messageCode": "0100004010103",
        "internalMessage": "User doesn't exists",
        "message": "Unauthorized",
        "messageDetail":  "Any case where a parameter is invalid, or a required parameter is missing. Please check the data you are trying to send."
    },
    "0100004010104": {
        "statusCode": 401,
        "messageType": "Unauthorized",
        "messageCode": "0100004010104",
        "internalMessage": "Unknown user",
        "message": "Unauthorized",
        "messageDetail":  "Any case where a parameter is invalid, or a required parameter is missing. Please check the data you are trying to send."
    },
    "0100004010105": {
        "statusCode": 401,
        "messageType": "Unauthorized",
        "messageCode": "0100004010105",
        "internalMessage": "User's permission isn't high enough",
        "message": "Unauthorized",
        "messageDetail":  "Any case where a parameter is invalid, or a required parameter is missing. Please check the data you are trying to send."
    },
}`