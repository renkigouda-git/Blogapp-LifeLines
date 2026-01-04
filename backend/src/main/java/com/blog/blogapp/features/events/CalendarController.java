package com.blog.blogapp.features.events;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/events")
public class CalendarController {

    @GetMapping(value = "/ics", produces = "text/calendar")
    public ResponseEntity<String> getCalendarIcs() throws Exception {

        ClassPathResource resource =
                new ClassPathResource("calendar/lifelines-calendar.ics");

        byte[] bytes = resource.getInputStream().readAllBytes();
        String content = new String(bytes, StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/calendar"))
                .body(content);
    }
}
