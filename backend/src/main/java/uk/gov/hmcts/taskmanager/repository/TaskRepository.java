package uk.gov.hmcts.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.hmcts.taskmanager.model.Task;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOrderByDueDateAsc();
    List<Task> findByStatusOrderByDueDateAsc(String status);
}
