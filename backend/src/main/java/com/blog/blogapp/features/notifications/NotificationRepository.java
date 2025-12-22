package com.blog.blogapp.features.notifications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // list for /notifications page
    List<Notification> findAllByOrderByCreatedAtDesc();

    // unread count for bell
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.readFlag = false")
    long countUnread();

    // mark one as read
    @Modifying
    @Query("UPDATE Notification n SET n.readFlag = true WHERE n.id = :id")
    int markOneRead(@Param("id") Long id);

    // mark ALL as read
    @Modifying
    @Query("UPDATE Notification n SET n.readFlag = true WHERE n.readFlag = false")
    int markAllRead();
}
