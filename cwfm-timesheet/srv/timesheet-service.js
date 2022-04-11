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
        this.before(['CREATE'], 'Timesheets', async (req) => {
            log.info("[CWFM] Entered Event handler 'BeforeCreate' of Timesheets");
            req.data.status_code = 'CREA';
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
            //const AuditLogService = await cds.connect.to('audit-log');
            //await AuditLogService.emit('TimesheetUpdated', { results });
            await UPDATE(req.target, results.ID).with({ status_code: 'UPDT', statusReason_code: '' });
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
        this.on('approveTimesheet', async (req) => {
            let guid = (req.data.ID === undefined) ? req.params[0].ID : req.data.ID;
            let rows = await SELECT("*").from(req.target).where({ id: guid });
            switch (rows[0].status_code) {
                case 'PEND':
                    await UPDATE(req.target, guid).with({ status_code: 'APPR' });
                    break;
                case 'APPR':
                    req.error(200, 'Timesheet is already Approved');
                    break;
                default:
                    req.error(400, `Please select a Timesheet in status 'Pending Approval'`);
                    break;
            }
        });

        /**
         * Reject Action - Set status accordingly
         */
        this.on('rejectTimesheet', async (req) => {
            let guid = (req.data.ID === undefined) ? req.params[0].ID : req.data.ID;
            let rows = await SELECT("*").from(req.target).where({ id: guid });
            switch (rows[0].status_code) {
                case 'PEND':
                    await UPDATE(req.target, guid).with({ status_code: 'REJE' });
                    break;
                case 'REJE':
                    req.error(200, 'Timesheet is already Rejected');
                    break;
                default:
                    req.error(400, `Please select a Timesheet in status 'Pending Approval'`);
                    break;
            }
        });

        // Add base class's handlers. Handlers registered above go first.
        return super.init();
    }
}
module.exports = TimesheetService
