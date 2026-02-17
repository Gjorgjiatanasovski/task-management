package com.atomic.taskmanagement.domain.task;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Import;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.atomic.taskmanagement.config.GlobalExceptionHandler;
import com.atomic.taskmanagement.config.JacksonConfig;
import com.atomic.taskmanagement.domain.task.dto.TaskRequest;
import com.atomic.taskmanagement.domain.task.dto.TaskResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(TaskController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MessageSource messageSource;

    @MockitoBean
    private TaskService taskService;

    private TaskResponse sample(int id) {
        return new TaskResponse(id, "title" + id, "desc" + id, false, LocalDateTime.parse("2026-02-19T12:00:00"));
    }

    @Test
    @DisplayName("Should return 400 when updating non-existing movie")
    void createTask_ShouldReturnBadRequestWhenRequestFails() throws Exception {
        TaskRequest postReq = new TaskRequest("", null, null, null);

        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                    .value("Constraint violation"));
    }

    @Test
    @DisplayName("Should return all tasks as a list")
    void getAllTasks_ShouldReturnList() throws Exception {
        when(taskService.findAllTasks()).thenReturn(List.of(sample(1), sample(2)));

        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    @DisplayName("Should return paged tasks honoring pageable defaults")
    void getTasksPaged_ShouldReturnPage() throws Exception {
        Page<TaskResponse> page = new PageImpl<>(List.of(sample(1), sample(2)), PageRequest.of(0, 10), 2);
        when(taskService.getTasksPaged(any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/tasks/paged"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    @DisplayName("Should get task by id and return 200")
    void getTaskById_ShouldReturnOk() throws Exception {
        when(taskService.findTaskById(1)).thenReturn(sample(1));

        mockMvc.perform(get("/api/v1/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("Should update task with PATCH and return updated entity")
    void updateTask_ShouldReturnOk() throws Exception {
        TaskRequest patchReq = new TaskRequest("new title", null, null, null);
        TaskResponse updated = new TaskResponse(5, "new title", "desc5", false, null);
        when(taskService.updateTask(eq(5), any(TaskRequest.class))).thenReturn(updated);

        mockMvc.perform(patch("/api/v1/tasks/5")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(patchReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.title").value("new title"));
    }

    @Test
    @DisplayName("Should delete task and return 204 with no content")
    void deleteTask_ShouldReturnNoContent() throws Exception {
        doNothing().when(taskService).deleteTask(10);

        mockMvc.perform(delete("/api/v1/tasks/10"))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));
    }

    @Test
    @DisplayName("Should try delete task and return 404 with doesnt exist")
    void deleteTask_ShouldReturnDoesntExist() throws ResourceNotFoundException, Exception {
        doThrow(new ResourceNotFoundException(getMsg("validation.task.delete_by_id", 10)))
            .when(taskService).deleteTask(10);

        mockMvc.perform(delete("/api/v1/tasks/10"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message")
                    .value("\"Cannot delete: Task with id= 10 is not found\""));
    }

    @Test
    @DisplayName("Should accept LocalDate only for dueDate via JacksonConfig and convert to start-of-day")
    void createTask_ShouldAcceptLocalDateString() throws Exception {
        String body = "{\"title\":\"t\",\"description\":\"d\",\"isCompleted\":false,\"dueDate\":\"2026-02-19\"}";
        TaskResponse resp = new TaskResponse(2, "t", "d", false, LocalDateTime.parse("2026-02-19T00:00:00"));
        when(taskService.saveTask(any(TaskRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/v1/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dueDate").value("2026-02-19 00:00:00"));
    }

    private String getMsg(String key,Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }
}
