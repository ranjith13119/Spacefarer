const cds = require('@sap/cds');

const { spacefarersHandlers } = require("./handler");

class SpacefarersService extends cds.ApplicationService {
    init() {
        // Validate Spacefares details before creation 
        this.before(["CREATE"], 'Spacefarers', spacefarersHandlers.validateSpacefarerDetails);

        // Updating the specific information for the spacefarers
        this.on(["UPDATE"], 'Spacefarers', spacefarersHandlers.onUpdateSpaceFarersDetail);

        // Enriching the Spacefarers information 
        this.before(["CREATE", "UPDATE", "PATCH"], 'Spacefarers', spacefarersHandlers.enrichSpacefarerDetails);

        // Send Mail & Workzone notification to the users  
        this.after(['CREATE'], 'Spacefarers', spacefarersHandlers.triggerWelcomeNotification)
        return super.init();
    }
};

module.exports = {
    SpacefarersService
};