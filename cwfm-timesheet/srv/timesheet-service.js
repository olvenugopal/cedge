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
        this.before(['CREATE'], 'Timesheets', async req => {
            results.status_code = 'CREA';
            log.info("[CWFM] Entered Event handler 'BeforeCreate' of Timesheets");
        });

        /**
         * After CREATE of Timesheets
         */
        this.after(['CREATE'], 'Timesheets', async (results, req) => {
            log.info("[CWFM] Entered Event handler 'AfterCreate' of Timesheets");
            prc.triggerJob();
        });

        /**
         * After UPDATE of Timesheets
         */
        this.after(['UPDATE'], 'Timesheets', async (results, req) => {
            log.info("[CWFM] Entered Event handler 'AfterUpdate' of Timesheets");
            results.status_code = 'UPDT';
            prc.triggerJob();
        });

        /**
         * Before READ of Timesheets
         */
        this.before(['READ'], 'Timesheets', (req) => {
            log.info("[CWFM] Entered Event handler 'BeforeRead' of Timesheets");
            log.info("[CWFM] Delay Time Config: %i", Number(process.env.prc_delay_time));
            prc.wait(Number(process.env.prc_delay_time));
        });

        /**
         * Set the criticality value for each of the rows
         */
        this.after(['READ'], 'Timesheets', (each) => {
            if (each.matchScore > 0 && each.matchScore <= 0.6) {
                each.criticality = 1;
            }
            else if (each.matchScore > 0.6 && each.matchScore <= 0.9) {
                each.criticality = 2;
            }
            else if (each.matchScore > 0.9) {
                each.criticality = 3;
            }
            else {
                each.criticality = 0;
            }
        });

        /**
         * Approve Action - Set status accordingly
         */
        this.on('approveTimesheet', (req) => {
            if (req._target.status_code === 'PEND') {
                UPDATE(req._target).with({ status_code: 'APPR' });
            }
            else {
                req.error(400, `Please select a Timesheet in status 'Pending Approval'`);
            }
        });

        /**
         * Reject Action - Set status accordingly
         */
        this.on('rejectTimesheet', async (req) => {
            console.log("[CWFM] Entered Action handler 'rejectTimesheet'");
            let ts = await SELECT.one`status_code as status_code`.from(req._target);
            if (ts.status_code === 'PEND') {
                UPDATE(req._target).with({ status_code: 'REJE' });
            }
            else {
                req.error(400, `Please select a Timesheet in status 'Pending Approval'`);
            }
        });

        // Add base class's handlers. Handlers registered above go first.
        return super.init();
    }
}
module.exports = TimesheetService
