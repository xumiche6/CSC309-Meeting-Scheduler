## Project Setup Instructions

### 1. venv setup

- Create a virtual environment for the project to manage dependencies:
  ```shell
  python -m venv venv
  ```
  **Note**: The environment is named `venv` here, but you can name it anything. Just ensure the name is added to `.gitignore` to prevent it from being tracked by Git.
- Activate the virtual environment and install the required dependencies:
  ```shell
  source venv/bin/activate  # On Windows use `venv\Scripts\activate`
  pip install -r requirements.txt
  ```

### 2. Using the Makefile

- Makefile stuff:
  - To start the server:
    ```shell
    make run
    ```
  - To apply migrations:
    ```shell
    make migrate
    ```
    Will make sure the venv is activated first

### 3. Creating Authenticated Endpoints

- To create an authenticated endpoint in the DRF, make a view like this:

  ```python
  from rest_framework.views import APIView
  from rest_framework.response import Response
  from rest_framework.permissions import IsAuthenticated

  class AuthenticatedView(APIView):
      permission_classes = [IsAuthenticated]  # need this line for auth

      def get(self, request):
          data = {"message": "This is an authenticated response"}
          return Response(data)
  ```

### 4. Testing with Postman

- For API testing with Postman:
  - Use the `/api/users/register/` endpoint for user registration.
  - Re-authenticate using the `/api/users/login/` endpoint if you need to.
  - To log out, call the `/api/users/logout` endpoint.
  - For other endpoint testing, please refer to this file [docs.pdf](../docs.pdf).
- Authentication tokens are stored in cookies, so you don't need to add an auth header manually. If your client doesn't automatically manage cookies, you may need to manually include the authentication token in the request headers.
