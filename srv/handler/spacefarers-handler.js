const cds = require("@sap/cds");
const { sendMail } = require("@sap-cloud-sdk/mail-client");
const LOG = cds.log('spacefarers-service');
const { Spacefarer } = cds.entities;

(async function () {
    alert = await cds.connect.to('notifications');
})();


/* 
  Function to check if the provided email address matches a valid email format. 
*/

const _validateEmailFormat = (sEmail) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regular expression to check the format of the email address.
    return emailRegex.test(sEmail);
}

/* 
  Function to determine the wormhole navigation skill level based on stardust collection. 
  {The function assigns a wormhole navigation skill level based on the stardust collection value.}
*/

const _determineWormholeNavigationSkill = (iStardustCollection) => {
    let sWormholeNavigationSkill;

    switch (true) {
        case (iStardustCollection >= 10000):
            sWormholeNavigationSkill = 'Expert';
            break;
        case (iStardustCollection >= 7000 && iStardustCollection < 10000):
            sWormholeNavigationSkill = 'Advanced';
            break;
        case (iStardustCollection >= 3000 && iStardustCollection < 7000):
            sWormholeNavigationSkill = 'Intermediate';
            break;
        case (iStardustCollection < 3000):
            sWormholeNavigationSkill = 'Beginner';
            break;
        default:
            sWormholeNavigationSkill = 'Beginner';
    }

    return sWormholeNavigationSkill;
};

/* 
  Function to validate the spacefarer details before proceeding with record creation.
  {Validates the email, stardust collection, spacesuit color, and origin planet for the spacefarer.}
*/

const validateSpacefarerDetails = async (req) => {

    const { email, stardustCollection, spacesuitColor_ID, originPlanet_ID } = req.data;

    if (email && spacesuitColor_ID && originPlanet_ID && (stardustCollection >= 0)) {
        if (!_validateEmailFormat(email)) req.reject(400, 'Please provide the valid the Email details');

        const oSpaceFarer = await SELECT.one.from(Spacefarer, ["ID"]).where({ email })          // check for duplicate email 

        if (oSpaceFarer?.ID) {
            LOG.info(`Spacefarer with the same email ID: ${email} already exists in the cosmic planet`);
            req.reject(400, `Spacefarer with the same email ID: ${email} already exists in the cosmic planet`);
        }
    } else {
        if (!email) {
            req.reject(400, 'Email is required');
        } else if (stardustCollection < 0) {
            req.reject(400, 'Stardust collection must be >= 0 ');
        } else if (!spacesuitColor_ID) {
            req.reject(400, 'Spacesuit Color is required.');
        } else if (!originPlanet_ID) {
            req.reject(400, 'Origin Plant is required.');
        }
    }
};

/* 
  Function to enrich spacefarer details before saving or updating the record.    
  {Ensures that the stardust collection is at least 100 and calculates the navigation skill based on stardust collected.}
*/

const enrichSpacefarerDetails = async (req) => {
    try {
        const { stardustCollection, ID } = req.data;
        if (req.query.UPDATE) {  // validate the update action
            const oSpaceFarer = await SELECT.one.from(Spacefarer, ["ID"]).where({ ID });
            if (!oSpaceFarer) req.reject(400, `Spacefarer with the ID: ${ID} is not exist`)
        }
        req.data.stardustCollection = Math.max(stardustCollection, 100); // Boost stardust for beginners
        req.data.wormholeNavigationSkill = _determineWormholeNavigationSkill(stardustCollection); // Assign a wormhole navigation skill level
    } catch (oErr) {
        console.log(oErr);
        req.reject(500, 'Error while enriching the Spacefarer Information');
    }
}

/* 
  Function to send a welcome email notification to a new spacefarer.
  {Sends a congratulatory welcome email to the spacefarer, including information about their new role.}
*/

const triggerWelcomeNotification = async (spacefarer, req) => {

    try {
        let aMailConfig = [];
        const { name, email } = spacefarer;
        LOG.info(`Email Trigger to Spacefarer: ${name} to the email ID: ${email}`)
        const sEmailContent = `Dear ${name}, 
        Congratulations on starting your adventurous journet amount the stars!.
        We are thrilled to welcome you as a Galatic Spacefarer. 
        
        Wishing you safe travels and abudant stardust!
        
        Best regards, 
        The Galactic Federation 
        `
        aMailConfig.push({
            from: "ranjith13119@gmail.com",
            to: email,
            subject: `Welcome to Galactic Spacefarer`,
            html: sEmailContent
        });

        /* Remove the below section to run the application in local */

        sendMail({ destinationName: "sap_process_automation_mail" }, aMailConfig);   // Share the email to spacefarer using the SAP BTP mail destination 
        LOG.info(`Alert Trigger to Spacefarer: ${name} to the email ID: ${email}`)
        await alert.notify('SpacefarerCreated', {
            recipients: [email, "ranjith13119@gmail.com"],
            priority: "HIGH",
            data: {
                user: name,
            }
        });
    } catch (oErr) {
        console.log(oErr);
        req.reject(500, 'Error while trying to send notification to the user');
    }

}

/* 
  Function to update spacefarer details in the database. 
  {Updates the spacefarer's stardust collection, spacesuit color, and wormhole navigation skill.}
*/

const onUpdateSpaceFarersDetail = async (req) => {
    try {
        const { ID, stardustCollection, spacesuitColor_ID } = req.data;

        const wormholeNavigationSkill = _determineWormholeNavigationSkill(stardustCollection);

        const affectedRows = await UPDATE(Spacefarer).set({
            stardustCollection, wormholeNavigationSkill, spacesuitColor_ID
        }).where({ ID })
        if (!affectedRows) req.reject(400, "Couldn't update the Spacefarer Information")
    } catch (oErr) {
        console.log(oErr);
        req.reject(500, 'Error while updating the users');
    }

}

module.exports = {
    validateSpacefarerDetails,
    enrichSpacefarerDetails,
    triggerWelcomeNotification,
    onUpdateSpaceFarersDetail
};