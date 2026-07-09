package com.crm.mapper;

import com.crm.dto.NoteRequestDTO;
import com.crm.dto.NoteResponseDTO;
import com.crm.entity.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NoteMapper {

    NoteMapper INSTANCE = Mappers.getMapper(NoteMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lead", ignore = true)
    Note toEntity(NoteRequestDTO requestDTO);

    @Mapping(target = "leadId", source = "lead.id")
    NoteResponseDTO toResponseDTO(Note entity);

    List<NoteResponseDTO> toResponseDTOList(List<Note> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lead", ignore = true)
    void updateEntityFromDTO(NoteRequestDTO requestDTO, @MappingTarget Note entity);
}
