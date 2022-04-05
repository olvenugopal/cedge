'use strict';

const cds = require('@sap/cds');
const prc = require('./processing-engine');
const log = require('cf-nodejs-logging-support');

class TimesheetService extends cds.ApplicationService {

    init() {

        /**
         * Process all Timesheets in 'Created' status
         */
        this.on('processTimesheets', async req => {
            log.info("[CWFM] Entered Action handler for 'processTimesheets'");
        });

        /**
         * Before CREATE of Timesheets
         */
        this.before(['CREATE'], 'Timesheet', async req => {
            log.info("[CWFM] Entered Event handler 'BeforeCreate' of Timesheet");
        });

        /**
         * After CREATE of Timesheets
         */
        this.after(['CREATE'], 'Timesheet', async (results, req) => {
            log.info("[CWFM] Entered Event handler 'AfterCreate' of Timesheet");
            //console.log('The ID of the user is %s', req.user.id);
            //let a = req.user;
            //if (req.user.is('authenticated')) { console.log('The user is authenticated'); }
            //if (!req.user.is('authenticated')) { console.log('The user is not authenticated'); }
            //if (req.user.is('admin')) { console.log('The role of user is admin'); }
            //if (!req.user.is('admin')) { console.log('The role of user is not admin'); }
            prc.triggerJob();
        });

        /**
         * Before READ of Timesheets
         */
        this.before(['READ'], 'Timesheet', (req) => {
            log.info("[CWFM] Entered Event handler 'BeforeRead' of Timesheet");
            log.info("[CWFM] Delay Time Config: %i", Number(process.env.prc_delay_time));
            prc.wait(Number(process.env.prc_delay_time));
        });

        // Add base class's handlers. Handlers registered above go first.
        return super.init();
    }
}
module.exports = TimesheetService
