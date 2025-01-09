using sapp.Cosmic.Space as cosmicspace from '../db/cosmicSchema';

@(requires: 'authenticated-user' )
service SpacefarersService @(path: '/spacefarers')  {

    @(restrict: [
        {
            grant: ['*'],
            to   : 'admin'
        },
        {
            grant: [
                'READ'
            ],
            to   : 'spacefarer',
            where: 'originPlanet_ID = $user.originPlanet'
        }, 
        {
            grant: [
                'UPDATE'
            ],
            to   : 'spacefarer',
            where: 'email = $user'
        }
    ])  
    entity Spacefarers as projection on cosmicspace.Spacefarer;

    @(restrict: [{ grant: ['*'], to   : 'admin' }])
    entity Species    as projection on cosmicspace.Species;
    
    @(restrict: [{ grant: ['*'], to   : 'admin' }])
    entity Planets     as projection on cosmicspace.Planet;

    @(restrict: [{ grant: ['*'], to   : 'admin' }])
    entity Departments as
        projection on cosmicspace.Department {
            *
        }
        excluding {
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy
        };

   @(restrict: [{ grant: ['*'], to   : 'admin' }])
    entity Positions   as
        projection on cosmicspace.Position {
            *
        }
        excluding {
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy
        };


}