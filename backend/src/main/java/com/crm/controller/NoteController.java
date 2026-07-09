package com.crm.controller;

import com.crm.dto.ApiResponse;
import com.crm.dto.NoteRequestDTO;
import com.crm.dto.NoteResponseDTO;
import com.crm.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<ApiResponse<NoteResponseDTO>> createNote(@Valid @RequestBody NoteRequestDTO requestDTO) {
        NoteResponseDTO response = noteService.createNote(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Note created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> getAllNotes() {
        return ResponseEntity.ok(ApiResponse.success("Notes fetched successfully", noteService.getAllNotes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponseDTO>> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Note fetched successfully", noteService.getNoteById(id)));
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<ApiResponse<List<NoteResponseDTO>>> getNotesByLeadId(@PathVariable Long leadId) {
        return ResponseEntity.ok(ApiResponse.success("Notes for lead fetched successfully", noteService.getNotesByLeadId(leadId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponseDTO>> updateNote(
            @PathVariable Long id, 
            @Valid @RequestBody NoteRequestDTO requestDTO) {
        return ResponseEntity.ok(ApiResponse.success("Note updated successfully", noteService.updateNote(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.success("Note deleted successfully", null));
    }
}
