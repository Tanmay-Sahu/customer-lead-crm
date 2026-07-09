package com.crm.service;

import com.crm.dto.NoteRequestDTO;
import com.crm.dto.NoteResponseDTO;

import java.util.List;

public interface NoteService {
    
    NoteResponseDTO createNote(NoteRequestDTO requestDTO);

    List<NoteResponseDTO> getAllNotes();

    NoteResponseDTO getNoteById(Long id);

    List<NoteResponseDTO> getNotesByLeadId(Long leadId);

    NoteResponseDTO updateNote(Long id, NoteRequestDTO requestDTO);

    void deleteNote(Long id);
}
