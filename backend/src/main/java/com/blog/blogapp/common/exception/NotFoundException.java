package com.blog.blogapp.common.exception;

/** Simple 404-style runtime exception. */
public class NotFoundException extends RuntimeException {
  public NotFoundException(String message) {
    super(message);
  }
}
