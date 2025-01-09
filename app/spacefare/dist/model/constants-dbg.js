sap.ui.define([],
    function () {
        'use strict';

        var constants = {
            selectedSuitColor: "",
            spacefarerName: null,
            selectedwarmHoleSkill: "",
            stardustCollection: null,
            delay: 0,
            busy: false,
            isAdmin: false,
            handleEditControl: false,
            updatedColor: "",
            updateStarDustValue: true,
            newName: "",
            nameValidState: true,
            newEmail: "",
            emailValidState: true,
            planetValueState: true,
            newPlanet: "",
            newDepartment: "",
            departmentValueState: true,
            newWarmHoleSkill: "",
            newWarmHoleSkillState: true,
            newSpaceSuitColor: "",
            newSpaceSuitColorState: true,
            newStartDuust: "",
            newStartDuustState: true,
            warmHoleSkill: [{
                name: 'Beginner'
            }, {
                name: 'Intermediate'
            }, {
                name: 'Advanced'
            }, {
                name: 'Expert'
            }]
        };

        return constants;
    });