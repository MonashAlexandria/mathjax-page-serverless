export class AlexError{

    constructor(msg, statusCode = 500){
        this.errorMessage = msg;
        this.statusCode = statusCode;
    }

    getMessage(){
        return this.errorMessage;
    }

    getStatusCode(){
        return this.statusCode;
    }

    static buildErrorResponse(error){
        var message = "";
        var status = 500;
        if(error instanceof AlexError){
            message = error.getMessage();
            status = error.getStatusCode();
        } else if(error instanceof Error){
            message = error.message;
        } else {
            message = error;
            console.error("Encountered non error message");
        }

        return {
            body: JSON.stringify({"error": message}),
            statusCode: status
        };
    }
}