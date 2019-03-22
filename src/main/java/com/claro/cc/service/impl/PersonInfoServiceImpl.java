package com.claro.cc.service.impl;

import com.claro.cc.domain.Address;
import com.claro.cc.domain.Person;
import com.claro.cc.domain.PersonContact;
import com.claro.cc.repository.PersonRepository;
import com.claro.cc.service.PersonInfoService;
import com.claro.cc.service.dto.PersonFullDTO;
import com.claro.cc.service.mapper.AddressMapper;
import com.claro.cc.service.mapper.PersonContactMapper;
import com.claro.cc.service.mapper.PersonMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class PersonInfoServiceImpl implements PersonInfoService {

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private AddressMapper addressMapper;
    @Autowired
    private PersonContactMapper personContactMapper;
    @Autowired
    private PersonMapper personMapper;

    @Override
    @Transactional
    public PersonFullDTO save(PersonFullDTO personFullDTO) {

        Person person = personMapper.toEntity(personFullDTO);

        Set<Address> addresses = personFullDTO.getAddresses().stream().
            map((addressDTO -> addressMapper.toEntity(addressDTO))).
            collect(Collectors.toSet());
        person.setAddresses(addresses);

        Set<PersonContact> personContacts = personFullDTO.getPersonContacts().stream().
            map(personContactDTO -> personContactMapper.toEntity(personContactDTO)).
            collect(Collectors.toSet());
        person.setPersonContacts(personContacts);

        personRepository.save(person);

        return personFullDTO;
    }
}
