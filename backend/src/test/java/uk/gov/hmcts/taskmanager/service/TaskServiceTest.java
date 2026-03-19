package uk.gov.hmcts.taskmanager.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import uk.gov.hmcts.taskmanager.dto.TaskDTO;
import uk.gov.hmcts.taskmanager.exception.ResourceNotFoundException;
import uk.gov.hmcts.taskmanager.model.Task;
import uk.gov.hmcts.taskmanager.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository repository;

    @InjectMocks
    private TaskService service;

    private Task task;
    private TaskDTO dto;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        task = new Task();
        task.setId(1L);
        task.setTitle("Update case records");
        task.setDescription("Sync database with new entries");
        task.setStatus("PENDING");
        task.setDueDate(LocalDateTime.now().plusDays(2));

        dto = new TaskDTO();
        dto.setTitle("Update case records");
        dto.setDescription("Sync database with new entries");
        dto.setStatus("PENDING");
        dto.setDueDate(LocalDateTime.now().plusDays(2));
    }

    @Test
    void createTask() {
        when(repository.save(any(Task.class))).thenReturn(task);

        Task result = service.createTask(dto);

        assertNotNull(result);
        assertEquals("Update case records", result.getTitle());
        verify(repository).save(any(Task.class));
    }

    @Test
    void findTaskById() {
        when(repository.findById(1L)).thenReturn(Optional.of(task));

        Task result = service.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(repository).findById(1L);
    }

    @Test
    void throwsExceptionWhenTaskNotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(999L));
    }

    @Test
    void findAll() {
        when(repository.findAllByOrderByDueDateAsc()).thenReturn(Arrays.asList(task));

        List<Task> results = service.findAll(null);

        assertEquals(1, results.size());
        verify(repository).findAllByOrderByDueDateAsc();
    }

    @Test
    void updateTaskDetails() {
        TaskDTO updatedDto = new TaskDTO();
        updatedDto.setTitle("Process hearing notes");
        updatedDto.setDescription("Review and file documentation");
        updatedDto.setStatus("IN_PROGRESS");
        updatedDto.setDueDate(LocalDateTime.now().plusDays(5));

        when(repository.findById(1L)).thenReturn(Optional.of(task));
        when(repository.save(any(Task.class))).thenReturn(task);

        Task updated = service.updateTask(1L, updatedDto);

        assertEquals("Process hearing notes", updated.getTitle());
        assertEquals("IN_PROGRESS", updated.getStatus());
        verify(repository).save(task);
    }

    @Test
    void updateStatus() {
        when(repository.findById(1L)).thenReturn(Optional.of(task));
        when(repository.save(any(Task.class))).thenReturn(task);

        Task updated = service.updateStatus(1L, "COMPLETED");

        assertEquals("COMPLETED", updated.getStatus());
        verify(repository).save(task);
    }

    @Test
    void deleteTask() {
        when(repository.findById(1L)).thenReturn(Optional.of(task));

        service.deleteTask(1L);

        verify(repository).delete(task);
    }
}
