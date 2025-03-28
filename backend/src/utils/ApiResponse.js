class ApiResponse {
    constructor(statusCode, message = 'Success', data = null) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = statusCode < 400; // Use `success` instead of `sucess`
    }
  }
  
  export { ApiResponse };
  