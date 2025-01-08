const cds = require('@sap/cds');

const { spacefarersHandlers } = require("./handler");

class SpacefarersService extends cds.ApplicationService {
    init() {
        this.before(["CREATE"], 'Spacefarers', spacefarersHandlers.validateSpacefarerDetails);
        this.on(["UPDATE"], 'Spacefarers', spacefarersHandlers.onUpdateSpaceFarersDetail);
        this.before(["CREATE", "UPDATE", "PATCH"], 'Spacefarers', spacefarersHandlers.enrichSpacefarerDetails);
        this.after(['CREATE'], 'Spacefarers', spacefarersHandlers.triggerWelcomeNotification)
        return super.init();
    }
};

module.exports = {
    SpacefarersService
};