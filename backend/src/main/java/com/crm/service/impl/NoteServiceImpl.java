package com.crm.service.impl;

import com.crm.dto.NoteRequestDTO;
import com.crm.dto.NoteResponseDTO;
import com.crm.entity.CustomerLead;
import com.crm.entity.Note;
import com.crm.exception.ResourceNotFoundException;
import com.crm.mapper.NoteMapper;
import com.crm.repository.CustomerLeadRepository;
import com.crm.repository.NoteRepository;
import com.crm.service.NoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final CustomerLeadRepository customerLeadRepository;
    private final NoteMapper noteMapper;

    @Override
    @Transactional
    public NoteResponseDTO createNote(NoteRequestDTO requestDTO) {
        log.info("Creating note for lead ID: {}", requestDTO.getLeadId());
        
        CustomerLead lead = customerLeadRepository.findById(requestDTO.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + requestDTO.getLeadId()));

        Note note = noteMapper.toEntity(requestDTO);
        note.setLead(lead);
        
        Note savedNote = noteRepository.save(note);
        noteRepository.flush();
        return noteMapper.toResponseDTO(savedNote);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponseDTO> getAllNotes() {
        return noteMapper.toResponseDTOList(noteRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public NoteResponseDTO getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));
        return noteMapper.toResponseDTO(note);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoteResponseDTO> getNotesByLeadId(Long leadId) {
        return noteMapper.toResponseDTOList(noteRepository.findByLeadIdOrderByCreatedDateDesc(leadId));
    }

    @Override
    @Transactional
    public NoteResponseDTO updateNote(Long id, NoteRequestDTO requestDTO) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));

        CustomerLead lead = customerLeadRepository.findById(requestDTO.getLeadId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with ID: " + requestDTO.getLeadId()));

        noteMapper.updateEntityFromDTO(requestDTO, note);
        note.setLead(lead);
        
        Note savedNote = noteRepository.save(note);
        noteRepository.flush();
        return noteMapper.toResponseDTO(savedNote);
    }

    @Override
    @Transactional
    public void deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note not found with ID: " + id);
        }
        noteRepository.deleteById(id);
        noteRepository.flush();
    }
}
