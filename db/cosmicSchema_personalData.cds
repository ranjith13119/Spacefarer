using sapp.Cosmic.Space as cosmicspace from '../db/cosmicSchema';

annotate cosmicspace.Spacefarer with @PersonalData: {EntitySemantics: 'DataSubject'} {
    ID    @PersonalData.FieldSemantics            : 'DataSubjectID';
    name  @PersonalData.IsPotentiallyPersonal;
    email @PersonalData.IsPotentiallyPersonal;
};
