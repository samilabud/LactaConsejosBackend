# LactaConsejos API Documentation

Base URL: `https://lactaconsejosws.onrender.com`

This API provides endpoints to retrieve articles and posts for display in your application.

## Endpoints

### 1. Get All Articles (Recent)
Retrieves the 50 most recent articles.

- **URL:** `/articles/`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of article objects.

**Example Request (JavaScript):**
```javascript
fetch('https://lactaconsejosws.onrender.com/articles/')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Response Structure:**
```json
[
  {
    "_id": "65466946ce3f103a641c6177",
    "title": "Article Title",
    "content": "HTML content...",
    "category": "Category Name",
    "image": "base64_string_or_url",
    "date": "2023-11-04T...",
    "modify_date": "2023-11-04T..."
  },
  ...
]
```

### 2. Get Article Categories
Retrieves a list of all distinct article categories.

- **URL:** `/articles/categories`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of strings.

**Example Request:**
```javascript
fetch('https://lactaconsejosws.onrender.com/articles/categories')
  .then(response => response.json())
  .then(categories => console.log(categories));
```

### 3. Get Latest Articles by Category
Retrieves the 5 latest articles for a specific category.

- **URL:** `/articles/latest/:category`
- **Method:** `GET`
- **Url Params:** `category=[string]`

**Example Request:**
```javascript
const category = "Madres lactantes";
fetch(`https://lactaconsejosws.onrender.com/articles/latest/${encodeURIComponent(category)}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

### 4. Search Articles
Search for articles by text query or category.

- **URL:** `/articles/search/`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Data Params:**
  ```json
  {
    "search": "term",
    "category": "Optional Category"
  }
  ```

**Example Request:**
```javascript
fetch('https://lactaconsejosws.onrender.com/articles/search/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ search: 'Lactancia' })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### 5. Get Single Article
Retrieves a specific article by its ID.

- **URL:** `/articles/:id`
- **Method:** `GET`
- **Url Params:** `id=[string]`

**Example Request:**
```javascript
const id = "65466946ce3f103a641c6177";
fetch(`https://lactaconsejosws.onrender.com/articles/${id}`)
  .then(response => response.json())
  .then(article => console.log(article));
```
