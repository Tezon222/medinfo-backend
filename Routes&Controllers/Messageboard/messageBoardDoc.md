# DOCUMENTATION FOR messageboard API 

## Routes
1. '/posts/all' (GET)

   This route returns all posts with their properties

   Properties include: author, title, content, date, viewcount, commentcount and comments
    Example-
   ```json
      {
        "_id": "66c64bf08f7a99e53af03f2d",
        "author": "Sam",
        "title": "Sayo",
        "content": "Uloma is mid",
        "views": 0,
        "commentCount": "7",
        "date": "2024-08-21T20:20:00.961Z",
        "comments": [
          {
            "commentAuthor": "JohnPaul",
            "commentContent": "I am so hot, zayne is mid. Ferdinard can go bleep",
            "_id": "66c64c078f7a99e53af03f33",
            "commentDate": "2024-08-21T20:20:23.590Z"
          }
        ],
        "__v": 7,
           "_id": "66c64bf08f7a99e53af03f2d",
        "author": "Sam",
        "title": "Sayo",
        "content": "Uloma is mid",
        "views": 0,
        "commentCount": "7",
        "date": "2024-08-21T20:20:00.961Z",
        "comments": [
          {
            "commentAuthor": "JohnPaul",
            "commentContent": "I am so hot, zayne is mid. Ferdinard can go bleep",
            "_id": "66c64c078f7a99e53af03f33",
            "commentDate": "2024-08-21T20:20:23.590Z"
          }
        ],
        "__v": 7
      }
   ```
  
3. '/posts/:postId/:userId' (GET)

   This route returns a single post with its properties

   It takes the post id in the params as well as the id of the logged in user

   This ensures that the view count does not increase if the author retrieves his post
    Example-
   ```json
      {
        "_id": "66c64bf08f7a99e53af03f2d",
        "author": "Sam",
        "title": "Sayo",
        "content": "Uloma is mid",
        "views": 0,
        "commentCount": "7",
        "date": "2024-08-21T20:20:00.961Z",
        "comments": [
          {
            "commentAuthor": "JohnPaul",
            "commentContent": "I am so hot, zayne is mid. Ferdinard can go bleep",
            "_id": "66c64c078f7a99e53af03f33",
            "commentDate": "2024-08-21T20:20:23.590Z"
          }
        ]
      }
    ```
3. 'posts/new/:id' (POST)

   Creates a new post

   Takes in the logged in user's id in the params to identify them as author of the post

    The post's title and content is collected via the form/body:
    Eg:
    ```json
        {
        "title": "Sayo",
        "content": "Ola dora"
    }
    ```

    Returns the new post with other information as response
    Example:
    ```json
        {
        "author": "Sam",
        "title": "Sayo",
        "content": "Ola dora",
        "views": 0,
        "commentCount": "0",
        "_id": "66c64bf08f7a99e53af03f2d",
        "date": "2024-08-21T20:20:00.961Z",
        "comments": [],
        "__v": 0
    }
    ```

5. '/posts/comment/:postId/:commenterId' (POST)

    Creates a new comment as an array field under the Post commented on

   Takes both the Post's id and commenter's id in the params to find the post and identify the commenter

   The comment's content is collected via the form/body:
    Example- 
    ```json
        {
        "commentContent": "apologies for wetin i say dey play"
    }
    ```
    Example of comment as an object in an array field in the Post's blablabla you get the point:
    ```json
    {
    
        "comments": [
        {
            "commentAuthor": "JohnPaul",
            "commentContent": "I am so hot, zayne is mid. Ferdinard can go bleep",
            "_id": "66c64c078f7a99e53af03f33",
            "commentDate": "2024-08-21T20:20:23.590Z"
        }
        ]
    }
    ```
