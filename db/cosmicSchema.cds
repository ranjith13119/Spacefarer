namespace sapp.Cosmic.Space;

using {
  managed,
  cuid,
  sap
} from '@sap/cds/common';

// Skill Category
type WormholeNavigationSkill : String enum {
  Beginner     = 'Beginner';
  Intermediate = 'Intermediate';
  Advanced     = 'Advanced';
  Expert       = 'Expert';
}

// Spacesuite color details based on Position
entity SpacesuitColor : managed, sap.common.CodeList {
  key ID : Integer;
}

// Planet information
entity Planet : managed {
  key ID : Integer; 
  name        : localized String(255);
  descr       : localized String(1000);
  spacefarers : Composition of many Spacefarer
                  on spacefarers.originPlanet = $self; // Link to Spacefarer
  department  : Composition of many Department
                  on department.planet = $self;
}

// Species information
entity Species : cuid, managed {
  name        : localized String(255); // Name of the species (e.g., Human, Martian, Zyntarian)
  description : localized String; // Description of the species (e.g., characteristics, origin)
  spacefarers : Composition of many Spacefarer
                  on spacefarers.species = $self; // Link to Spacefarer
}

// Spacefarer Details
entity Spacefarer : cuid, managed {
  name                    : localized String(100); // Spacefarer's name
  email                   : String @assert.format: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' ;
  wormholeNavigationSkill : WormholeNavigationSkill; // Categorized skill level
  originPlanet            : Association to Planet ; // The planet they come from (e.g., Earth, Mars, etc.)
  stardustCollection      : Integer ; // Amount of stardust collected
  species                 : Association to Species; // Link to the Species entity (e.g., Human, Martian, etc.)
  department              : Association to Department; // Link to intergalactic department (e.g., Exploration, Defense)
  position                : Association to Position; // Link to the spacefarer's position based on which the spacesuit color will be associated(e.g., Pilot, Scientist)
  spacesuitColor: Association to SpacesuitColor ;       

// wormholeNavigationSkill : Decimal(2, 1) @assert.range: [ 1.0, 5.0 ]; // Skill level (1.0 - 5.0) for wormhole navigation
}

// Spacefarer associate department
entity Department : cuid, managed {
  name        : localized String(255); // Department name (e.g., Exploration, Defense)
  description : localized String; // Department description
  spacefarers : Association to many Spacefarer
                  on spacefarers.department = $self; // Link to Spacefarer
  positions   : Composition of many Position
                  on positions.department = $self;
  planet      : Association to one Planet;
}

entity Position : cuid, managed {
  name           : localized String(255); // Position name (e.g., Pilot, Scientist)
  description    : localized String; // Position description
  spacefarers    : Association to many Spacefarer
                     on spacefarers.position = $self; // Link to Spacefarer.
  department     : Association to Department; // Link to Department (e.g., Exploration, Defense)
}

