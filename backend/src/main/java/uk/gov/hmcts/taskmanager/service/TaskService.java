package uk.gov.hmcts.taskmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.hmcts.taskmanager.dto.TaskDTO;
import uk.gov.hmcts.taskmanager.exception.ResourceNotFoundException;
import uk.gov.hmcts.taskmanager.model.Task;
import uk.gov.hmcts.taskmanager.repository.TaskRepository;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(TaskDTO dto) {
        Task task = new Task(
            dto.getTitle(),
            dto.getDescription(),
            dto.getStatus(),
            dto.getDueDate()
        );
        return taskRepository.save(task);
    }

    public Task findById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task with ID " + id + " not found"));
    }

    public List<Task> findAll(String status) {
        // Filter by status if provided, otherwise return all tasks
        if (status == null || status.isBlank()) {
            return taskRepository.findAllByOrderByDueDateAsc();
        }
        return taskRepository.findByStatusOrderByDueDateAsc(status);
    }

    public Task updateTask(Long id, TaskDTO dto) {
        Task task = findById(id);
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setDueDate(dto.getDueDate());
        return taskRepository.save(task);
    }

    public Task updateStatus(Long id, String newStatus) {
        if (newStatus == null || newStatus.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
        Task task = findById(id);
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = findById(id);
        taskRepository.delete(task);
    }
}
