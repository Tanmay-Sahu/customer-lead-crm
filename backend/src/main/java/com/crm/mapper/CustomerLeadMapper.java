package com.crm.mapper;

import com.crm.dto.CustomerLeadRequestDTO;
import com.crm.dto.CustomerLeadResponseDTO;
import com.crm.entity.CustomerLead;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerLeadMapper {

    CustomerLeadMapper INSTANCE = Mappers.getMapper(CustomerLeadMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "leadType", ignore = true) // Handled in service
    CustomerLead toEntity(CustomerLeadRequestDTO requestDTO);

    @Mapping(target = "leadTypeId", source = "leadType.id")
    @Mapping(target = "leadTypeName", source = "leadType.leadTypeName")
    CustomerLeadResponseDTO toResponseDTO(CustomerLead entity);

    List<CustomerLeadResponseDTO> toResponseDTOList(List<CustomerLead> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "leadType", ignore = true) // Handled in service
    void updateEntityFromDTO(CustomerLeadRequestDTO requestDTO, @MappingTarget CustomerLead entity);
}
