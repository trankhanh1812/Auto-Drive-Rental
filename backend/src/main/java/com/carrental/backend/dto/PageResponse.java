package com.carrental.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content;
    private Integer totalPages;
    private Long totalElements;
    private Integer pageNumber;
    private Integer pageSize;
    private Boolean last;
}
