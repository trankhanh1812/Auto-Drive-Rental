package com.carrental.backend.exception;

import com.carrental.backend.dto.ErrorDetails;

public class ValidParametersException extends RuntimeException{
    public ErrorDetails toErrorDetails() {
        ErrorDetails details = new ErrorDetails();
        details.setCode("CR4-07");
        details.setDescription("Invalid parameters");
        return details;
    }
}
