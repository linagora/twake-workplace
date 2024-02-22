# API Documentation:

- [Validate nickname](#validate-nickname)
- [Suggest nicknames](#suggest-nicknames)

## Validate nickname

### Description

This API endpoint allows users to validate a given nickname and check if it's available.

### Endpoint URL

```
/api/check-nickname
```

### HTTP Method

```
POST
```

### Request Parameters

#### Request Body

The request body should be in JSON format and include the following property:

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| nickname  | string | the nickname to check. |

Example:

```json
{
	"nickname": "kferjani"
}
```

### Response

The API endpoint returns the following response:

| Status Code | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| 200         | OK - The nickname is valid and is available.                  |
| 400         | Bad Request - Invalid nickname or nickname is already in use. |
| 500         | Internal error. something unexpected occured                  |

Example Response (Status Code: 200 - OK):

```
Status: 200 OK
Body: ok
```

### Error Handling

- Status Code 400: The endpoint will return a `400 Bad Request` status code in the following cases:
  - If the provided nickname is invalid (e.g., not in a valid format).
  - If the provided nickname is already in use by another user.
- Status code 500: Internal error

## Validate phone

### Description

This API endpoint allows users to validate a given phone and check if it's available.

### Endpoint URL

```
/api/check-phone
```

### HTTP Method

```
POST
```

### Request Parameters

#### Request Body

The request body should be in JSON format and include the following property:

| Parameter | Type   | Description         |
| --------- | ------ | ------------------- |
| phone     | string | the phone to check. |

Example:

```json
{
	"phone": "+21652222222"
}
```

### Response

The API endpoint returns the following response:

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| 200         | OK - The phone is valid and is available.            |
| 400         | Bad Request - Invalid phone or it is already in use. |
| 500         | Internal error. something unexpected occured         |

Example Response (Status Code: 200 - OK):

```
Status: 200 OK
Body: ok
```

### Error Handling

- Status Code 400: The endpoint will return a `400 Bad Request` status code in the following cases:
  - If the provided phone is invalid (e.g., not in a valid format).
  - If the provided phone is already in use by another user.
- Status code 500: Internal error

## Suggest nicknames

### Description

This API endpoint allows users get a list of suggested available nicknames using their first and last names.

### Endpoint URL

```
/api/suggest-nicknames
```

### HTTP Method

```
POST
```

### Request Parameters

#### Request Body

The request body should be in JSON format and include the following property:

| Parameter | Type   | Description         |
| --------- | ------ | ------------------- |
| firstname | string | the user firstname. |
| lastname  | string | the user lastname.  |

Example:

```json
{
	"firstname": "John",
	"lastname": "Doe"
}
```

### Response

The API endpoint returns the following response:

| Status Code | Description                                            |
| ----------- | ------------------------------------------------------ |
| 200         | OK - returns a list of suggested available nicknames   |
| 400         | Bad Request - missing or invalid firstname or lastname |
| 500         | Internal error. something unexpected occured           |

Example Response (Status Code: 200 - OK):

```json
Status: 200 OK
Body: [
    "john.doe",
    "john_doe",
    "doe.john",
    "john-doe",
    "doe"
]
```

### Error Handling

- Status Code 400: The endpoint will return a `400 Bad Request` status code in the following cases:
  - If the is not provided firstname or lastname
  - If the provided firstname or lastname is invalid.
- Status code 500: Internal error
