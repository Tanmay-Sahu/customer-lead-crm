package com.crm.repository;

import com.crm.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByLeadIdOrderByCreatedDateDesc(Long leadId);
}
