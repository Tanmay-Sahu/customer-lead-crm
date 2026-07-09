package com.crm.mapper;

import com.crm.dto.LeadTypeRequestDTO;
import com.crm.dto.LeadTypeResponseDTO;
import com.crm.entity.LeadType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LeadTypeMapper {

    LeadTypeMapper INSTANCE = Mappers.getMapper(LeadTypeMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    LeadType toEntity(LeadTypeRequestDTO requestDTO);

    LeadTypeResponseDTO toResponseDTO(LeadType entity);

    List<LeadTypeResponseDTO> toResponseDTOList(List<LeadType> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    void updateEntityFromDTO(LeadTypeRequestDTO requestDTO, @MappingTarget LeadType entity);
}
