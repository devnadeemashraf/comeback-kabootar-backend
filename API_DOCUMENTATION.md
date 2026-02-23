# API Documentation

This document describes all HTTP endpoints for the Comeback Kabootar backend. Use it to integrate the client (web or mobile) with the API.

---

## Base URL & Conventions

- **Base URL:** `http://localhost:3000` (or your deployed backend URL).
- **API prefix:** All documented endpoints live under `/api/v1/`.
- **JSON:** Request and response bodies use `Content-Type: application/json` unless noted.
- **Auth:** Most endpoints require a valid session cookie (see [Authentication](#authentication)). Send cookies with `credentials: 'include'` (or equivalent) for same-origin or configured CORS.

### Response contract

Every JSON response follows one of two shapes:

**Success**

```json
{
  "success": true,
  "data": <payload>
}
```

**Error**

```json
{
  "success": false,
  "error": {
    "message": "Human-readable message",
    "code": "OPTIONAL_CODE"
  }
}
```

- **Success:** `data` holds the result; HTTP status is `200`, `201`, or `204` (no body for `204`).
- **Error:** `error.message` is always present; `error.code` is optional and can be used for i18n or client logic. Typical status codes: `401` Unauthorized, `404` Not Found, `422` Validation/Domain error, `500` Internal Server Error.

---

## Health

### GET `/api/v1/health`

Checks that the API is up. No authentication required.

**Request**

- **Method:** `GET`
- **Headers:** None required.
- **Body:** None.

**Response**

- **Status:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-02-23T12:00:00.000Z"
  }
}
```

---

## Authentication

All auth routes are under `/api/v1/auth`. Session is maintained via an HTTP-only cookie set by the server after a successful Google login.

### GET `/api/v1/auth/google`

Starts the Google OAuth flow. The user should be redirected to this URL (e.g. “Sign in with Google” button).

**Request**

- **Method:** `GET`
- **Headers:** None required.
- **Body:** None.

**Response**

- **Status:** `302 Found`
- **Headers:** `Location` → Google’s authorization URL. A `state` cookie is set for CSRF protection.
- **Body:** None (redirect).

**Client:** Redirect the user to the returned `Location` URL (or open it in the same window). After the user signs in with Google, they will be sent to the callback URL below.

---

### GET `/api/v1/auth/google/callback`

Google redirects here after the user authorizes. Handled by the server; the client does not call this URL directly except as the redirect target.

**Request**

- **Method:** `GET`
- **Query parameters (required):**
  - `code` (string) – Authorization code from Google.
  - `state` (string) – Must match the `state` cookie set at `/auth/google`.
- **Cookies:** Session `state` cookie from the start of the flow.

**Response (success)**

- **Status:** `302 Found`
- **Headers:** `Location` → frontend URL (e.g. app home). Session cookie is set (JWT).
- **Body:** None (redirect).

**Response (validation error)**

- **Status:** `422 Unprocessable Entity`
- **Body:**

```json
{
  "success": false,
  "error": {
    "message": "Invalid callback parameters",
    "code": "INVALID_CALLBACK"
  }
}
```

**Client:** Configure your OAuth client with this callback URL. After success, the server redirects to the frontend; the frontend can then call `GET /api/v1/auth/me` to get the current user.

---

### GET `/api/v1/auth/me`

Returns the currently authenticated user. Requires a valid session cookie.

**Request**

- **Method:** `GET`
- **Headers:** None (session sent via cookie).
- **Cookies:** Session cookie (set after Google callback).

**Response (success)**

- **Status:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

**Response (not authenticated)**

- **Status:** `401 Unauthorized`
- **Body:**

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized",
    "code": "MISSING_TOKEN"
  }
}
```

---

### POST `/api/v1/auth/logout`

Clears the session cookie. Does not require authentication.

**Request**

- **Method:** `POST`
- **Headers:** None required.
- **Body:** None.

**Response**

- **Status:** `204 No Content`
- **Body:** None. Session cookie is cleared.

---

## Templates

All template routes are under `/api/v1/templates`. **Every template endpoint requires authentication** (session cookie). The authenticated user is treated as the template **author**; all mutations are scoped to that author.

**Template resource (in responses):**

```ts
{
  id: string;           // UUID
  authorId: string;     // UUID of the owner
  title: string;
  subject: string;
  body: string;
  attachments: Array<{ key: string; name: string }>;
  status: "draft" | "ready";
  isPublic: boolean;
  forkCount: number;
  starCount: number;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

**Tier limits:** Free users can have up to **2 attachments** per template; premium users up to **10**. The API returns `422` with code `ATTACHMENT_LIMIT` when the limit is exceeded.

---

### GET `/api/v1/templates`

Lists all templates for the authenticated user (author).

**Request**

- **Method:** `GET`
- **Headers:** None (auth via cookie).
- **Body:** None.

**Response (success)**

- **Status:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "data": [
    {
      "id": "template-uuid",
      "authorId": "user-uuid",
      "title": "Follow-up",
      "subject": "Re: Application",
      "body": "Hello...",
      "attachments": [],
      "status": "draft",
      "isPublic": false,
      "forkCount": 0,
      "starCount": 0,
      "createdAt": "2025-02-23T12:00:00.000Z",
      "updatedAt": "2025-02-23T12:00:00.000Z"
    }
  ]
}
```

`data` is an array of template objects; it may be empty.

---

### GET `/api/v1/templates/:id`

Returns a single template by ID. Only the author can access it.

**Request**

- **Method:** `GET`
- **Path parameters:**
  - `id` (string) – Template UUID.
- **Headers:** Auth via cookie.

**Response (success)**

- **Status:** `200 OK`
- **Body:** `{ "success": true, "data": <template> }`

**Response (not found or not owner)**

- **Status:** `404 Not Found`
- **Body:**

```json
{
  "success": false,
  "error": { "message": "Template not found" }
}
```

**Response (validation)**

- **Status:** `422 Unprocessable Entity` – e.g. invalid `id` (not a UUID).
- **Body:** `{ "success": false, "error": { "message": "...", "code": "INVALID_PARAMS" } }`

---

### POST `/api/v1/templates`

Creates a new template. The template is created in **draft** status.

**Request**

- **Method:** `POST`
- **Headers:** `Content-Type: application/json`, plus auth cookie.
- **Body:**

```json
{
  "title": "string (required, non-empty)",
  "subject": "string (required, non-empty)",
  "body": "string (required, non-empty)",
  "attachments": [{"key": "string", "name": "string"}],
  "isPublic": false
}
```

- `attachments`: optional; default `[]`. Max length 10 in schema; actual limit is 2 (free) or 10 (premium) enforced by the server.
- `isPublic`: optional; default `false`.

**Response (success)**

- **Status:** `201 Created`
- **Body:** `{ "success": true, "data": <template> }` with the new template (including `id`, `status: "draft"`, timestamps).

**Response (validation)**

- **Status:** `422 Unprocessable Entity` – missing/invalid fields or attachment limit exceeded.
- **Body:** `{ "success": false, "error": { "message": "...", "code": "ATTACHMENT_LIMIT" } }` (or similar).

---

### PATCH `/api/v1/templates/:id`

Updates an existing template. Only the author can update. Partial update: send only the fields you want to change.

**Request**

- **Method:** `PATCH`
- **Path parameters:** `id` – Template UUID.
- **Headers:** `Content-Type: application/json`, auth cookie.
- **Body (all fields optional):**

```json
{
  "title": "string",
  "subject": "string",
  "body": "string",
  "attachments": [{"key": "string", "name": "string"}],
  "isPublic": true
}
```

Attachment count must stay within tier limit (2 free / 10 premium).

**Response (success)**

- **Status:** `200 OK`
- **Body:** `{ "success": true, "data": <template> }` with the updated template.

**Response (not found)**

- **Status:** `404 Not Found`
- **Body:** `{ "success": false, "error": { "message": "Template not found" } }`

**Response (validation)**

- **Status:** `422` – invalid params or body (e.g. attachment limit).
- **Body:** `{ "success": false, "error": { "message": "...", "code": "..." } }`

---

### DELETE `/api/v1/templates/:id`

Deletes a template. Only the author can delete. Hard delete (no soft delete).

**Request**

- **Method:** `DELETE`
- **Path parameters:** `id` – Template UUID.
- **Headers:** Auth cookie.

**Response (success)**

- **Status:** `204 No Content`
- **Body:** None.

**Response (not found)**

- **Status:** `404 Not Found`
- **Body:** `{ "success": false, "error": { "message": "Template not found" } }`

---

### POST `/api/v1/templates/:id/finalize`

Moves a template from **draft** to **ready** (publish). Attachment count must be within tier limit.

**Request**

- **Method:** `POST`
- **Path parameters:** `id` – Template UUID.
- **Headers:** Auth cookie.
- **Body:** None.

**Response (success)**

- **Status:** `200 OK`
- **Body:** `{ "success": true, "data": <template> }` with `status: "ready"`.

**Response (not found)**

- **Status:** `404 Not Found`
- **Body:** `{ "success": false, "error": { "message": "Template not found" } }`

**Response (validation)**

- **Status:** `422` – e.g. attachment count exceeds tier limit.
- **Body:** `{ "success": false, "error": { "message": "...", "code": "ATTACHMENT_LIMIT" } }`

---

### Attachment upload: end-to-end flow

Attachments are **not** sent through the backend. The backend only issues a **presigned URL**; the client uploads the file **directly to object storage (MinIO/S3)**. This keeps server load and bandwidth low and scales well.

#### Step 1: Get a presigned URL

- **Request:** `POST /api/v1/templates/:id/attachments/presign` with body `{ "fileName": "document.pdf", "contentType": "application/pdf" }` (see endpoint below).
- **Response:** `{ "url": "<presigned-put-url>", "key": "templates/..." }`.
- Store `url` and `key` for the next steps.

#### Step 2: Upload the file to the presigned URL

The **client** performs a **single HTTP PUT** to the `url` received in step 1.

- **Method:** `PUT`
- **URL:** The `url` from the presign response (full URL; do not add path or query).
- **Headers:**
  - `Content-Type`: optional but recommended; use the same value you sent in the presign request (e.g. `application/pdf`).
  - Do **not** send your session cookie or API auth to this URL—the URL itself is already authorized. The request goes **directly to MinIO/S3**, not to the Comeback Kabootar backend.
- **Body:** The raw file bytes (e.g. `Blob`, `File`, or `ArrayBuffer` in the browser; `Buffer` or stream in Node).

**Example (browser):**

```js
const file = document.querySelector('input[type="file"]').files[0];
const response = await fetch(presignData.url, {
  method: 'PUT',
  headers: { 'Content-Type': file.type || 'application/octet-stream' },
  body: file,
});
if (!response.ok) throw new Error('Upload failed');
```

- **Success:** Storage returns `200 OK` (or `204`). The file is now in MinIO; the backend still does **not** have the file and does **not** know the upload finished until you call the “complete” endpoint.

#### Step 3: Report completion to the backend

After the PUT to the presigned URL succeeds:

- **Request:** `POST /api/v1/templates/:id/attachments/complete` with body `{ "key": "<key from presign>", "name": "My Document.pdf" }`.
- The backend adds this attachment to the template’s `attachments` array.

---

### POST `/api/v1/templates/:id/attachments/presign`

Returns a presigned URL and metadata so the client can upload one file directly to object storage (MinIO/S3).

**Request**

- **Method:** `POST`
- **Path parameters:** `id` – Template UUID.
- **Headers:** `Content-Type: application/json`, auth cookie.
- **Body:**

```json
{
  "fileName": "string (required)",
  "contentType": "string (optional, e.g. application/pdf)"
}
```

**Response (success)**

- **Status:** `200 OK`
- **Body:**

```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "key": "templates/<templateId>/<unique-key>"
  }
}
```

- **url:** Use this URL to upload the file: send a **PUT** request with the file as the body (see [Attachment upload: end-to-end flow](#attachment-upload-end-to-end-flow)).
- **key:** Send this in the “attachment complete” request and when deleting the attachment.
**Response (not found)**

- **Status:** `404 Not Found` – template not found or not owned.

**Response (validation)**

- **Status:** `422` – e.g. attachment limit reached for your tier.
- **Body:** `{ "success": false, "error": { "message": "...", "code": "ATTACHMENT_LIMIT" } }`

---

### POST `/api/v1/templates/:id/attachments/complete`

Called after the client has successfully uploaded a file to the presigned URL. Adds the attachment to the template’s `attachments` array.

**Request**

- **Method:** `POST`
- **Path parameters:** `id` – Template UUID.
- **Headers:** `Content-Type: application/json`, auth cookie.
- **Body:**

```json
{
  "key": "string (required, from presign response)",
  "name": "string (required, display name)"
}
```

**Response (success)**

- **Status:** `204 No Content`
- **Body:** None.

**Response (not found)**

- **Status:** `404 Not Found` – template not found or not owned.

**Response (validation)**

- **Status:** `422` – e.g. attachment limit reached.
- **Body:** `{ "success": false, "error": { "message": "...", "code": "ATTACHMENT_LIMIT" } }`

---

### DELETE `/api/v1/templates/:id/attachments/:key`

Removes an attachment from the template and deletes the object from storage. `key` must be URL-encoded if it contains special characters (e.g. slashes).

**Request**

- **Method:** `DELETE`
- **Path parameters:**
  - `id` – Template UUID.
  - `key` – Object key (from presign/complete). URL-encode if needed.
- **Headers:** Auth cookie.

**Response (success)**

- **Status:** `204 No Content`
- **Body:** None.

**Response (not found)**

- **Status:** `404 Not Found` – template not found, not owner, or attachment with that `key` not found.
- **Body:** `{ "success": false, "error": { "message": "Template not found" } }` (or “Attachment not found”).

---

## Error codes (reference)

| Code              | Typical HTTP | Meaning                          |
|-------------------|-------------|----------------------------------|
| `MISSING_TOKEN`   | 401         | No session cookie                |
| `INVALID_TOKEN`   | 401         | Invalid or expired session       |
| `INVALID_PARAMS`  | 422         | Invalid path/query/body params   |
| `VALIDATION_ERROR` | 422       | General validation failure       |
| `ATTACHMENT_LIMIT`| 422         | Attachment count exceeds tier    |
| `INVALID_CALLBACK`| 422         | OAuth callback params invalid    |

---

**Comeback Kabootar API** • For detailed response types and error handling, rely on the response contract above and the status codes and `error.code` values returned by the server.
