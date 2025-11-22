package it.lumen.data.mapper;

import it.lumen.data.dto.IndirizzoDTO;
import it.lumen.data.entity.Indirizzo;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IndirizzoMapper {

    IndirizzoDTO toDto(Indirizzo entity);

}