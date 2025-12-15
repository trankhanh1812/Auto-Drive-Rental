package com.carrental.backend.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseData implements Serializable {
    private String errorCode;
    private Boolean success;
    private Object content;

    public ResponseData(Object content) {
        this.content = content;
        this.success = true;
    }
}
