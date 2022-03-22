'use strict';

const cds = require('@sap/cds');
const prc = require('./processing-engine');

class TimesheetService extends cds.ApplicationService {

    init() {

        /**
         * Process all Timesheets in 'Created' status
         */
        this.on('processTimesheets', async req => {
            console.log("Entered Action handler for 'processTimesheets'");
        });

        /**
         * Before CREATE of Timesheets
         */
        this.before(['CREATE'], 'Timesheet', async req => {
            console.log("Entered Event handler 'BeforeCreate' of Timesheet");
            prc.wait(10000);
        });

        /**
         * After CREATE of Timesheets
         */
        this.after(['CREATE'], 'Timesheet', async (results, req) => {
            console.log("Entered Event handler 'AfterCreate' of Timesheet");
            //console.log('The ID of the user is %s', req.user.id);
            //let a = req.user;
            //if (req.user.is('authenticated')) { console.log('The user is authenticated'); }
            //if (!req.user.is('authenticated')) { console.log('The user is not authenticated'); }
            //if (req.user.is('admin')) { console.log('The role of user is admin'); }
            //if (!req.user.is('admin')) { console.log('The role of user is not admin'); }
            prc.triggerJob();
        });

        /**
         * After READ of Timesheets
         */
        this.after(['READ'], 'Timesheet', each => {
            console.log("[AFTER READ] Timesheet Read");
        });

        // Add base class's handlers. Handlers registered above go first.
        return super.init();
    }
}
module.exports = TimesheetService
