package com.crm.mapper;

import com.crm.dto.FollowUpRequestDTO;
import com.crm.dto.FollowUpResponseDTO;
import com.crm.entity.FollowUp;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FollowUpMapper {

    FollowUpMapper INSTANCE = Mappers.getMapper(FollowUpMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lead", ignore = true)
    FollowUp toEntity(FollowUpRequestDTO requestDTO);

    @Mapping(target = "leadId", source = "lead.id")
    @Mapping(target = "customerName", source = "lead.customerName")
    FollowUpResponseDTO toResponseDTO(FollowUp entity);

    List<FollowUpResponseDTO> toResponseDTOList(List<FollowUp> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lead", ignore = true)
    void updateEntityFromDTO(FollowUpRequestDTO requestDTO, @MappingTarget FollowUp entity);
}
