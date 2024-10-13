from django.utils.deprecation import MiddlewareMixin


class ClearInvalidTokenMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response.status_code == 401 and "token_not_valid" in str(response.content):
            print()
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
        return response
